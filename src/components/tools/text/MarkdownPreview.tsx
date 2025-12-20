'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const defaultMarkdown = `# Welcome to Markdown Preview

This is a **live** markdown editor with _instant_ preview.

## Features

- GitHub Flavored Markdown
- Math equations (KaTeX)
- Tables
- Code blocks
- And more!

### Example Table

| Feature | Support |
|---------|---------|
| Tables | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Math | ✅ |

### Example Code Block

\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\`

### Example Math

Inline math: $E = mc^2$

Block math:

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

Try editing the text on the left to see the preview update in real-time!`

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const copyHtml = () => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = document.querySelector('.markdown-preview')?.innerHTML || ''
    
    // Clean up the HTML
    const cleanHtml = tempDiv.innerHTML
      .replace(/<button[^>]*>.*?<\/button>/g, '') // Remove buttons
      .replace(/class="[^"]*"/g, '') // Remove classes
      .trim()

    navigator.clipboard.writeText(cleanHtml)
    setToastMessage('HTML copied to clipboard!')
    setToastType('success')
    setShowToast(true)
  }

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown)
    setToastMessage('Markdown copied to clipboard!')
    setToastType('success')
    setShowToast(true)
  }

  const clearAll = () => {
    setMarkdown('')
    setToastMessage('Content cleared')
    setToastType('success')
    setShowToast(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Markdown Input
              </label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Enter markdown here..."
                rows={20}
                className="w-full font-mono text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={copyMarkdown}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Copy Markdown
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Preview
              </h3>
              <button
                onClick={copyHtml}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Copy HTML
              </button>
            </div>
            <div className="prose max-w-none markdown-preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Markdown Guide
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Basic Syntax</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p># Heading 1</p>
                  <p>## Heading 2</p>
                  <p>**Bold text**</p>
                  <p>*Italic text*</p>
                  <p>- List item</p>
                  <p>[Link](url)</p>
                  <p>![Image](url)</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Extended Features</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>```language - Code blocks</p>
                  <p>| Table | Header | - Tables</p>
                  <p>$E = mc^2$ - Math equations</p>
                  <p>~~Strikethrough~~</p>
                  <p>- [x] Task lists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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