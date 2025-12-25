'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { CopyIcon, DownloadIcon } from 'lucide-react'
import { AdUnit } from '@/components/ads/AdUnit'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  const formatJson = (spaces: number = 2) => {
    try {
      if (!input.trim()) {
        toast.error('Please enter some JSON to format')
        return
      }
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, spaces)
      setOutput(formatted)
      setError('')
      setValidationMessage('JSON is valid and has been formatted.')
      toast.success('JSON formatted successfully')
    } catch (err) {
      setError((err as Error).message)
      setValidationMessage('')
      toast.error('Invalid JSON')
    }
  }

  const validateJson = () => {
    try {
      if (!input.trim()) {
        toast.error('Please enter some JSON to validate')
        return
      }
      JSON.parse(input)
      setError('')
      setValidationMessage('JSON is well‑formed.')
      toast.success('Valid JSON')
    } catch (err) {
      setError((err as Error).message)
      setValidationMessage('')
      toast.error('Invalid JSON')
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setValidationMessage('')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast.success('Copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const downloadJson = () => {
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('JSON file downloaded')
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Paste your JSON here..."
            className="min-h-[200px] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => formatJson(2)}>Format (2 spaces)</Button>
            <Button onClick={() => formatJson(4)}>Format (4 spaces)</Button>
            <Button variant="outline" onClick={() => formatJson(0)}>Minify</Button>
            <Button variant="outline" onClick={validateJson}>
              Validate
            </Button>
            <Button variant="ghost" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-red-500">
          <p className="text-red-500 text-sm whitespace-pre-wrap break-words">{error}</p>
        </Card>
      )}

      {!error && validationMessage && (
        <Card className="p-4 border-green-500">
          <p className="text-green-600 text-sm">{validationMessage}</p>
        </Card>
      )}

      {output && !error && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={downloadJson}>
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <pre className="whitespace-pre-wrap break-all bg-secondary p-4 rounded-md overflow-x-auto">
              {output}
            </pre>
          </div>
        </Card>
      )}

      <AdUnit type="in-article" className="my-8" />
    </div>
  )
} 