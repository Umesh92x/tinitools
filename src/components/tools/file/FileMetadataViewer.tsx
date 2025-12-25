'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadIcon, FileIcon, CopyIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface FileMetadata {
  name: string
  size: number
  type: string
  lastModified: Date
  extension: string
  sizeFormatted: string
  sizeBytes: string
  mimeType: string
  isImage: boolean
  imageDimensions?: { width: number; height: number }
}

export function FileMetadataViewer() {
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null)
  const [fileObject, setFileObject] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const formatFileSize = (bytes: number): { formatted: string; bytes: string } => {
    if (bytes === 0) return { formatted: '0 Bytes', bytes: '0' }
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return {
      formatted: Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i],
      bytes: bytes.toLocaleString(),
    }
  }

  const getImageDimensions = (file: File): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null)
        return
      }

      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.width, height: img.height })
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      
      img.src = url
    })
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Clean up previous image preview
    setImagePreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev)
      }
      return null
    })

    const sizeInfo = formatFileSize(file.size)
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const isImage = file.type.startsWith('image/')
    
    let imageDimensions = null
    if (isImage) {
      imageDimensions = await getImageDimensions(file)
    }

    const metadata: FileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type || 'Unknown',
      lastModified: new Date(file.lastModified),
      extension: extension,
      sizeFormatted: sizeInfo.formatted,
      sizeBytes: sizeInfo.bytes,
      mimeType: file.type || 'Unknown',
      isImage: isImage,
      imageDimensions: imageDimensions || undefined,
    }

    setFileMetadata(metadata)
    setFileObject(file)
    
    // Create image preview URL
    if (isImage) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
    
    showMessage('File metadata loaded successfully!')
  }, [])

  // Cleanup image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileImport,
    multiple: false,
    noClick: true,
  })

  const handleBrowseClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFileImport([file])
    }
    input.click()
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showMessage(`${label} copied to clipboard!`)
  }

  const metadataItems = [
    { label: 'File Name', value: fileMetadata?.name, copyable: true },
    { label: 'File Extension', value: fileMetadata?.extension ? `.${fileMetadata.extension}` : 'No extension', copyable: true },
    { label: 'MIME Type', value: fileMetadata?.mimeType, copyable: true },
    { label: 'File Size', value: fileMetadata?.sizeFormatted, copyable: false },
    { label: 'Size in Bytes', value: fileMetadata?.sizeBytes, copyable: true },
    { label: 'Last Modified', value: fileMetadata?.lastModified.toLocaleString(), copyable: true },
  ]

  if (fileMetadata?.isImage && fileMetadata.imageDimensions) {
    metadataItems.push(
      { label: 'Image Width', value: `${fileMetadata.imageDimensions.width} px`, copyable: true },
      { label: 'Image Height', value: `${fileMetadata.imageDimensions.height} px`, copyable: true },
      { label: 'Aspect Ratio', value: (fileMetadata.imageDimensions.width / fileMetadata.imageDimensions.height).toFixed(2), copyable: true }
    )
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
              {isDragActive ? 'Drop file here' : 'Drag and drop a file here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              View detailed file metadata and information
            </p>
          </div>
        </div>
      </div>

      {fileMetadata && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileIcon className="h-5 w-5" />
            File Metadata
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metadataItems.map((item, index) => (
              <div key={index} className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    {item.label}
                  </label>
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {item.value}
                  </p>
                </div>
                {item.copyable && (
                  <button
                    onClick={() => copyToClipboard(item.value || '', item.label)}
                    className="ml-2 text-indigo-600 hover:text-indigo-700"
                    title="Copy to clipboard"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {fileMetadata.isImage && imagePreview && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Image Preview</h4>
              <div className="flex justify-center">
                <img
                  src={imagePreview}
                  alt={fileMetadata.name}
                  className="max-w-full max-h-64 rounded border border-gray-200"
                />
              </div>
            </div>
          )}
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

