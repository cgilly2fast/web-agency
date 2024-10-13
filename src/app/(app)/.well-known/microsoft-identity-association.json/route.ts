import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the JSON file
    const associationContent = {
      associatedApplications: [
        {
          applicationId: '40b43764-0a35-4819-96ec-6bead581d758',
        },
      ],
    }

    // Return the JSON data
    return NextResponse.json(associationContent, {
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
