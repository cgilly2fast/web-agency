import React from 'react'
import { AdminViewProps, PaginatedDocs } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, RenderTitle } from '@payloadcms/ui'
import IntegrationsPage from './component/IntegrationPage'
import { AuthToken, Firm, Integration, Media } from '@/payload-types'

export type ConnectedIntegration = Integration & {
  connected?: boolean
  connectedTo?: string[] | null
}

const Integrations: React.FC<AdminViewProps> = async ({ initPageResult, params, searchParams }) => {
  const start = performance.now()
  const { payload, user } = initPageResult.req

  if (!user) {
    return null
  }
  // const authSnapshot = await payload.find({
  //   collection: 'auth-tokens',
  //   limit: 333,
  //   depth: 0,
  // })

  // const snapshot: PaginatedDocs<ConnectedIntegration> = await payload.find({
  //   collection: 'integrations',
  //   limit: 333,
  // })

  let [authSnapshot, integrationsSnapshot] = await Promise.all([
    payload.find({
      collection: 'auth-tokens',
      where: {
        user: {
          equals: user.id,
        },
      },
      limit: 333,
      depth: 0,
    }),
    payload.find({
      collection: 'integrations',
      limit: 333,
    }),
  ])

  if (integrationsSnapshot.docs.length === 0) return null
  let snapshot = integrationsSnapshot as PaginatedDocs<ConnectedIntegration>

  const map: Record<string, ConnectedIntegration[]> = {}
  const authMap: Record<string, AuthToken> = {}

  for (let i = 0; i < authSnapshot.docs.length; i++) {
    const doc = authSnapshot.docs[i]
    authMap[doc.id] = doc
  }
  let gCalendar: ConnectedIntegration
  let gMeet: ConnectedIntegration
  for (let i = 0; i < snapshot.docs.length; i++) {
    let doc = snapshot.docs[i]
    if (doc.name === 'Google Calendar') {
      gCalendar = doc
    }
    if (doc.name === 'Google Meet') {
      gMeet = doc
    }
    if (authMap[doc.id]) {
      doc['connected'] = true
      if (doc.connectedTo) {
        doc.connectedTo.push(authMap[doc.id].accountEmail!)
      } else {
        doc.connectedTo = [authMap[doc.id].accountEmail!]
      }
    } else {
      doc['connected'] = false
      doc['connectedTo'] = []
    }

    if (map[doc.group!]) {
      map[doc.group!].push(doc)
    } else {
      map[doc.group!] = [doc]
    }
  }

  gMeet!.connected = true //gCalendar!.connected
  gMeet!.connectedTo = ['colby@firmleads.io'] //gCalendar!.connectedTo

  const sections = [
    { name: 'Calendars', integrations: map['Calendars'] },
    { name: 'Video Conferencing', integrations: map['Video Conferencing'] },
    { name: 'Sales & CRM', integrations: map['Sales & CRM'] },
    { name: 'Email Messaging', integrations: map['Email Messaging'] },
    { name: 'Payments', integrations: map['Payments'] },
  ]
  const end = performance.now()
  console.log(`Integrations Execution time: ${end - start} milliseconds`)
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req?.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <RenderTitle className={`doc-header__title`} title="Integrations & Apps" />
      </Gutter>
      <IntegrationsPage
        sections={sections}
        firmLogo={(user.firm as Firm).logo as Media}
        firmLogoDark={(user.firm as Firm).logoDarkMode as Media}
      />
    </DefaultTemplate>
  )
}

export default Integrations
