import { db } from '@/config/firebase'
import Anthropic from '@anthropic-ai/sdk'
import {
  addDoc,
  collection,
  getDoc,
  doc,
  where,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  DocumentReference,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { telynxNumberLookup } from '@/lib/telynxNumberLookup'
import { neverbounceEmailLookup } from '@/lib/neverboundEmailLookup'

const CLAUDE_KEY = process.env.CLAUDE_APIKEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chat_id, warm_up } = body.data

    if (warm_up) {
      return NextResponse.json({ status: 'WARM_UP' })
    }

    const status = await callGenerateResponse(chat_id)

    console.log('status', status)

    return NextResponse.json(status)
  } catch (error) {
    console.error('Error in API route: ', error)
    return NextResponse.json({ status: 'ERROR' })
  }
}

async function callGenerateResponse(chatId: string, callOverride?: boolean): Promise<string> {
  const messagesRef = collection(db, 'chats', chatId, 'messages')

  const messagesSnapshot = await getDocs(
    query(messagesRef, where('receiverId', '!=', 'system'), orderBy('created', 'asc')),
  )

  const initialMessageCount = messagesSnapshot.docs.length

  const threadRef = doc(collection(db, 'chats'), chatId)
  const threadSnapshot = await getDoc(threadRef)

  const thread = threadSnapshot.data()!

  let messages = formatMessages(
    messagesSnapshot.docs.map((doc) => doc.data()),
  ) as Anthropic.Messages.MessageParam[]

  // console.log('messages', JSON.stringify(messages, null, 2))
  if (!callOverride && (findLastMsgType(messages) || thread.submittingLead)) {
    return 'NO_RESPONSE_GENERATED'
  }
  let questionsDescriptions = ''

  for (let i = 0; i < thread.funnelQuestions.length; i++) {
    const q = thread.funnelQuestions[i].question.value
    if (q.name !== 'Legal Issue Description') {
      const a = thread.funnelQuestions[i].question.value.answer[0]
      questionsDescriptions += `- ${q.question} The user's response should contain sufficient detail to allow you to infer the most appropriate answer from the following options: ${a.options.map((o: any) => o.label).join(', ')}.\n\n`
    }
  }

  const system = `You are Izan Davis, a legal assistant. You are now engaged in a live chat conversation with a 
        user who is seeking information for a free legal consultation from 
        a leadTypeMapReadable[thread.landing_page] lawyer. Please keep your responses concise and 
        conversational, as if you were exchanging instant messages with the user. Aim for responses that 
        are around 50 characters or less, while still providing the necessary information or asking 
        relevant questions. Avoid lengthy explanations or going into too much detail. Focus on 
        maintaining a natural, human-like tone throughout the conversation.

        Make sure you greet user one first message. Only ask for one piece of information at a time.
        
        You need to collect the following information, info is required:
  
        - A short description of their legal issue, a couple words is fine.
        ${questionsDescriptions}
        - The city & state they are located
        - The person's full name
        - The person's validated phone number
        - The person's validated email address
        
        Keep the conversation focused on collecting this information to set up a free consultation 
        with a lawyer. Do not answer any other questions; you are only to collect the above info. 
        If any direct questions are asked, simply state that you are unsure but the lawyer can help 
        them in the consultation.

        If the user starts the conversation with 'Something else' ask them to describe there legal issue.
        
        Before responding, please think about it step-by-step within <thinking></thinking> tags. 
        Then, provide your next message in <answer></answer> tags.
        
        When referring to a specific lawyer, avoid using subjective or comparative language 
        such as "top-rated," "best," or "leading."

        If the city and state provided does make sense as for clarification.
        
        If the user is hesitant, unsure, or does not want to provide their contact information, 
        reassure them that their information will be kept confidential and will only be used to 
        set up the free consultation with a lawyer. You can say something like:
        
        "I understand your concerns about sharing personal information. Rest assured that your 
        contact details will be kept strictly confidential and will only be used to arrange 
        your free consultation with a lawyer." 
        
        To validate the phone number use the tool: validatePhone

        To validate the email use the tool: validateEmail 
        
        If the phone number or email is invalid, prompt the user to provide a valid one before proceeding.

        If an email or phone is already checked DO NOT check again. Only check each unique phone or email once.
        
        Once email and phone have returned valid responses and all the information is collected 
        and use the tool: submitChat with chatId: ${chatId} 

        After successfully submitting the chat, simply provide your final response to the user within <answer> tags.
         Do not include any <thinking> tags or call any more tools at this point.

        The chat submission will return a status field that will either be 'lawyerFound' or 'noLawyerFound'. 
        Both statuses are considered a successful call of tool submitChat.
        
        If chat submission finds a lawyer the user will be provided the requestUrl link to the lawyer's profile 
        and inform the user they will receive a phone call from callingFrom_phoneNumber in
         1 minute to connect them to the lawyer. Remind them to make sure to answer it.

        If that chat submission does not find a lawyer: Let the user know this is because we don't have a
         lawyer who services the physical jurisdiction they need legal help. Our coverage is always changing.

        If a submission was already attempted do not try again. 
        
        If the user sends any more messages after chat submission push the conversation to closing or 
        state the lawyer will take care of the rest if successfully connected. 
        You can also give them the lawyer profile url again.`

  const resp = await generateChatMessage(system, messages, threadRef, messagesRef)
  //   console.log('generateClaude response', resp)

  const updatedMessagesSnapshot = await getDocs(
    query(messagesRef, where('receiverId', '!=', 'system'), orderBy('created', 'asc')),
  )

  const updatedMessageCount = updatedMessagesSnapshot.docs.length

  if (!callOverride && updatedMessageCount !== initialMessageCount) {
    return 'ANOTHER_RESPONSE_STARTED'
  }

  if (resp.type === 'text') {
    await sendMessage(resp.text, threadRef, messagesRef)
    return 'TEXT_RESPONSE_GENERATED'
  }

  if (resp.type === 'toolUse') {
    let readyForSubmission = false
    const submitChatResp = isSubmitChatResp(resp)

    if (!submitChatResp) {
      readyForSubmission = await checkSubmissionReadyTesting(questionsDescriptions, messages, resp)
    }

    if (readyForSubmission) {
      await updateDoc(threadRef, {
        submittingLead: true,
      })
      await sendMessage(
        'Got it. One moment while I set up your free consultation.',
        threadRef,
        messagesRef,
      )
    }
    await addDoc(messagesRef, {
      ...resp.input,
    })
    await addDoc(messagesRef, {
      ...resp.result,
    })

    if (readyForSubmission) {
      return await callGenerateResponse(chatId, true)
    }

    if (submitChatResp) {
      await callGenerateResponse(chatId)
      return 'CONVERSION'
    }

    return await callGenerateResponse(chatId)
  }
  return 'NO_ACTION'
}

// export const testCheck = onRequest(async (req, res) => {
//     res.send(await checkSubmissionReadyTesting())
// })

async function checkSubmissionReadyTesting(
  questionsDescriptions: string,
  messages: any[],
  toolResp: any,
): Promise<boolean> {
  const checkMessages = [
    ...messages,
    {
      role: toolResp.input.receiverId,
      content: [...toolResp.input.content],
    },
    {
      role: toolResp.result.receiverId,
      content: [
        ...toolResp.result.content,
        {
          type: 'text',
          text: `Please determine if all the following information is in this thread and that the email and 
                    phone have been validated with a tool (Do not all call a tool, ). 
                    All pieces of information must be provided to return "true", if its not return "false". 
                    If all pieces of information are not included return false. 
                    Do not call a tool. Only return "true" or "false" not explaining or thinking text. \n  
                        - A short description of their legal issue, a couple words is fine.
                        ${questionsDescriptions}
                        - The city & state they are located
                        - The person's full name
                        - The person's phone number validated by a tool
                        - The person's email address validated by a tool`,
        },
      ],
    },
  ]

  console.log(checkMessages[15])

  const resp: string = await generateClaude(
    checkMessages as Anthropic.Messages.MessageParam[],
    'claude-3-5-sonnet-20240620',
  )

  return resp.includes('true')
}

const isEmailValidResp = (resp: any): boolean => {
  const inputContent = resp.input.content
  const resultContent = resp.result.content

  const hasEmailValidationInput = inputContent.some((block: any) => block.name === 'validateEmail')

  const hasValidEmailResult = resultContent.some((block: any) =>
    block.content.some((b: any) => b.text.includes('Result: {"valid":true}')),
  )

  return hasEmailValidationInput && hasValidEmailResult
}

const isSubmitChatResp = (resp: any): boolean => {
  const inputContent = resp.input.content
  const resultContent = resp.result.content

  const hasSubmitChatInput = inputContent.some((block: any) => block.name === 'submitChat')

  const isSubmitChatResult = resultContent.some((block: any) =>
    block.content.some((b: any) => b.text.includes('"status":')),
  )

  return hasSubmitChatInput && isSubmitChatResult
}

function findLastMsgType(messages: any[]): boolean {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message.type === 'message') {
      return message.role === 'assistant'
    }
  }
  return false
}

function formatMessages(messages: any) {
  const formattedMessages: any[] = []
  let currentRole = null
  let currentContent: any = ''
  for (const message of messages) {
    const role = message.receiverId
    if (role !== currentRole) {
      if (currentRole !== null) {
        formattedMessages.push({
          role: currentRole,
          content: currentContent,
        })
      }
      currentRole = role
      currentContent = ''
    }
    if (message.type === 'toolUse') {
      if (currentContent instanceof String && currentContent !== '') {
        const textBlock = { type: 'text', text: currentContent }
        currentContent = [textBlock, ...message.content]
      } else {
        if (currentContent instanceof Array) {
          currentContent = [...currentContent, ...message.content]
        } else {
          currentContent = message.content
        }
      }
    } else if (message.receiverId !== 'system') {
      if (currentContent instanceof String) {
        currentContent += message.message + '\n'
      } else {
        const textBlock = { type: 'text', text: message.message }
        currentContent = [...currentContent, textBlock]
      }
    }
  }
  if (currentRole !== null) {
    formattedMessages.push({
      role: currentRole,
      content: currentContent,
    })
  }
  return formattedMessages
}

async function sendMessage(
  message: string,
  threadRef: DocumentReference<DocumentData, DocumentData>,
  messagesRef: CollectionReference<DocumentData, DocumentData>,
) {
  await updateDoc(threadRef, {
    latestMessage: message,
    updated: serverTimestamp(),
  })

  await addDoc(messagesRef, {
    message,
    receiverId: 'assistant',
    type: 'message',
    created: serverTimestamp(),
  })
}

async function generateChatMessage(
  system: string,
  messages: Anthropic.Messages.MessageParam[],
  threadRef: DocumentReference<DocumentData, DocumentData>,
  messagesRef: CollectionReference<DocumentData, DocumentData>,
): Promise<any> {
  const apiKey = CLAUDE_KEY
  const model = 'claude-3-opus-20240229'

  const anthropic = new Anthropic({
    apiKey,
  })

  let params: Anthropic.MessageCreateParams = {
    max_tokens: 1000,
    messages,
    system,
    stream: false,
    model,
    temperature: 0.0,
    tools: [
      {
        name: 'validatePhone',
        description:
          'Check with a third party authorities phone number is valid. Only one valid email needs to be found. ',
        input_schema: {
          type: 'object',
          properties: {
            phone: {
              type: 'string',
              description:
                'The phone number extracted from the users in the following in one of the following format: +12345678909, or 2345678909, or (234) 567-8909, or 234-567-8909, or international numbers okay. Do not add any test to the input.',
            },
          },
          required: ['phone'],
        },
      },
      {
        name: 'validateEmail',
        description:
          'Check with a third party authorities if email is valid. Only one valid email needs to be found. Do create any information that is not explicity provided by the user.',
        input_schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description:
                'The email to check. Do create any information that is not explicity provided by the user.',
            },
          },
          required: ['email'],
        },
      },
      {
        name: 'submitChat',
        description: 'Submit chat info only after all information is collected',
        input_schema: {
          type: 'object',
          properties: {
            chatId: {
              type: 'string',
              description: 'The chat id string identifying the conversation',
            },
          },
          required: ['chatId'],
        },
      },
    ],
  }

  try {
    console.log('calling claude')
    const message: Anthropic.Message = await anthropic.messages.create(params)
    let text = ''
    let tools: any = []
    let toolsResults: any = []

    // console.log('message', message)

    for (let i = 0; i < message.content.length; i++) {
      console.log('content', message.content[i])
      if (message.content[i].type === 'text') {
        text += extractAnswerText((message.content[i] as any).text) + '\n\n'
      } else {
        tools.push(message.content[i])
        const toolResp = await runTool(message.content[i], threadRef, messagesRef, messages)
        toolsResults.push({
          toolUseId: (message.content[i] as any).id,

          type: 'toolResult',

          content: [
            {
              type: 'text',
              text: `Result: ${JSON.stringify(toolResp)}`,
            },
          ],
        })
      }
    }
    if (tools.length > 0) {
      // add input mess
      return {
        type: 'toolUse',
        input: {
          content: message.content,
          receiverId: 'assistant',
          type: 'toolUse',
          created: serverTimestamp(),
        },
        result: {
          content: toolsResults,
          receiverId: 'user',
          created: serverTimestamp(),
          type: 'toolUse',
        },
      }
    }

    return { type: 'text', text: text.trim() }
  } catch (error) {
    console.error('Error generating haiku:', error)
    throw error
  }
}

async function runTool(
  content: any,
  threadRef: DocumentReference<DocumentData, DocumentData>,
  messagesRef: CollectionReference<DocumentData, DocumentData>,
  messages: Anthropic.Messages.MessageParam[],
) {
  switch (content.name) {
    case 'validatePhone':
      return await validatePhone(content.input.phone)
    case 'validateEmail':
      return await validateEmail(content.input.email, threadRef, messagesRef)
    case 'submitChat':
      return await submitChat(content.input.chatId, threadRef, messages)
    default:
      return null
  }
}

function extractAnswerText(text: string): string {
  let pattern = /<answer>(.*?)<\/answer>/gs
  const matches = text.match(pattern)

  if (matches && matches.length > 0) {
    return matches[0].replace(/<\/?answer>/g, '')
  }

  pattern = /<thinking>.*?<\/thinking>/gs
  const parse1 = text.replace(pattern, '')
  const parse2 = parse1.split('</thinking>')[1]
  return parse2 ?? parse1
}

async function submitChat(
  chatId: string,
  threadRef: DocumentReference<DocumentData, DocumentData>,
  messages: Anthropic.Messages.MessageParam[],
) {
  const threadSnapshot = await getDoc(threadRef)
  const thread = threadSnapshot.data()!

  let jsonQuestions = ''
  let questionsDescriptions = ''

  for (let i = 0; i < thread.funnelQuestions.length; i++) {
    const q = thread.funnelQuestions[i].question.value
    if (q.name !== 'Legal Issue Description') {
      const a = thread.funnelQuestions[i].question.value.answer[0]
      jsonQuestions += `"${a.name}": "${a.options[a.options.length - 1].label}",\n\n`
      console.log('answer', a)
      questionsDescriptions += `${a.name}: We asked this question: ${q.question} The possible answers for this question are: ${a.options.map((o: any) => o.label).join(', ')}. Based on the user's response, analyze the content and context to determine which one option best matches their input. Consider key words, sentiment, and implied meaning in the user's message. Select the one most appropriate option. \n\n`
    }
  }
  const prompt = ` Here is a chat thread from a live chat agent please extract the following information and return a json object in this format.

        Here are the fields with example values:
        {
            ${jsonQuestions}
            "description": "I need legal help.",
            "city": "Vancouver",
            "state": "WA",
            "firstName": "Colby",
            "lastName": "Gilbert",
            "phone": "+12345678909",
            "phoneRegionCode": 'US',
            "email": "colby@example.com"
        }

        Here are the fields with a description and instructions to find each.

        ${questionsDescriptions}
        description:  A brief description of the user's legal issue. Minimum one short sentence. You can combine answers from the user, but do not create any information that is not explicity provided by the user.
        city: The city the user is located in. This should be extracted exactly no inferred information.
        state: The state the user is located in. This should be extracted exactly no inferred information.,
        firstName: "The first name of the user. This should be extracted exactly no inferred information.",
        lastName: "The last name of the user. This should be extracted exactly no inferred information.",
        phone: The phone number from the verify phone number tool use call response. This should be extracted exactly no inferred information.
        phoneRegionCode: The region code of the phone number from the verify phone number tool use call response. This should be extracted exactly no inferred information.
        email: The email that returned as verified from the tool use call. This should be extracted exactly no inferred information.  

        Make sure to actually output the resulting JSON object.
    
    `

  if (messages[messages.length - 1].content instanceof Array) {
    ;(messages[messages.length - 1].content as any[]).push({
      type: 'text',
      text: prompt,
    } as any)
  } else {
    messages[messages.length - 1].content += '\n\n' + prompt
  }

  console.log(JSON.stringify(messages, null, 2))

  const resp = await generateClaude(messages)

  console.log('submitChat response', resp)

  let extractedObj: any

  try {
    const extractedTextObj = resp.match(/\{.*?\}/s)?.[0]
    extractedObj = JSON.parse(extractedTextObj)
  } catch (error) {
    console.log('error', error)
    return { noLawyer: true }
  }

  let submissionObj: any = { funnelResponses: [] }

  for (let i = 0; i < thread.funnelQuestions.length; i++) {
    const q = thread.funnelQuestions[i].question.value
    const a = thread.funnelQuestions[i].question.value.answer[0]
    if (extractedObj.hasOwnProperty(a.name)) {
      if (q.name === 'Legal Issue Description') {
        submissionObj.funnelResponses.push({
          type: 'description',
          value: extractedObj[a.name],
          label: 'Issue',
        })
      } else {
        submissionObj.funnelResponses.push({
          type: a.name,
          label: a.label,
          valueLabel: extractedObj[a.name],
          value: a.options.find((o: any) => o.label === extractedObj[a.name])?.label ?? '',
        })
      }
    }
  }

  submissionObj.city = extractedObj.city
  submissionObj.state = extractedObj.state
  submissionObj.firstName = extractedObj.firstName
  submissionObj.lastName = extractedObj.lastName
  submissionObj.phone = extractedObj.phone
  submissionObj.phoneRegionCode = extractedObj.phoneRegionCode
  submissionObj.email = extractedObj.email
  submissionObj.landing_page = thread.landing_page
  submissionObj.landingUrl = thread.landingUrl
  submissionObj.userAgent = thread.userAgent
  submissionObj.ipAddress = thread.ipAddress
  submissionObj.chatId = chatId
  submissionObj.created = thread.created
  submissionObj.updated = thread.updated
  submissionObj.submitted = serverTimestamp()

  const newLeadHelper: any = () => {} //await import('../leads/leads-utils.js')

  const lawyerRequest: any = await newLeadHelper({
    ...submissionObj,
    ...thread.query_params,
  })

  console.log('lawyerRequest', lawyerRequest)

  await updateDoc(threadRef, {
    submittingLead: false,
  })
  if (lawyerRequest.status === 'lawyerFound') {
    return {
      status: 'lawyerFound',
      requestUrl: lawyerRequest.requestUrl,
      callingFrom_phoneNumber: lawyerRequest.callingFrom_phoneNumber,
    }
  }

  return { status: 'noLawyerFound' }
}

async function validatePhone(phoneNumber: string) {
  try {
    return telynxNumberLookup(phoneNumber)
  } catch (error) {
    console.error('Error validating phone number:', error)
    throw new Error('Phone validation failed')
  }
}

async function validateEmail(
  email: string,
  threadRef: DocumentReference<DocumentData, DocumentData>,
  messagesRef: CollectionReference<DocumentData, DocumentData>,
) {
  try {
    const resp = await neverbounceEmailLookup(email)
    return resp
  } catch (error) {
    console.error('Error validating email:', error)
    throw new Error('Email validation failed')
  }
}

async function generateClaude(
  messages: Anthropic.Messages.MessageParam[],
  model?: string,
): Promise<any> {
  const apiKey = CLAUDE_KEY

  const anthropic = new Anthropic({
    apiKey,
  })

  let params: Anthropic.MessageCreateParams = {
    max_tokens: 1000,
    messages,
    stream: false,
    model: model ?? 'claude-3-opus-20240229',
    temperature: 0.0,
    tools: [
      {
        name: 'validatePhone',
        description:
          'Check with a third party authorities phone number is valid. Only one valid email needs to be found. ',
        input_schema: {
          type: 'object',
          properties: {
            phone: {
              type: 'string',
              description:
                'The phone number extracted from the users in the following in one of the following format: +12345678909, or 2345678909, or (234) 567-8909, or 234-567-8909, or international numbers okay. Do not add any test to the input.',
            },
          },
          required: ['phone'],
        },
      },
      {
        name: 'validateEmail',
        description:
          'Check with a third party authorities if email is valid. Only one valid email needs to be found. Do create any information that is not explicity provided by the user.',
        input_schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description:
                'The email to check. Do create any information that is not explicity provided by the user.',
            },
          },
          required: ['email'],
        },
      },
    ],
  }
  try {
    const message: Anthropic.Message = await anthropic.messages.create(params)

    let text = ''

    for (let i = 0; i < message.content.length; i++) {
      console.log('content', message.content[i])
      if (message.content[i].type === 'text') {
        text += extractAnswerText((message.content[i] as any).text) + '\n\n'
      }
    }

    return text.trim()
  } catch (error) {
    console.error('Error generating:', error)
    throw error
  }
}
