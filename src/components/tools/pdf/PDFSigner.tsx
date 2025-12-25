'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Toast } from '@/components/ui/Toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, RotateCcw, PenTool, Image as ImageIcon, X } from 'lucide-react'
import { PDFDocument, rgb } from 'pdf-lib'

type SignatureMode = 'draw' | 'upload'

export function PDFSigner() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null)
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('draw')
  const [signatureImage, setSignatureImage] = useState<string>('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedPage, setSelectedPage] = useState(0)
  const [signaturePosition, setSignaturePosition] = useState({ x: 100, y: 100 })
  const [signatureSize, setSignatureSize] = useState(150)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [processing, setProcessing] = useState(false)
  
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null)
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const MAX_SIZE_MB = 20

  // Load PDF
  const onDropPDF = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setToastMessage(`Please select a PDF smaller than ${MAX_SIZE_MB} MB`)
      setShowToast(true)
      return
    }
    if (file.type !== 'application/pdf') {
      setToastMessage('Please select a valid PDF file')
      setShowToast(true)
      return
    }

    try {
      setProcessing(true)
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      setPdfDoc(pdfDoc)
      setPdfFile(file)
      setSelectedPage(0)
      setToastMessage('PDF loaded successfully!')
      setShowToast(true)
      
      // Load first page preview
      loadPagePreview(pdfDoc, 0)
    } catch (error) {
      setToastMessage('Error loading PDF file')
      setShowToast(true)
    } finally {
      setProcessing(false)
    }
  }, [])

  const loadPagePreview = async (doc: PDFDocument, pageIndex: number) => {
    try {
      // Dynamically import pdfjs-dist
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
      
      const pdfData = await doc.save()
      const loadingTask = pdfjs.getDocument({ data: pdfData })
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(pageIndex + 1)
      
      const viewport = page.getViewport({ scale: 1.5 })
      const canvas = pdfCanvasRef.current
      if (!canvas) return
      
      canvas.width = viewport.width
      canvas.height = viewport.height
      
      const context = canvas.getContext('2d')
      if (!context) return
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise
    } catch (error) {
      console.error('Error loading page preview:', error)
    }
  }

  useEffect(() => {
    if (pdfDoc) {
      loadPagePreview(pdfDoc, selectedPage)
    }
  }, [pdfDoc, selectedPage])

  const { getRootProps: getPDFRootProps, getInputProps: getPDFInputProps, isDragActive: isPDFDragActive } = useDropzone({
    onDrop: onDropPDF,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false,
  })

  // Signature drawing
  const signatureCanvas = signatureCanvasRef.current
  useEffect(() => {
    if (signatureMode === 'draw' && signatureCanvas) {
      signatureCanvas.width = 400
      signatureCanvas.height = 200
      const ctx = signatureCanvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }
  }, [signatureMode, signatureCanvas])

  const getSignatureCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } | null => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return null
    
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleSignatureMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (signatureMode !== 'draw') return
    setIsDrawing(true)
    const canvas = signatureCanvasRef.current
    const coords = getSignatureCoordinates(e)
    if (canvas && coords) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(coords.x, coords.y)
      }
    }
  }

  const handleSignatureMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || signatureMode !== 'draw') return
    const canvas = signatureCanvasRef.current
    const coords = getSignatureCoordinates(e)
    if (canvas && coords) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
      }
    }
  }

  const handleSignatureMouseUp = () => {
    setIsDrawing(false)
    const canvas = signatureCanvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL()
      setSignatureImage(dataUrl)
    }
  }

  // Upload signature image
  const onDropSignature = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    if (!file.type.startsWith('image/')) {
      setToastMessage('Please select a valid image file')
      setShowToast(true)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setSignatureImage(dataUrl)
      setToastMessage('Signature image uploaded!')
      setShowToast(true)
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps: getSigRootProps, getInputProps: getSigInputProps } = useDropzone({
    onDrop: onDropSignature,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false,
  })

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setSignatureImage('')
  }

  const signPDF = async () => {
    if (!pdfDoc || !signatureImage) {
      setToastMessage('Please load a PDF and create/upload a signature')
      setShowToast(true)
      return
    }

    try {
      setProcessing(true)
      
      // Get signature as image
      let signatureBytes: Uint8Array
      
      if (signatureMode === 'draw') {
        const canvas = signatureCanvasRef.current
        if (!canvas) {
          setProcessing(false)
          return
        }
        
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png')
        })
        
        if (!blob) {
          setProcessing(false)
          return
        }
        
        const arrayBuffer = await blob.arrayBuffer()
        signatureBytes = new Uint8Array(arrayBuffer)
      } else {
        // Convert data URL to bytes
        const response = await fetch(signatureImage)
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        signatureBytes = new Uint8Array(arrayBuffer)
      }
      
      await addSignatureToPDF(signatureBytes)
    } catch (error) {
      setToastMessage('Error signing PDF')
      setShowToast(true)
    } finally {
      setProcessing(false)
    }
  }

  const addSignatureToPDF = async (signatureBytes: Uint8Array) => {
    if (!pdfDoc) return

    try {
      const pages = pdfDoc.getPages()
      const page = pages[selectedPage]
      const { width, height } = page.getSize()
      
      // Embed signature image
      const signatureImage = await pdfDoc.embedPng(signatureBytes)
      const signatureDims = signatureImage.scale(signatureSize / 100)
      
      // Calculate position (convert from top-left to bottom-left coordinate system)
      const x = signaturePosition.x
      const y = height - signaturePosition.y - signatureDims.height
      
      // Add signature to page
      page.drawImage(signatureImage, {
        x: x,
        y: y,
        width: signatureDims.width,
        height: signatureDims.height,
      })
      
      // Save and download
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = pdfFile?.name.replace('.pdf', '') + '-signed.pdf' || 'signed.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setToastMessage('PDF signed and downloaded successfully!')
      setShowToast(true)
    } catch (error) {
      console.error('Error adding signature:', error)
      setToastMessage('Error adding signature to PDF')
      setShowToast(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* PDF Upload */}
      {!pdfDoc ? (
        <Card className="p-8">
          <div
            {...getPDFRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isPDFDragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            <input {...getPDFInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag and drop a PDF here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Max {MAX_SIZE_MB}MB
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* PDF Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
              {pdfDoc && (
                <div className="flex gap-2">
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(Number(e.target.value))}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  >
                    {Array.from({ length: pdfDoc.getPageCount() }, (_, i) => (
                      <option key={i} value={i}>
                        Page {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg overflow-auto bg-gray-50 max-h-[600px]">
              <canvas ref={pdfCanvasRef} className="max-w-full" />
            </div>
            <div className="mt-4 space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X Position: {signaturePosition.x}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={signaturePosition.x}
                  onChange={(e) => setSignaturePosition(prev => ({ ...prev, x: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y Position: {signaturePosition.y}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="700"
                  value={signaturePosition.y}
                  onChange={(e) => setSignaturePosition(prev => ({ ...prev, y: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size: {signatureSize}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={signatureSize}
                  onChange={(e) => setSignatureSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Signature */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Signature</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSignatureMode('draw')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    signatureMode === 'draw'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <PenTool className="h-4 w-4 inline mr-1" />
                  Draw
                </button>
                <button
                  onClick={() => setSignatureMode('upload')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    signatureMode === 'upload'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ImageIcon className="h-4 w-4 inline mr-1" />
                  Upload
                </button>
              </div>
            </div>

            {signatureMode === 'draw' ? (
              <div className="space-y-4">
                <div className="border-2 border-gray-300 rounded-lg bg-white">
                  <canvas
                    ref={signatureCanvasRef}
                    onMouseDown={handleSignatureMouseDown}
                    onMouseMove={handleSignatureMouseMove}
                    onMouseUp={handleSignatureMouseUp}
                    onMouseLeave={handleSignatureMouseUp}
                    className="w-full cursor-crosshair"
                    style={{ display: 'block' }}
                  />
                </div>
                <Button onClick={clearSignature} variant="outline" size="sm" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {signatureImage ? (
                  <div className="relative">
                    <img src={signatureImage} alt="Signature" className="max-w-full h-auto border border-gray-200 rounded-lg" />
                    <button
                      onClick={clearSignature}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getSigRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400"
                  >
                    <input {...getSigInputProps()} />
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload signature image</p>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={signPDF}
              disabled={!signatureImage || processing}
              className="w-full mt-4"
            >
              {processing ? 'Processing...' : 'Sign PDF'}
            </Button>
          </Card>
        </div>
      )}

      <Toast
        show={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}

