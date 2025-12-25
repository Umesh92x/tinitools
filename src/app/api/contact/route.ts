import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Store the query
    const queryData = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: 'new'
    }

    // Save to JSON file
    const dataDir = join(process.cwd(), 'data')
    const filePath = join(dataDir, 'queries.json')
    
    try {
      // Create data directory if it doesn't exist
      await mkdir(dataDir, { recursive: true })
      
      // Read existing queries
      let queries: Array<typeof queryData> = []
      try {
        const existingData = await readFile(filePath, 'utf-8')
        queries = JSON.parse(existingData)
        if (!Array.isArray(queries)) {
          queries = []
        }
      } catch {
        // File doesn't exist yet, start with empty array
        queries = []
      }
      
      // Add new query at the beginning (most recent first)
      queries.unshift(queryData)
      
      // Keep only last 1000 queries to prevent file from getting too large
      if (queries.length > 1000) {
        queries = queries.slice(0, 1000)
      }
      
      // Save back to file
      await writeFile(filePath, JSON.stringify(queries, null, 2), 'utf-8')
      
      console.log('Query saved successfully:', { id: queryData.id, name: queryData.name, email: queryData.email })
    } catch (fileError) {
      console.error('Error saving query to file:', fileError)
      // Still return success even if file save fails (graceful degradation)
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Your query has been received. We will get back to you soon!' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

