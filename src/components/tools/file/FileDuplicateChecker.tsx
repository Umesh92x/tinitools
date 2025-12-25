'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadIcon, CheckIcon, XIcon, TrashIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface FileWithHash {
  id: string
  file: File
  hash: string
  name: string
  size: number
}

export function FileDuplicateChecker() {
  const [files, setFiles] = useState<FileWithHash[]>([])
  const [loading, setLoading] = useState(false)
  const [duplicates, setDuplicates] = useState<Map<string, FileWithHash[]>>(new Map())
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const calculateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const findDuplicates = (fileList: FileWithHash[]) => {
    const hashMap = new Map<string, FileWithHash[]>()
    
    fileList.forEach((fileWithHash) => {
      const existing = hashMap.get(fileWithHash.hash) || []
      hashMap.set(fileWithHash.hash, [...existing, fileWithHash])
    })

    // Only keep hashes with duplicates
    const duplicatesMap = new Map<string, FileWithHash[]>()
    hashMap.forEach((files, hash) => {
      if (files.length > 1) {
        duplicatesMap.set(hash, files)
      }
    })

    return duplicatesMap
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setLoading(true)
    const newFiles: FileWithHash[] = []

    try {
      for (const file of acceptedFiles) {
        const hash = await calculateHash(file)
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          hash,
          name: file.name,
          size: file.size,
        })
      }

      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      
      const duplicatesMap = findDuplicates(updatedFiles)
      setDuplicates(duplicatesMap)

      showMessage(`${newFiles.length} file(s) added and analyzed!`)
    } catch (error) {
      showMessage('Error processing files', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileImport,
    multiple: true,
    noClick: true,
  })

  const handleBrowseClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = (e) => {
      const selectedFiles = (e.target as HTMLInputElement).files
      if (selectedFiles) {
        handleFileImport(Array.from(selectedFiles))
      }
    }
    input.click()
  }

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id)
    setFiles(updatedFiles)
    
    const duplicatesMap = findDuplicates(updatedFiles)
    setDuplicates(duplicatesMap)
    
    showMessage('File removed')
  }

  const clearAll = () => {
    setFiles([])
    setDuplicates(new Map())
    showMessage('All files cleared')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className="w-full">
        <input {...getInputProps()} />
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
          onClick={handleBrowseClick}
        >
          <div className="flex flex-col items-center">
            <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop files here' : 'Drag and drop files here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              Upload multiple files to find duplicates by comparing their hash values
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-600">Processing files...</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Files ({files.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((fileWithHash) => (
              <div
                key={fileWithHash.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileWithHash.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileWithHash.size)} • {fileWithHash.hash.substring(0, 16)}...
                  </p>
                </div>
                <button
                  onClick={() => removeFile(fileWithHash.id)}
                  className="ml-2 text-red-600 hover:text-red-700"
                  title="Remove file"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {duplicates.size > 0 && (
        <div className="bg-white rounded-lg border border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
            <XIcon className="h-5 w-5" />
            Duplicate Files Found ({duplicates.size} groups)
          </h3>
          <div className="space-y-4">
            {Array.from(duplicates.entries()).map(([hash, duplicateFiles], index) => (
              <div key={hash} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XIcon className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">
                    Group {index + 1}: {duplicateFiles.length} duplicate file(s)
                  </span>
                </div>
                <div className="space-y-2 mt-2">
                  {duplicateFiles.map((fileWithHash) => (
                    <div
                      key={fileWithHash.id}
                      className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileWithHash.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(fileWithHash.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(fileWithHash.id)}
                        className="ml-2 text-red-600 hover:text-red-700"
                        title="Remove file"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && duplicates.size === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              No duplicates found! All files are unique.
            </span>
          </div>
        </div>
      )}

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

