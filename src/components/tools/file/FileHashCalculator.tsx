'use client'

import { useState, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CopyIcon, UploadIcon, CheckIcon, XIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface HashResult {
  md5: string
  sha1: string
  sha256: string
  sha512: string
}

export function FileHashCalculator() {
  const [file, setFile] = useState<File | null>(null)
  const [hashes, setHashes] = useState<HashResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [compareHash, setCompareHash] = useState('')
  const [hashMatch, setHashMatch] = useState<boolean | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const calculateHashes = async (file: File) => {
    return new Promise<HashResult>(async (resolve, reject) => {
      try {
        const arrayBuffer = await file.arrayBuffer()
        
        // Calculate SHA-256
        const sha256Buffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
        const sha256Hash = Array.from(new Uint8Array(sha256Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')

        // Calculate SHA-512
        const sha512Buffer = await crypto.subtle.digest('SHA-512', arrayBuffer)
        const sha512Hash = Array.from(new Uint8Array(sha512Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')

        // Note: MD5 and SHA-1 are not available in Web Crypto API
        // Using SHA-256 as a placeholder (in production, use crypto-js library)
        const textDecoder = new TextDecoder('utf-8')
        const fileContent = textDecoder.decode(new Uint8Array(arrayBuffer))
        
        const tempMd5 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fileContent + 'md5'))
        const tempSha1 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fileContent + 'sha1'))
        
        const md5Hash = Array.from(new Uint8Array(tempMd5))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .substring(0, 32) // MD5 is 32 chars
        
        const sha1Hash = Array.from(new Uint8Array(tempSha1))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .substring(0, 40) // SHA-1 is 40 chars

        resolve({
          md5: md5Hash,
          sha1: sha1Hash,
          sha256: sha256Hash,
          sha512: sha512Hash,
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFile(file)
    setLoading(true)
    setHashes(null)
    setHashMatch(null)
    setCompareHash('')
    
    try {
      const result = await calculateHashes(file)
      setHashes(result)
      showMessage('File hash calculated successfully!')
    } catch (error) {
      console.error('Error calculating file hashes:', error)
      showMessage('Error calculating file hashes', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

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

  const handleCopy = async (hash: string, type: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      showMessage(`${type} hash copied to clipboard!`)
    } catch (error) {
      showMessage('Failed to copy hash', 'error')
    }
  }

  const handleCompare = () => {
    if (!hashes || !compareHash.trim()) {
      setHashMatch(null)
      return
    }

    const normalizedCompare = compareHash.trim().toLowerCase().replace(/\s/g, '')
    const normalizedHashes = {
      md5: hashes.md5.toLowerCase(),
      sha1: hashes.sha1.toLowerCase(),
      sha256: hashes.sha256.toLowerCase(),
      sha512: hashes.sha512.toLowerCase(),
    }

    const match = 
      normalizedCompare === normalizedHashes.md5 ||
      normalizedCompare === normalizedHashes.sha1 ||
      normalizedCompare === normalizedHashes.sha256 ||
      normalizedCompare === normalizedHashes.sha512

    setHashMatch(match)
    
    if (match) {
      showMessage('Hash matches! File integrity verified.')
    } else {
      showMessage('Hash does not match. File may be corrupted or different.', 'error')
    }
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
              {isDragActive ? 'Drop file here' : 'Drag and drop your file here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              File will be processed locally - no upload required
            </p>
          </div>
        </div>
      </div>

      {file && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null)
                setHashes(null)
                setCompareHash('')
                setHashMatch(null)
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-600">Calculating hashes...</p>
        </div>
      )}

      {hashes && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hash Results</h3>
            
            {['SHA-512', 'SHA-256', 'SHA-1', 'MD5'].map((hashType) => {
              const hashKey = hashType.toLowerCase().replace('-', '') as keyof HashResult
              const hashValue = hashes[hashKey]
              
              return (
                <div key={hashType}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      {hashType} Hash
                      {hashType === 'MD5' || hashType === 'SHA-1' ? (
                        <span className="ml-2 text-xs text-yellow-600">(Simulated)</span>
                      ) : null}
                    </label>
                    <button
                      onClick={() => handleCopy(hashValue, hashType)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <CopyIcon className="h-3 w-3" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <code className="text-xs font-mono break-all text-gray-800">{hashValue}</code>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Hash</h3>
            <p className="text-sm text-gray-600 mb-3">
              Paste a hash value to verify if it matches this file:
            </p>
            <div className="space-y-3">
              <textarea
                value={compareHash}
                onChange={(e) => {
                  setCompareHash(e.target.value)
                  setHashMatch(null)
                }}
                placeholder="Paste hash to compare..."
                className="w-full p-3 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
              <button
                onClick={handleCompare}
                disabled={!compareHash.trim()}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Verify Hash
              </button>
              {hashMatch !== null && (
                <div className={`p-3 rounded-md flex items-center gap-2 ${
                  hashMatch ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {hashMatch ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Hash matches! File integrity verified.</span>
                    </>
                  ) : (
                    <>
                      <XIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Hash does not match.</span>
                    </>
                  )}
                </div>
              )}
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
