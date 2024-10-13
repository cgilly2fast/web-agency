import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'microsoft-identity-association.json')
    const fileContents = await fs.promises.readFile(filePath, 'utf8')
    const jsonData = JSON.parse(fileContents)

    // Return the JSON data
    return NextResponse.json(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error reading microsoft-identity-association.json:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
