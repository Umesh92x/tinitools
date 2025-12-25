'use client'

import { useState, useEffect } from 'react'
import { CopyIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB'

const units: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']

// Decimal units (base 1000) - used by storage manufacturers and most software
const decimalUnitToBytes: Record<Unit, number> = {
  B: 1,
  KB: 1000,
  MB: 1000 * 1000,
  GB: 1000 * 1000 * 1000,
  TB: 1000 * 1000 * 1000 * 1000,
  PB: 1000 * 1000 * 1000 * 1000 * 1000,
  KiB: 1024, // Binary units use base 1024
  MiB: 1024 * 1024,
  GiB: 1024 * 1024 * 1024,
  TiB: 1024 * 1024 * 1024 * 1024,
  PiB: 1024 * 1024 * 1024 * 1024 * 1024,
}

const convertSize = (value: number, fromUnit: Unit, toUnit: Unit): number => {
  const bytes = value * decimalUnitToBytes[fromUnit]
  return bytes / decimalUnitToBytes[toUnit]
}

const isBinaryUnit = (unit: Unit): boolean => {
  return unit.endsWith('iB')
}

const presets = [
  { name: '1 MB to KB', from: 1, fromUnit: 'MB' as Unit, toUnit: 'KB' as Unit },
  { name: '1 GB to MB', from: 1, fromUnit: 'GB' as Unit, toUnit: 'MB' as Unit },
  { name: '1 GiB to MiB', from: 1, fromUnit: 'GiB' as Unit, toUnit: 'MiB' as Unit },
  { name: 'GB vs GiB', from: 1, fromUnit: 'GB' as Unit, toUnit: 'GiB' as Unit },
]

export function FileSizeConverter() {
  const [value, setValue] = useState<string>('')
  const [fromUnit, setFromUnit] = useState<Unit>('MB')
  const [toUnit, setToUnit] = useState<Unit>('GB')
  const [result, setResult] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    if (value && !isNaN(Number(value)) && Number(value) >= 0) {
      const converted = convertSize(Number(value), fromUnit, toUnit)
      setResult(converted)
    } else {
      setResult(null)
    }
  }, [value, fromUnit, toUnit])

  const handlePreset = (preset: typeof presets[0]) => {
    setValue(preset.from.toString())
    setFromUnit(preset.fromUnit)
    setToUnit(preset.toUnit)
  }

  const copyResult = () => {
    if (result === null) return
    const resultText = `${value} ${fromUnit} = ${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit}`
    navigator.clipboard.writeText(resultText)
    showMessage('Result copied to clipboard!')
  }

  const formatResult = (num: number): string => {
    return num.toLocaleString(undefined, { 
      maximumFractionDigits: 6,
      minimumFractionDigits: num % 1 === 0 ? 0 : 2
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter size..."
              min="0"
              step="any"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as Unit)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as Unit)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePreset(preset)}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {(isBinaryUnit(fromUnit) || isBinaryUnit(toUnit)) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Understanding Binary vs Decimal Units
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="mb-2">
                      <strong>Decimal units (KB, MB, GB):</strong> Use base 1000 (1 KB = 1,000 bytes)
                    </p>
                    <p className="mb-2">
                      <strong>Binary units (KiB, MiB, GiB):</strong> Use base 1024 (1 KiB = 1,024 bytes)
                    </p>
                    <p className="text-xs mt-2">
                      <strong>Example:</strong> 1 GB = 1,000,000,000 bytes, while 1 GiB = 1,073,741,824 bytes. 
                      This is why a 1 TB drive shows as ~931 GB in your OS (it's using binary units).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {result !== null && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center space-y-3">
                <div className="text-2xl font-bold text-gray-900">
                  {formatResult(result)} {toUnit}
                </div>
                <div className="text-sm text-gray-600">
                  {value} {fromUnit} = {formatResult(result)} {toUnit}
                </div>
                <button
                  onClick={copyResult}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copy Result
                </button>
              </div>
            </div>
          )}

          {result === null && value && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Please enter a valid number
              </p>
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
