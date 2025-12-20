'use client'

import { useState } from 'react'
import { minify as minifyHtml } from 'html-minifier-terser'
import { minify as minifyCss } from 'csso'
import { minify as minifyJs } from 'terser'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type CodeType = 'html' | 'css' | 'javascript'

export function CodeMinifier() {
  const [codeType, setCodeType] = useState<CodeType>('html')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null)

  const minifyCode = async () => {
    if (!input.trim()) {
      setToastMessage('Please enter some code to minify')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      let minified = ''
      const originalSize = new Blob([input]).size

      switch (codeType) {
        case 'html':
          minified = await minifyHtml(input, {
            collapseWhitespace: true,
            removeComments: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            minifyCSS: true,
            minifyJS: true,
          })
          break

        case 'css':
          const result = minifyCss(input)
          minified = result.css
          break

        case 'javascript':
          const minifyResult = await minifyJs(input, {
            compress: true,
            mangle: true,
          })
          minified = minifyResult.code || ''
          break
      }

      const minifiedSize = new Blob([minified]).size
      setOutput(minified)
      setStats({
        original: originalSize,
        minified: minifiedSize,
      })
      setToastMessage('Code minified successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage(`Error minifying ${codeType.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setToastType('error')
      setShowToast(true)
    }
  }

  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setToastMessage('Minified code copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      setToastMessage('Failed to copy to clipboard')
      setToastType('error')
      setShowToast(true)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(['html', 'css', 'javascript'] as CodeType[]).map((type) => (
          <button
            key={type}
            onClick={() => setCodeType(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              codeType === type
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Code
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter your ${codeType.toUpperCase()} code here...`}
            rows={15}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minified Output
          </label>
          <textarea
            value={output}
            readOnly
            rows={15}
            className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={minifyCode}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Minify {codeType.toUpperCase()}
        </button>

        {output && (
          <button
            onClick={handleCopy}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Copy Output
          </button>
        )}

        {stats && (
          <div className="text-sm text-gray-600 space-x-4">
            <span>Original: {formatBytes(stats.original)}</span>
            <span>Minified: {formatBytes(stats.minified)}</span>
            <span>
              Saved:{' '}
              {((1 - stats.minified / stats.original) * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <AdUnit type="in-article" className="my-8" />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 