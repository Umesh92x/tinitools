'use client'

import { useState, useEffect, useRef } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'
import { diffLines, Change } from 'diff'

type ViewMode = 'unified' | 'split'

interface MarkerInfo {
  position: number
  type: 'added' | 'removed'
  lineNumber: number
}

export function TextDiffChecker() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [differences, setDifferences] = useState<Change[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [diffStats, setDiffStats] = useState({ added: 0, removed: 0, unchanged: 0 })
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [highlightedLines, setHighlightedLines] = useState<number[]>([])
  const diffContainerRef = useRef<HTMLDivElement>(null)

  // Clear highlights after delay
  useEffect(() => {
    if (highlightedLines.length > 0) {
      const timer = setTimeout(() => {
        setHighlightedLines([])
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [highlightedLines])

  const calculateMarkerPositions = (changes: Change[]): MarkerInfo[] => {
    const markers: MarkerInfo[] = []
    let totalLines = 0
    let currentLine = 0

    // First pass: count total lines
    changes.forEach(part => {
      const lineCount = (part.value.match(/\n/g) || []).length + 1
      totalLines += lineCount
    })

    // Second pass: calculate positions
    changes.forEach((part, index) => {
      if (part.added || part.removed) {
        const lineCount = (part.value.match(/\n/g) || []).length + 1
        const position = (currentLine / totalLines) * 100
        markers.push({
          position,
          type: part.added ? 'added' : 'removed',
          lineNumber: currentLine
        })
        
        // For split view, we need to track both sides
        if (viewMode === 'split' && part.added && index > 0 && changes[index - 1].removed) {
          markers.push({
            position,
            type: 'removed',
            lineNumber: currentLine
          })
        }
      }
      const lineCount = (part.value.match(/\n/g) || []).length + 1
      currentLine += lineCount
    })

    return markers
  }

  const scrollToLine = (lineNumber: number) => {
    if (!diffContainerRef.current) return

    const container = diffContainerRef.current
    const lineHeight = 24 // Approximate height of each line
    const scrollPosition = lineHeight * lineNumber
    
    container.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    })

    setHighlightedLines([lineNumber])
  }

  const renderScrollbarMarkers = (changes: Change[]) => {
    const markers = calculateMarkerPositions(changes)

    return (
      <div className="absolute right-0 top-0 w-2 h-full pointer-events-none">
        {markers.map((marker, index) => (
          <div
            key={index}
            className={`absolute w-2 h-1.5 cursor-pointer ${
              marker.type === 'added' ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{
              top: `${marker.position}%`,
              right: '0',
            }}
            onClick={(e) => {
              e.stopPropagation()
              scrollToLine(marker.lineNumber)
            }}
          />
        ))}
      </div>
    )
  }

  const renderSplitView = () => {
    const leftLines: Change[] = []
    const rightLines: Change[] = []

    differences.forEach(part => {
      if (part.added) {
        rightLines.push(part)
      } else if (part.removed) {
        leftLines.push(part)
      } else {
        leftLines.push(part)
        rightLines.push(part)
      }
    })

    const maxLines = Math.max(leftLines.length, rightLines.length)
    const rows = []

    // Add column headers
    rows.push(
      <div key="header" className="flex -mx-2 mb-2 sticky top-0 bg-white z-10 border-b border-gray-200 py-2">
        <div className="flex-1 px-2">
          <div className="font-medium text-gray-700">Original Text</div>
        </div>
        <div className="flex-1 px-2">
          <div className="font-medium text-gray-700">Modified Text</div>
        </div>
      </div>
    )

    for (let i = 0; i < maxLines; i++) {
      const leftPart = leftLines[i]
      const rightPart = rightLines[i]
      const isHighlighted = highlightedLines.includes(i)

      rows.push(
        <div 
          key={`line-${i}`} 
          className={`flex -mx-2 ${isHighlighted ? 'highlight-line' : ''}`}
          data-line={i}
        >
          <div className="flex-1 px-2">
            {leftPart && (
              <div
                className={`p-1 rounded font-mono text-sm ${
                  leftPart.removed ? 'bg-red-50 text-red-700' : 'text-gray-700'
                }`}
              >
                {leftPart.value}
              </div>
            )}
          </div>
          <div className="flex-1 px-2">
            {rightPart && (
              <div
                className={`p-1 rounded font-mono text-sm ${
                  rightPart.added ? 'bg-green-50 text-green-700' : 'text-gray-700'
                }`}
              >
                {rightPart.value}
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="relative">
        <div className="space-y-1">{rows}</div>
      </div>
    )
  }

  const renderUnifiedView = () => {
    return (
      <div className="relative">
        <div className="space-y-1">
          {differences.map((part, index) => {
            const isHighlighted = highlightedLines.includes(index)
            return (
              <div
                key={index}
                className={`p-1 rounded font-mono text-sm ${
                  part.added
                    ? 'bg-green-50 text-green-700'
                    : part.removed
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-700'
                } ${isHighlighted ? 'highlight-line' : ''}`}
                data-line={index}
              >
                <span className="select-none mr-2">
                  {part.added ? '+' : part.removed ? '-' : ' '}
                </span>
                {part.value}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const compareDiff = () => {
    try {
      if (!text1.trim() || !text2.trim()) {
        setToastMessage('Please enter text in both fields')
        setToastType('error')
        setShowToast(true)
        return
      }

      const diff = diffLines(text1, text2)
      setDifferences(diff)

      // Calculate statistics
      const stats = diff.reduce(
        (acc, part) => {
          if (part.added) acc.added += part.count || 0
          else if (part.removed) acc.removed += part.count || 0
          else acc.unchanged += part.count || 0
          return acc
        },
        { added: 0, removed: 0, unchanged: 0 }
      )
      setDiffStats(stats)

      // Highlight first difference
      const firstDiffIndex = diff.findIndex(part => part.added || part.removed)
      if (firstDiffIndex !== -1) {
        setHighlightedLines([firstDiffIndex])
      }

      setToastMessage('Comparison completed')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Error comparing texts')
      setToastType('error')
      setShowToast(true)
    }
  }

  const clearAll = () => {
    setText1('')
    setText2('')
    setDifferences([])
    setDiffStats({ added: 0, removed: 0, unchanged: 0 })
    setToastMessage('All cleared')
    setToastType('success')
    setShowToast(true)
  }

  const swapTexts = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
    setToastMessage('Texts swapped')
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
                Original Text
              </label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter the original text here..."
                rows={10}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modified Text
              </label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter the modified text here..."
                rows={10}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={compareDiff}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Compare
              </button>
              <button
                onClick={swapTexts}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Swap
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
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Differences
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === 'split'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Side by Side
                </button>
                <button
                  onClick={() => setViewMode('unified')}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === 'unified'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Unified
                </button>
              </div>
            </div>

            {differences.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-md text-center">
                  <div className="text-lg font-bold text-green-600">
                    {diffStats.added}
                  </div>
                  <div className="text-sm text-gray-500">Lines Added</div>
                </div>
                <div className="bg-white p-3 rounded-md text-center">
                  <div className="text-lg font-bold text-red-600">
                    {diffStats.removed}
                  </div>
                  <div className="text-sm text-gray-500">Lines Removed</div>
                </div>
                <div className="bg-white p-3 rounded-md text-center">
                  <div className="text-lg font-bold text-gray-600">
                    {diffStats.unchanged}
                  </div>
                  <div className="text-sm text-gray-500">Lines Unchanged</div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-md relative">
              <div 
                ref={diffContainerRef}
                className="overflow-auto max-h-[500px] p-4 custom-scrollbar"
              >
                {differences.length > 0 ? (
                  viewMode === 'split' ? renderSplitView() : renderUnifiedView()
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Differences will appear here after comparison
                  </p>
                )}
              </div>
              {differences.length > 0 && renderScrollbarMarkers(differences)}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Enter Texts</h4>
                <p className="text-sm text-gray-600">
                  Paste the original text in the first box and the modified version
                  in the second box.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Choose View Mode</h4>
                <p className="text-sm text-gray-600">
                  Select between side-by-side or unified view to see the differences
                  in your preferred format.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Review Changes</h4>
                <p className="text-sm text-gray-600">
                  Green highlights show added text, red shows removed text.
                  Use the statistics to understand the extent of changes.
                </p>
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 6px;
          border: 2px solid #f1f1f1;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }

        .highlight-line {
          animation: highlight-pulse 2s ease-in-out;
        }

        @keyframes highlight-pulse {
          0%, 100% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(99, 102, 241, 0.1);
          }
        }
      `}</style>
    </div>
  )
} 