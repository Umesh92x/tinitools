'use client'

import { useState, useEffect, useRef } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'
import { diffWords, diffChars, Change } from 'diff'

type ViewMode = 'unified' | 'split'
type DiffMode = 'words' | 'chars'

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
  const [diffStats, setDiffStats] = useState({ 
    added: 0, 
    removed: 0, 
    unchanged: 0, 
    addedWords: 0, 
    removedWords: 0 
  })
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [diffMode, setDiffMode] = useState<DiffMode>('words')
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

  const renderTextWithHighlights = (parts: Change[]) => {
    return parts.map((part, index) => {
      if (part.added) {
        return (
          <span
            key={index}
            className="bg-green-200 text-green-900 px-1 rounded font-semibold"
            title="Added"
          >
            {part.value}
          </span>
        )
      } else if (part.removed) {
        return (
          <span
            key={index}
            className="bg-red-200 text-red-900 px-1 rounded line-through font-semibold"
            title="Removed"
          >
            {part.value}
          </span>
        )
      } else {
        return <span key={index} className="text-gray-700">{part.value}</span>
      }
    })
  }

  const renderSplitView = () => {
    const leftParts: Change[] = []
    const rightParts: Change[] = []

    differences.forEach(part => {
      if (part.added) {
        rightParts.push(part)
      } else if (part.removed) {
        leftParts.push(part)
      } else {
        leftParts.push(part)
        rightParts.push(part)
      }
    })

    return (
      <div className="relative">
        <div className="flex -mx-2 mb-2 sticky top-0 bg-white z-10 border-b border-gray-200 py-2">
          <div className="flex-1 px-2">
            <div className="font-medium text-gray-700">Original Text</div>
          </div>
          <div className="flex-1 px-2">
            <div className="font-medium text-gray-700">Modified Text</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 min-h-[400px]">
          <div className="p-4 bg-gray-50 rounded border border-gray-200 overflow-auto">
            <div className="text-sm whitespace-pre-wrap break-words font-mono">
              {renderTextWithHighlights(leftParts)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded border border-gray-200 overflow-auto">
            <div className="text-sm whitespace-pre-wrap break-words font-mono">
              {renderTextWithHighlights(rightParts)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderUnifiedView = () => {
    return (
      <div className="relative">
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-sm whitespace-pre-wrap break-words">
            {differences.map((part, index) => {
              if (part.added) {
                return (
                  <span
                    key={index}
                    className="bg-green-200 text-green-900 px-1 rounded font-semibold"
                    title="Added"
                  >
                    {part.value}
                  </span>
                )
              } else if (part.removed) {
                return (
                  <span
                    key={index}
                    className="bg-red-200 text-red-900 px-1 rounded line-through font-semibold"
                    title="Removed"
                  >
                    {part.value}
                  </span>
                )
              } else {
                return <span key={index} className="text-gray-700">{part.value}</span>
              }
            })}
          </div>
        </div>
      </div>
    )
  }

  const compareDiff = () => {
    try {
      if (!text1.trim() && !text2.trim()) {
        setDifferences([])
        setDiffStats({ 
          added: 0, 
          removed: 0, 
          unchanged: 0, 
          addedWords: 0, 
          removedWords: 0 
        })
        return
      }

      // Use word-level or character-level diffing
      const diff = diffMode === 'words' ? diffWords(text1, text2) : diffChars(text1, text2)
      setDifferences(diff)

      // Calculate statistics - count actual words/chars changed
      let addedCount = 0
      let removedCount = 0
      let unchangedCount = 0
      let addedWords = 0
      let removedWords = 0
      let unchangedWords = 0

      diff.forEach(part => {
        if (part.added) {
          addedCount += part.value.length
          // Count words in added text
          const words = part.value.trim().split(/\s+/).filter(w => w.length > 0)
          addedWords += words.length
        } else if (part.removed) {
          removedCount += part.value.length
          // Count words in removed text
          const words = part.value.trim().split(/\s+/).filter(w => w.length > 0)
          removedWords += words.length
        } else {
          unchangedCount += part.value.length
          // Count words in unchanged text
          const words = part.value.trim().split(/\s+/).filter(w => w.length > 0)
          unchangedWords += words.length
        }
      })

      setDiffStats({
        added: addedCount,
        removed: removedCount,
        unchanged: diffMode === 'words' ? unchangedWords : unchangedCount,
        addedWords,
        removedWords
      })

      // Highlight first difference
      const firstDiffIndex = diff.findIndex(part => part.added || part.removed)
      if (firstDiffIndex !== -1) {
        setHighlightedLines([firstDiffIndex])
      }
    } catch (error) {
      setToastMessage('Error comparing texts')
      setToastType('error')
      setShowToast(true)
    }
  }

  // Real-time comparison
  useEffect(() => {
    const timer = setTimeout(() => {
      compareDiff()
    }, 300) // Debounce for 300ms

    return () => clearTimeout(timer)
  }, [text1, text2, viewMode, diffMode])

  const clearAll = () => {
    setText1('')
    setText2('')
    setDifferences([])
    setDiffStats({ 
      added: 0, 
      removed: 0, 
      unchanged: 0, 
      addedWords: 0, 
      removedWords: 0 
    })
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                rows={12}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
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
                rows={12}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={swapTexts}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Swap Texts
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Clear All
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
              <p className="text-xs text-blue-800">
                <strong>Tip:</strong> Comparison happens automatically as you type!
              </p>
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
                <div className="flex items-center space-x-1 mr-2">
                  <button
                    onClick={() => setDiffMode('words')}
                    className={`px-2 py-1 rounded text-xs ${
                      diffMode === 'words'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Word-level comparison"
                  >
                    Words
                  </button>
                  <button
                    onClick={() => setDiffMode('chars')}
                    className={`px-2 py-1 rounded text-xs ${
                      diffMode === 'chars'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Character-level comparison"
                  >
                    Chars
                  </button>
                </div>
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
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-md text-center border-2 border-green-200">
                  <div className="text-lg font-bold text-green-600">
                    {diffMode === 'words' ? diffStats.addedWords : diffStats.added}
                  </div>
                  <div className="text-xs text-gray-500">
                    {diffMode === 'words' ? 'Words Added' : 'Chars Added'}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-md text-center border-2 border-red-200">
                  <div className="text-lg font-bold text-red-600">
                    {diffMode === 'words' ? diffStats.removedWords : diffStats.removed}
                  </div>
                  <div className="text-xs text-gray-500">
                    {diffMode === 'words' ? 'Words Removed' : 'Chars Removed'}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-md text-center border border-gray-200">
                  <div className="text-lg font-bold text-gray-600">
                    {diffStats.unchanged}
                  </div>
                  <div className="text-xs text-gray-500">
                    {diffMode === 'words' ? 'Words Unchanged' : 'Chars Unchanged'}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-md text-center border border-gray-200">
                  <div className="text-lg font-bold text-indigo-600">
                    {diffMode === 'words' 
                      ? diffStats.addedWords + diffStats.removedWords 
                      : diffStats.added + diffStats.removed}
                  </div>
                  <div className="text-xs text-gray-500">Total Changes</div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-md relative">
              {differences.length > 0 && (
                <div className="p-2 bg-gray-100 border-b border-gray-200 flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-200 rounded inline-block"></span>
                    <span className="text-gray-600">Removed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-green-200 rounded inline-block"></span>
                    <span className="text-gray-600">Added</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-700">Normal text</span>
                  </div>
                </div>
              )}
              <div 
                ref={diffContainerRef}
                className="overflow-auto max-h-[600px] p-4 custom-scrollbar"
              >
                {differences.length > 0 ? (
                  viewMode === 'split' ? renderSplitView() : renderUnifiedView()
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Enter text in both fields to see differences highlighted in real-time
                  </p>
                )}
              </div>
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