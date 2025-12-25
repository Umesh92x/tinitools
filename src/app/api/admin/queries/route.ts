import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// GET - Fetch all queries
export async function GET(request: NextRequest) {
  try {
    const dataDir = join(process.cwd(), 'data')
    const filePath = join(dataDir, 'queries.json')

    let queries: any[] = []
    try {
      const existingData = await readFile(filePath, 'utf-8')
      queries = JSON.parse(existingData)
      if (!Array.isArray(queries)) {
        queries = []
      }
    } catch {
      // File doesn't exist yet
      queries = []
    }

    return NextResponse.json({ queries }, { status: 200 })
  } catch (error) {
    console.error('Error fetching queries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch queries' },
      { status: 500 }
    )
  }
}

// PATCH - Update query status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const dataDir = join(process.cwd(), 'data')
    const filePath = join(dataDir, 'queries.json')

    let queries: any[] = []
    try {
      const existingData = await readFile(filePath, 'utf-8')
      queries = JSON.parse(existingData)
      if (!Array.isArray(queries)) {
        queries = []
      }
    } catch {
      return NextResponse.json(
        { error: 'No queries found' },
        { status: 404 }
      )
    }

    // Update the query status
    queries = queries.map((query) =>
      query.id === id ? { ...query, status } : query
    )

    // Save back to file
    await writeFile(filePath, JSON.stringify(queries, null, 2), 'utf-8')

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error updating query:', error)
    return NextResponse.json(
      { error: 'Failed to update query' },
      { status: 500 }
    )
  }
}

