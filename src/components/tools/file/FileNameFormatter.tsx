'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadIcon, DownloadIcon, CopyIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface FileRename {
  original: string
  formatted: string
  file: File
}

export function FileNameFormatter() {
  const [files, setFiles] = useState<FileRename[]>([])
  const [formatOptions, setFormatOptions] = useState({
    lowercase: false,
    uppercase: false,
    removeSpaces: false,
    replaceSpaces: false,
    replaceWith: '_',
    addPrefix: false,
    prefix: '',
    addSuffix: false,
    suffix: '',
    removeExtension: false,
    customExtension: '',
    addTimestamp: false,
    addCounter: false,
    counterStart: 1,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const formatFileName = useCallback((fileName: string, index: number): string => {
    let formatted = fileName
    const extension = formatted.includes('.') ? formatted.split('.').pop() : ''
    const nameWithoutExt = formatted.includes('.') 
      ? formatted.substring(0, formatted.lastIndexOf('.')) 
      : formatted

    let newName = nameWithoutExt

    // Apply transformations
    if (formatOptions.lowercase) {
      newName = newName.toLowerCase()
    } else if (formatOptions.uppercase) {
      newName = newName.toUpperCase()
    }

    if (formatOptions.removeSpaces) {
      newName = newName.replace(/\s+/g, '')
    } else if (formatOptions.replaceSpaces) {
      newName = newName.replace(/\s+/g, formatOptions.replaceWith)
    }

    if (formatOptions.addPrefix && formatOptions.prefix) {
      newName = formatOptions.prefix + newName
    }

    if (formatOptions.addSuffix && formatOptions.suffix) {
      newName = newName + formatOptions.suffix
    }

    if (formatOptions.addTimestamp) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      newName = newName + '_' + timestamp
    }

    if (formatOptions.addCounter) {
      newName = newName + '_' + (formatOptions.counterStart + index).toString().padStart(3, '0')
    }

    // Handle extension
    let finalExtension = formatOptions.removeExtension 
      ? (formatOptions.customExtension || '') 
      : (formatOptions.customExtension || extension)

    if (finalExtension && !finalExtension.startsWith('.')) {
      finalExtension = '.' + finalExtension
    }

    return newName + (finalExtension || '')
  }, [formatOptions])

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const renamedFiles: FileRename[] = acceptedFiles.map((file, index) => ({
      original: file.name,
      formatted: formatFileName(file.name, index),
      file,
    }))

    setFiles(renamedFiles)
    showMessage(`${acceptedFiles.length} file(s) loaded!`)
  }, [formatFileName])

  useEffect(() => {
    if (files.length > 0) {
      setFiles(prevFiles => prevFiles.map((fileRename, index) => ({
        ...fileRename,
        formatted: formatFileName(fileRename.original, index),
      })))
    }
  }, [formatFileName])

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

  const downloadRenamedFiles = async () => {
    if (files.length === 0) return

    try {
      // Create a zip file with renamed files
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      for (const fileRename of files) {
        const fileContent = await fileRename.file.arrayBuffer()
        zip.file(fileRename.formatted, fileContent)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'renamed-files.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showMessage('Renamed files downloaded as ZIP!')
    } catch (error) {
      showMessage('Error creating ZIP file', 'error')
      console.error(error)
    }
  }

  const copyNames = (type: 'original' | 'formatted') => {
    const names = files.map(f => type === 'original' ? f.original : f.formatted).join('\n')
    navigator.clipboard.writeText(names)
    showMessage(`${type === 'original' ? 'Original' : 'Formatted'} names copied!`)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div {...getRootProps()} className="w-full">
            <input {...getInputProps()} />
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
              onClick={handleBrowseClick}
            >
              <div className="flex flex-col items-center">
                <UploadIcon className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm font-medium mb-1">
                  {isDragActive ? 'Drop files here' : 'Drag and drop files here, or click to browse'}
                </p>
                <p className="text-xs text-gray-500">
                  Upload multiple files to rename
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Format Options</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={formatOptions.lowercase}
                  onChange={(e) => setFormatOptions({ ...formatOptions, lowercase: e.target.checked, uppercase: false })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="lowercase" className="ml-2 text-sm text-gray-700">
                  Convert to lowercase
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={formatOptions.uppercase}
                  onChange={(e) => setFormatOptions({ ...formatOptions, uppercase: e.target.checked, lowercase: false })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="uppercase" className="ml-2 text-sm text-gray-700">
                  Convert to UPPERCASE
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removeSpaces"
                  checked={formatOptions.removeSpaces}
                  onChange={(e) => setFormatOptions({ ...formatOptions, removeSpaces: e.target.checked, replaceSpaces: false })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="removeSpaces" className="ml-2 text-sm text-gray-700">
                  Remove spaces
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="replaceSpaces"
                  checked={formatOptions.replaceSpaces}
                  onChange={(e) => setFormatOptions({ ...formatOptions, replaceSpaces: e.target.checked, removeSpaces: false })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="replaceSpaces" className="ml-2 text-sm text-gray-700">
                  Replace spaces with:
                </label>
                <input
                  type="text"
                  value={formatOptions.replaceWith}
                  onChange={(e) => setFormatOptions({ ...formatOptions, replaceWith: e.target.value })}
                  disabled={!formatOptions.replaceSpaces}
                  className="ml-2 w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  maxLength={1}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="addPrefix"
                  checked={formatOptions.addPrefix}
                  onChange={(e) => setFormatOptions({ ...formatOptions, addPrefix: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="addPrefix" className="ml-2 text-sm text-gray-700">
                  Add prefix:
                </label>
                <input
                  type="text"
                  value={formatOptions.prefix}
                  onChange={(e) => setFormatOptions({ ...formatOptions, prefix: e.target.value })}
                  disabled={!formatOptions.addPrefix}
                  className="ml-2 flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="addSuffix"
                  checked={formatOptions.addSuffix}
                  onChange={(e) => setFormatOptions({ ...formatOptions, addSuffix: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="addSuffix" className="ml-2 text-sm text-gray-700">
                  Add suffix:
                </label>
                <input
                  type="text"
                  value={formatOptions.suffix}
                  onChange={(e) => setFormatOptions({ ...formatOptions, suffix: e.target.value })}
                  disabled={!formatOptions.addSuffix}
                  className="ml-2 flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="addTimestamp"
                  checked={formatOptions.addTimestamp}
                  onChange={(e) => setFormatOptions({ ...formatOptions, addTimestamp: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="addTimestamp" className="ml-2 text-sm text-gray-700">
                  Add timestamp
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="addCounter"
                  checked={formatOptions.addCounter}
                  onChange={(e) => setFormatOptions({ ...formatOptions, addCounter: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="addCounter" className="ml-2 text-sm text-gray-700">
                  Add counter (start at:
                </label>
                <input
                  type="number"
                  value={formatOptions.counterStart}
                  onChange={(e) => setFormatOptions({ ...formatOptions, counterStart: parseInt(e.target.value) || 1 })}
                  disabled={!formatOptions.addCounter}
                  min="1"
                  className="ml-2 w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <span className="ml-1 text-sm text-gray-700">)</span>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removeExtension"
                  checked={formatOptions.removeExtension}
                  onChange={(e) => setFormatOptions({ ...formatOptions, removeExtension: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="removeExtension" className="ml-2 text-sm text-gray-700">
                  Change extension to:
                </label>
                <input
                  type="text"
                  value={formatOptions.customExtension}
                  onChange={(e) => setFormatOptions({ ...formatOptions, customExtension: e.target.value.replace(/^\./, '') })}
                  disabled={!formatOptions.removeExtension}
                  placeholder="txt"
                  className="ml-2 w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {files.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preview ({files.length} files)
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyNames('original')}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Copy Original
                  </button>
                  <button
                    onClick={() => copyNames('formatted')}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Copy Formatted
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.map((fileRename, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="text-xs text-gray-500 mb-1">Original:</div>
                    <div className="text-sm font-mono text-gray-700 mb-2 break-all">
                      {fileRename.original}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Formatted:</div>
                    <div className="text-sm font-mono font-semibold text-indigo-600 break-all">
                      {fileRename.formatted}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={downloadRenamedFiles}
                className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download Renamed Files (ZIP)
              </button>
            </div>
          )}
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

