'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

export function PDFPageDelete() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteMode, setDeleteMode] = useState<'range' | 'custom'>('range')
  const [pageRange, setPageRange] = useState('')
  const [customPages, setCustomPages] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')

  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

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
    const pdfFile = acceptedFiles[0]
    
    if (!pdfFile) {
      setError('No file selected.')
      return
    }

    if (pdfFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      showMessage('Please upload a PDF file', 'error')
      return
    }

    if (pdfFile.size > MAX_FILE_SIZE) {
      const fileSizeMB = (pdfFile.size / (1024 * 1024)).toFixed(2)
      setError(`File size (${fileSizeMB} MB) exceeds the maximum limit of 100 MB.`)
      showMessage(`File too large: ${fileSizeMB} MB (max 100 MB)`, 'error')
      return
    }

    setFile(pdfFile)
    
    // Get page count
    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      setPageCount(pdf.getPageCount())
      showMessage(`PDF loaded: ${pdf.getPageCount()} page${pdf.getPageCount() !== 1 ? 's' : ''}`)
    } catch (err) {
      console.error('Error reading PDF:', err)
      setPageCount(null)
      if (err instanceof Error && err.message.includes('password')) {
        setError('PDF is password-protected. Please remove the password and try again.')
        showMessage('PDF is password-protected', 'error')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const parsePageNumbers = (input: string, totalPages: number): number[] => {
    const pages: number[] = []
    const parts = input.split(',').map(p => p.trim())
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()))
        if (isNaN(start) || isNaN(end)) continue
        const startPage = Math.max(1, Math.min(start, totalPages))
        const endPage = Math.max(1, Math.min(end, totalPages))
        for (let i = startPage; i <= endPage; i++) {
          if (!pages.includes(i)) pages.push(i)
        }
      } else {
        const page = parseInt(part)
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
          if (!pages.includes(page)) pages.push(page)
        }
      }
    }
    
    return pages.sort((a, b) => a - b)
  }

  const deletePages = async () => {
    if (!file || !pageCount) {
      setError('Please upload a PDF file first.')
      showMessage('Please upload a PDF file first', 'error')
      return
    }

    try {
      setDeleting(true)
      setError(null)
      setDownloadUrl(null)
      setStatus('Loading PDF file...')

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const totalPages = pdf.getPageCount()

      let pagesToDelete: number[] = []

      if (deleteMode === 'range') {
        if (!pageRange.trim()) {
          throw new Error('Please enter a page range (e.g., 1-5)')
        }
        pagesToDelete = parsePageNumbers(pageRange, totalPages)
        if (pagesToDelete.length === 0) {
          throw new Error('Invalid page range. Please check your input.')
        }
      } else if (deleteMode === 'custom') {
        if (!customPages.trim()) {
          throw new Error('Please enter page numbers (e.g., 1,3,5)')
        }
        pagesToDelete = parsePageNumbers(customPages, totalPages)
        if (pagesToDelete.length === 0) {
          throw new Error('Invalid page numbers. Please check your input.')
        }
      }

      if (pagesToDelete.length >= totalPages) {
        throw new Error('Cannot delete all pages. At least one page must remain.')
      }

      setStatus(`Removing ${pagesToDelete.length} page${pagesToDelete.length !== 1 ? 's' : ''}...`)

      // Create new PDF with remaining pages
      const newPdf = await PDFDocument.create()
      const pagesToKeep: number[] = []
      
      for (let i = 1; i <= totalPages; i++) {
        if (!pagesToDelete.includes(i)) {
          pagesToKeep.push(i)
        }
      }

      // Copy remaining pages (convert to 0-based index)
      const copiedPages = await newPdf.copyPages(
        pdf,
        pagesToKeep.map(p => p - 1)
      )
      
      copiedPages.forEach((page) => newPdf.addPage(page))

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      
      const filename = `${file.name.replace('.pdf', '')}-pages-removed.pdf`
      
      // Auto download
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 1000)
      
      showMessage(`Pages deleted successfully! ${pagesToDelete.length} page${pagesToDelete.length !== 1 ? 's' : ''} removed.`)
      setStatus(`Delete complete! ${pagesToKeep.length} page${pagesToKeep.length !== 1 ? 's' : ''} remaining.`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error deleting pages'
      setError(errorMessage)
      setStatus(`Error: ${errorMessage}`)
      showMessage(errorMessage, 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPageCount(null)
    setDeleteMode('range')
    setPageRange('')
    setCustomPages('')
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
                {file ? (
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                      {pageCount !== null && ` • ${pageCount} page${pageCount !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                ) : (
                  <p>
                    Drag & drop a PDF file here, or{' '}
                    <span className="text-indigo-600">browse</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {file && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delete Mode
                </label>
                <select
                  value={deleteMode}
                  onChange={(e) => setDeleteMode(e.target.value as 'range' | 'custom')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="range">Delete Page Range</option>
                  <option value="custom">Delete Specific Pages</option>
                </select>
              </div>

              {deleteMode === 'range' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Range to Delete
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g., 1-5"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter page range to delete (e.g., 1-5)
                  </p>
                </div>
              )}

              {deleteMode === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Numbers to Delete
                  </label>
                  <input
                    type="text"
                    value={customPages}
                    onChange={(e) => setCustomPages(e.target.value)}
                    placeholder="e.g., 1,3,5"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter page numbers separated by commas (e.g., 1,3,5)
                  </p>
                </div>
              )}

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ Warning: This action cannot be undone. Make sure you have a backup of your PDF.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={deletePages}
                  disabled={!file || deleting}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Pages'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={deleting}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Reset
                </button>
              </div>

              {(deleting || status) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">{status}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Instructions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">1. Upload PDF</h4>
              <p className="text-sm text-gray-600">
                Drag and drop your PDF file or click to browse. Maximum file size: 100MB.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">2. Select Pages to Delete</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Delete Page Range:</strong> Delete a range of pages (e.g., 1-5)</li>
                <li>• <strong>Delete Specific Pages:</strong> Delete specific pages (e.g., 1,3,5)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">3. Delete</h4>
              <p className="text-sm text-gray-600">
                Click "Delete Pages" to remove the selected pages. The modified PDF will be downloaded automatically.
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

