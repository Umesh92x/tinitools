'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Mail, Calendar, User, MessageSquare } from 'lucide-react'

interface Query {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  status: string
}

export default function QueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQueries = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/queries')
      if (!response.ok) {
        throw new Error('Failed to fetch queries')
      }
      const data = await response.json()
      setQueries(data.queries || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load queries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueries()
  }, [])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/admin/queries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' }),
      })
      if (response.ok) {
        setQueries(queries.map(q => q.id === id ? { ...q, status: 'read' } : q))
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Queries</h1>
          <p className="text-gray-600">View and manage user queries from the contact form</p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Total queries: <span className="font-semibold">{queries.length}</span>
            {' • '}
            New queries: <span className="font-semibold text-indigo-600">
              {queries.filter(q => q.status === 'new').length}
            </span>
          </div>
          <Button onClick={fetchQueries} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Loading queries...</p>
          </div>
        ) : queries.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No queries yet</p>
            <p className="text-gray-500 text-sm mt-2">User queries will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {queries.map((query) => (
              <Card
                key={query.id}
                className={`p-6 ${
                  query.status === 'new' ? 'border-l-4 border-l-indigo-500 bg-indigo-50/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-lg text-gray-900">{query.name}</h3>
                      {query.status === 'new' && (
                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 ml-8">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${query.email}`}
                          className="hover:text-indigo-600 hover:underline"
                        >
                          {query.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(query.timestamp)}
                      </div>
                    </div>
                  </div>
                  {query.status === 'new' && (
                    <Button
                      onClick={() => markAsRead(query.id)}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{query.message}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

