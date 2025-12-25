'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadIcon, FileIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: Date
  extension: string
  detectedType: string
}

const fileTypeMap: Record<string, string> = {
  // Images
  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'image/gif': 'GIF Image',
  'image/webp': 'WebP Image',
  'image/svg+xml': 'SVG Image',
  'image/bmp': 'BMP Image',
  'image/tiff': 'TIFF Image',
  'image/x-icon': 'Icon File',
  
  // Documents
  'application/pdf': 'PDF Document',
  'application/msword': 'Microsoft Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document (.docx)',
  'application/vnd.ms-excel': 'Microsoft Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet (.xlsx)',
  'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint (.pptx)',
  
  // Text
  'text/plain': 'Text File',
  'text/html': 'HTML Document',
  'text/css': 'CSS Stylesheet',
  'text/javascript': 'JavaScript File',
  'text/csv': 'CSV File',
  'text/xml': 'XML Document',
  'application/json': 'JSON File',
  'application/x-yaml': 'YAML File',
  'text/yaml': 'YAML File',
  
  // Archives
  'application/zip': 'ZIP Archive',
  'application/x-rar-compressed': 'RAR Archive',
  'application/x-7z-compressed': '7-Zip Archive',
  'application/x-tar': 'TAR Archive',
  'application/gzip': 'GZIP Archive',
  
  // Audio
  'audio/mpeg': 'MP3 Audio',
  'audio/wav': 'WAV Audio',
  'audio/ogg': 'OGG Audio',
  'audio/aac': 'AAC Audio',
  'audio/flac': 'FLAC Audio',
  
  // Video
  'video/mp4': 'MP4 Video',
  'video/avi': 'AVI Video',
  'video/quicktime': 'QuickTime Video',
  'video/x-msvideo': 'AVI Video',
  'video/webm': 'WebM Video',
  
  // Code
  'application/javascript': 'JavaScript',
  'application/typescript': 'TypeScript',
  'text/x-python': 'Python Script',
  'text/x-java': 'Java Source',
  'text/x-c': 'C Source',
  'text/x-c++': 'C++ Source',
}

const getFileExtension = (filename: string): string => {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

const detectFileType = (file: File): string => {
  // First try MIME type
  if (file.type && fileTypeMap[file.type]) {
    return fileTypeMap[file.type]
  }
  
  // Fallback to extension
  const ext = getFileExtension(file.name)
  const extensionMap: Record<string, string> = {
    jpg: 'JPEG Image',
    jpeg: 'JPEG Image',
    png: 'PNG Image',
    gif: 'GIF Image',
    webp: 'WebP Image',
    svg: 'SVG Image',
    pdf: 'PDF Document',
    doc: 'Microsoft Word Document',
    docx: 'Word Document (.docx)',
    xls: 'Microsoft Excel Spreadsheet',
    xlsx: 'Excel Spreadsheet (.xlsx)',
    ppt: 'PowerPoint Presentation',
    pptx: 'PowerPoint (.pptx)',
    txt: 'Text File',
    html: 'HTML Document',
    css: 'CSS Stylesheet',
    js: 'JavaScript File',
    ts: 'TypeScript File',
    json: 'JSON File',
    xml: 'XML Document',
    yaml: 'YAML File',
    yml: 'YAML File',
    zip: 'ZIP Archive',
    rar: 'RAR Archive',
    '7z': '7-Zip Archive',
    tar: 'TAR Archive',
    gz: 'GZIP Archive',
    mp3: 'MP3 Audio',
    wav: 'WAV Audio',
    mp4: 'MP4 Video',
    avi: 'AVI Video',
    mov: 'QuickTime Video',
    py: 'Python Script',
    java: 'Java Source',
    c: 'C Source',
    cpp: 'C++ Source',
  }
  
  return extensionMap[ext] || `Unknown (${ext || 'no extension'})`
}

export function FileTypeDetector() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const info: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type || 'Unknown',
      lastModified: new Date(file.lastModified),
      extension: getFileExtension(file.name),
      detectedType: detectFileType(file),
    }

    setFileInfo(info)
    showMessage('File analyzed successfully!')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileImport,
    multiple: false,
    noClick: true,
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleBrowseClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFileImport([file])
    }
    input.click()
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
              Detect file type, MIME type, and metadata
            </p>
          </div>
        </div>
      </div>

      {fileInfo && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileIcon className="h-5 w-5" />
            File Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                File Name
              </label>
              <p className="mt-1 text-sm font-mono text-gray-900 break-all">
                {fileInfo.name}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Detected Type
              </label>
              <p className="mt-1 text-sm font-semibold text-indigo-600">
                {fileInfo.detectedType}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                MIME Type
              </label>
              <p className="mt-1 text-sm font-mono text-gray-900">
                {fileInfo.type || 'Not detected'}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                File Extension
              </label>
              <p className="mt-1 text-sm font-mono text-gray-900">
                {fileInfo.extension ? `.${fileInfo.extension}` : 'No extension'}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                File Size
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {formatFileSize(fileInfo.size)} ({fileInfo.size.toLocaleString()} bytes)
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Last Modified
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {fileInfo.lastModified.toLocaleString()}
              </p>
            </div>
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

