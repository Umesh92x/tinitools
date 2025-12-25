'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'
import { PDFDocument } from 'pdf-lib'

interface PDFFile {
  id: string
  file: File
  name: string
  size: string
  pageCount: number | null
}

export function PDFMerger() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [merging, setMerging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')

  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
  const MAX_TOTAL_SIZE = 500 * 1024 * 1024 // 500MB total

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null)
    const skippedFiles: string[] = []
    const validFiles: PDFFile[] = []

    // Process files and add them to state
    setFiles((prevFiles) => {
      let totalSize = prevFiles.reduce((sum, f) => sum + f.file.size, 0)

      acceptedFiles.forEach((file) => {
        if (file.type !== 'application/pdf') {
          skippedFiles.push(file.name)
          return
        }

        if (file.size > MAX_FILE_SIZE) {
          skippedFiles.push(`${file.name} (too large)`)
          return
        }

        totalSize += file.size
        if (totalSize > MAX_TOTAL_SIZE) {
          skippedFiles.push(`${file.name} (total size limit exceeded)`)
          return
        }

        validFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: formatFileSize(file.size),
          pageCount: null, // Will be updated async
        })
      })

      // Return updated files list
      return [...prevFiles, ...validFiles]
    })

    // Get page counts for valid files (async, non-blocking)
    if (validFiles.length > 0) {
      validFiles.forEach((pdfFile) => {
        // Load page count asynchronously
        import('pdf-lib')
          .then(({ PDFDocument }) => pdfFile.file.arrayBuffer())
          .then((arrayBuffer) => PDFDocument.load(arrayBuffer))
          .then((pdf) => {
            const pageCount = pdf.getPageCount()
            setFiles((prev) =>
              prev.map((f) =>
                f.id === pdfFile.id ? { ...f, pageCount } : f
              )
            )
          })
          .catch((err) => {
            // Page count failed, but we'll still keep the file
            console.warn(`Could not get page count for ${pdfFile.name}:`, err)
          })
      })
    }

    // Handle messages and errors (outside setState)
    if (skippedFiles.length > 0) {
      setError(`Skipped: ${skippedFiles.join(', ')}`)
      showMessage(`Some files were skipped: ${skippedFiles.length} file(s)`, 'error')
    }

    if (validFiles.length > 0) {
      showMessage(`${validFiles.length} PDF file(s) added`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  })

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(files)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFiles(items)
  }

  const mergePDFs = async () => {
    if (files.length < 2) {
      const errorMsg = 'Please add at least 2 PDF files to merge.'
      setError(errorMsg)
      showMessage(errorMsg, 'error')
      return
    }

    try {
      setMerging(true)
      setProgress(0)
      setError(null)
      setDownloadUrl(null)
      setStatus('Starting merge process...')
      
      const mergedPdf = await PDFDocument.create()
      let totalPages = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setStatus(`Processing file ${i + 1} of ${files.length}: ${file.name}...`)
        
        try {
          const arrayBuffer = await file.file.arrayBuffer()
          const pdf = await PDFDocument.load(arrayBuffer)
          const pageIndices = pdf.getPageIndices()
          totalPages += pageIndices.length
          
          const copiedPages = await mergedPdf.copyPages(pdf, pageIndices)
          copiedPages.forEach((page) => mergedPdf.addPage(page))
          
          setProgress(((i + 1) / files.length) * 100)
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error'
          
          // Check for specific error types
          if (errorMsg.includes('password') || errorMsg.includes('encrypted')) {
            throw new Error(`"${file.name}" is password-protected. Please remove the password and try again.`)
          } else if (errorMsg.includes('corrupted') || errorMsg.includes('invalid')) {
            throw new Error(`"${file.name}" appears to be corrupted or invalid. Please check the file and try again.`)
          } else {
            throw new Error(`Error processing "${file.name}": ${errorMsg}`)
          }
        }
      }

      setStatus('Generating merged PDF...')
      const mergedPdfFile = await mergedPdf.save()
      
      // Convert Uint8Array to Blob
      const blob = new Blob([mergedPdfFile as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      // Store download URL for manual download button
      setDownloadUrl(url)
      
      // Generate filename based on first file
      const firstFileName = files[0].name.replace('.pdf', '')
      const filename = files.length === 2 
        ? `${firstFileName}-merged.pdf`
        : `merged-${files.length}-files.pdf`
      
      // Try automatic download
      try {
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        
        // Clean up after a delay
        setTimeout(() => {
          document.body.removeChild(a)
        }, 1000)
        
        setStatus(`Merge complete! ${totalPages} pages merged. Download started automatically.`)
      } catch (downloadError) {
        setStatus(`Merge complete! ${totalPages} pages merged. Use the download button below to save your file.`)
      }

      showMessage(`Successfully merged ${files.length} PDF file(s) with ${totalPages} total pages!`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error merging PDFs'
      setError(errorMessage)
      setStatus(`Error: ${errorMessage}`)
      setDownloadUrl(null)
      showMessage(errorMessage, 'error')
    } finally {
      setMerging(false)
      setProgress(0)
    }
  }

  const handleManualDownload = () => {
    if (!downloadUrl) return
    
    const firstFileName = files[0]?.name.replace('.pdf', '') || 'merged'
    const filename = files.length === 2 
      ? `${firstFileName}-merged.pdf`
      : `merged-${files.length}-files.pdf`
    
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    showMessage('Download started!')
  }

  const handleReset = () => {
    setFiles([])
    setProgress(0)
    setError(null)
    setDownloadUrl(null)
    setStatus('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600">
                <p>
                  Drag & drop PDF files here, or{' '}
                  <span className="text-indigo-600">browse</span>
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-blue-700">
                  {files.length} file{files.length !== 1 ? 's' : ''} ready to merge
                </span>
                {(() => {
                  const totalPages = files.reduce((sum, f) => sum + (f.pageCount || 0), 0)
                  return totalPages > 0 ? (
                    <span className="text-xs text-blue-600">
                      {totalPages} total page{totalPages !== 1 ? 's' : ''}
                    </span>
                  ) : null
                })()}
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="pdf-list">
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {files.map((file, index) => (
                    <Draggable key={file.id} draggableId={file.id} index={index}>
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3-4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {file.size}
                                {file.pageCount !== null && ` • ${file.pageCount} page${file.pageCount !== 1 ? 's' : ''}`}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="space-y-3">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                mergePDFs()
              }}
              disabled={files.length < 2 || merging}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {merging ? `Merging... ${Math.round(progress)}%` : `Merge ${files.length} PDF${files.length !== 1 ? 's' : ''}`}
            </button>
            
            {(merging || status) && (
              <div className="space-y-2">
                {status && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">{status}</p>
                  </div>
                )}
                {merging && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {downloadUrl && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-medium text-green-800 mb-2">
                  ✓ Merge Complete!
                </p>
                <p className="text-sm text-green-700 mb-3">
                  Your PDFs have been merged. If the download didn't start automatically, click the button below.
                </p>
                <button
                  onClick={handleManualDownload}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Download Merged PDF
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Instructions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">1. Add PDF Files</h4>
              <p className="text-sm text-gray-600">
                Drag and drop multiple PDF files or click to browse. You can add as many files as you need.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">2. Arrange Order</h4>
              <p className="text-sm text-gray-600">
                Drag and drop files in the list to arrange them in the desired order. The PDFs will be merged in the order shown.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">3. Merge</h4>
              <p className="text-sm text-gray-600">
                Click "Merge PDFs" to combine all files into a single PDF document. The merged file will be downloaded automatically.
              </p>
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