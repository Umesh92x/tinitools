'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DownloadIcon, CopyIcon } from 'lucide-react'
import QRCode from 'qrcode'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type QRType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard'

interface QROptions {
  width: number
  margin: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  color: {
    dark: string
    light: string
  }
}

export function QrCodeGenerator() {
  const [type, setType] = useState<QRType>('text')
  const [text, setText] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [options, setOptions] = useState<QROptions>({
    width: 300,
    margin: 4,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  // WiFi specific fields
  const [wifiName, setWifiName] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiSecurity, setWifiSecurity] = useState('WPA')

  // vCard specific fields
  const [vcardName, setVcardName] = useState('')
  const [vcardPhone, setVcardPhone] = useState('')
  const [vcardEmail, setVcardEmail] = useState('')
  const [vcardOrg, setVcardOrg] = useState('')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const generateQRCode = useCallback(async () => {
    let qrText = text

    switch (type) {
      case 'url':
        if (!text.startsWith('http://') && !text.startsWith('https://')) {
          qrText = `https://${text}`
        } else {
          qrText = text
        }
        break
      case 'email':
        qrText = `mailto:${text}`
        break
      case 'phone':
        qrText = `tel:${text}`
        break
      case 'sms':
        qrText = `sms:${text}`
        break
      case 'wifi':
        if (!wifiName) {
          showMessage('Please enter WiFi network name', 'error')
          return
        }
        qrText = `WIFI:T:${wifiSecurity};S:${wifiName};P:${wifiPassword || ''};;`
        break
      case 'vcard':
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n'
        if (vcardName) vcard += `FN:${vcardName}\n`
        if (vcardPhone) vcard += `TEL:${vcardPhone}\n`
        if (vcardEmail) vcard += `EMAIL:${vcardEmail}\n`
        if (vcardOrg) vcard += `ORG:${vcardOrg}\n`
        vcard += 'END:VCARD'
        qrText = vcard
        break
    }

    if (!qrText && type !== 'wifi' && type !== 'vcard') {
      return
    }

    try {
      const qrOptions = {
        width: options.width,
        margin: options.margin,
        errorCorrectionLevel: options.errorCorrectionLevel,
        color: {
          dark: options.color.dark,
          light: options.color.light,
        },
      }

      const dataUrl = await QRCode.toDataURL(qrText, qrOptions)
      setQrDataUrl(dataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
      showMessage('Error generating QR code', 'error')
    }
  }, [text, type, options, wifiName, wifiPassword, wifiSecurity, vcardName, vcardPhone, vcardEmail, vcardOrg])

  useEffect(() => {
    if ((text || type === 'wifi' || type === 'vcard') && (type !== 'wifi' || wifiName)) {
      generateQRCode()
    }
  }, [text, type, options, wifiName, wifiPassword, wifiSecurity, vcardName, vcardPhone, vcardEmail, vcardOrg, generateQRCode])

  const downloadQRCode = () => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qrcode-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showMessage('QR code downloaded!')
  }

  const copyQRCode = async () => {
    if (!qrDataUrl) return

    try {
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      showMessage('QR code copied to clipboard!')
    } catch (error) {
      showMessage('Failed to copy QR code', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as QRType)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="text">Text</option>
              <option value="url">URL</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="sms">SMS</option>
              <option value="wifi">WiFi</option>
              <option value="vcard">vCard (Contact)</option>
            </select>
          </div>

          {type === 'wifi' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network Name (SSID) *
                </label>
                <input
                  type="text"
                  value={wifiName}
                  onChange={(e) => setWifiName(e.target.value)}
                  placeholder="MyWiFi"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Password (optional)"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Type
                </label>
                <select
                  value={wifiSecurity}
                  onChange={(e) => setWifiSecurity(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
              </div>
            </div>
          ) : type === 'vcard' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={vcardName}
                  onChange={(e) => setVcardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={vcardPhone}
                  onChange={(e) => setVcardPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={vcardEmail}
                  onChange={(e) => setVcardEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  value={vcardOrg}
                  onChange={(e) => setVcardOrg(e.target.value)}
                  placeholder="Company Name"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'text' && 'Text'}
                {type === 'url' && 'URL'}
                {type === 'email' && 'Email Address'}
                {type === 'phone' && 'Phone Number'}
                {type === 'sms' && 'Phone Number'}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Enter ${type}...`}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}

          <div className="space-y-3 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: {options.width}px
              </label>
              <input
                type="range"
                min="200"
                max="600"
                step="50"
                value={options.width}
                onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Error Correction Level
              </label>
              <select
                value={options.errorCorrectionLevel}
                onChange={(e) => setOptions({ ...options, errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="L">Low (~7%)</option>
                <option value="M">Medium (~15%)</option>
                <option value="Q">Quartile (~25%)</option>
                <option value="H">High (~30%)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreground Color
                </label>
                <input
                  type="color"
                  value={options.color.dark}
                  onChange={(e) => setOptions({ ...options, color: { ...options.color, dark: e.target.value } })}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={options.color.light}
                  onChange={(e) => setOptions({ ...options, color: { ...options.color, light: e.target.value } })}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {qrDataUrl && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col items-center space-y-4">
                <img src={qrDataUrl} alt="QR Code" className="max-w-full border border-gray-200 rounded" />
                <div className="flex gap-2 w-full">
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={copyQRCode}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy Image
                  </button>
                </div>
              </div>
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
