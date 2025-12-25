'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

type ConversionType = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed'

interface ConversionOption {
  label: string
  value: string
  factor: number
  formula?: (value: number) => number
  reverseFormula?: (value: number) => number
}

const conversionTypes: Record<ConversionType, {
  label: string
  options: ConversionOption[]
}> = {
  length: {
    label: 'Length',
    options: [
      { label: 'Millimeters (mm)', value: 'mm', factor: 1 },
      { label: 'Centimeters (cm)', value: 'cm', factor: 10 },
      { label: 'Meters (m)', value: 'm', factor: 1000 },
      { label: 'Kilometers (km)', value: 'km', factor: 1000000 },
      { label: 'Inches (in)', value: 'in', factor: 25.4 },
      { label: 'Feet (ft)', value: 'ft', factor: 304.8 },
      { label: 'Yards (yd)', value: 'yd', factor: 914.4 },
      { label: 'Miles (mi)', value: 'mi', factor: 1609344 },
    ],
  },
  weight: {
    label: 'Weight',
    options: [
      { label: 'Milligrams (mg)', value: 'mg', factor: 1 },
      { label: 'Grams (g)', value: 'g', factor: 1000 },
      { label: 'Kilograms (kg)', value: 'kg', factor: 1000000 },
      { label: 'Ounces (oz)', value: 'oz', factor: 28349.5 },
      { label: 'Pounds (lb)', value: 'lb', factor: 453592 },
      { label: 'Stone (st)', value: 'st', factor: 6350290 },
    ],
  },
  temperature: {
    label: 'Temperature',
    options: [
      { 
        label: 'Celsius (°C)', 
        value: 'c', 
        factor: 1,
        formula: (c) => c,
        reverseFormula: (c) => c
      },
      { 
        label: 'Fahrenheit (°F)', 
        value: 'f', 
        factor: 1,
        formula: (c) => (c * 9/5) + 32,
        reverseFormula: (f) => (f - 32) * 5/9
      },
      { 
        label: 'Kelvin (K)', 
        value: 'k', 
        factor: 1,
        formula: (c) => c + 273.15,
        reverseFormula: (k) => k - 273.15
      },
    ],
  },
  area: {
    label: 'Area',
    options: [
      { label: 'Square Millimeters (mm²)', value: 'mm2', factor: 1 },
      { label: 'Square Centimeters (cm²)', value: 'cm2', factor: 100 },
      { label: 'Square Meters (m²)', value: 'm2', factor: 1000000 },
      { label: 'Square Kilometers (km²)', value: 'km2', factor: 1000000000000 },
      { label: 'Square Inches (in²)', value: 'in2', factor: 645.16 },
      { label: 'Square Feet (ft²)', value: 'ft2', factor: 92903.04 },
      { label: 'Square Yards (yd²)', value: 'yd2', factor: 836127.36 },
      { label: 'Acres (ac)', value: 'ac', factor: 4046856422.4 },
    ],
  },
  volume: {
    label: 'Volume',
    options: [
      { label: 'Milliliters (mL)', value: 'ml', factor: 1 },
      { label: 'Liters (L)', value: 'l', factor: 1000 },
      { label: 'Cubic Meters (m³)', value: 'm3', factor: 1000000 },
      { label: 'Fluid Ounces (fl oz)', value: 'floz', factor: 29.5735 },
      { label: 'Cups (cup)', value: 'cup', factor: 236.588 },
      { label: 'Pints (pt)', value: 'pt', factor: 473.176 },
      { label: 'Quarts (qt)', value: 'qt', factor: 946.353 },
      { label: 'Gallons (gal)', value: 'gal', factor: 3785.41 },
    ],
  },
  speed: {
    label: 'Speed',
    options: [
      { label: 'Meters per Second (m/s)', value: 'mps', factor: 1 },
      { label: 'Kilometers per Hour (km/h)', value: 'kph', factor: 0.277778 },
      { label: 'Miles per Hour (mph)', value: 'mph', factor: 0.44704 },
      { label: 'Knots (kn)', value: 'kn', factor: 0.514444 },
    ],
  },
}

export function UnitConverter() {
  const [type, setType] = useState<ConversionType>('length')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [fromValue, setFromValue] = useState('')
  const [result, setResult] = useState('')
  const [explanation, setExplanation] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const handleTypeChange = (newType: ConversionType) => {
    setType(newType)
    setFromUnit('')
    setToUnit('')
    setFromValue('')
    setResult('')
    setExplanation('')
  }

  const convert = () => {
    if (!fromUnit || !toUnit || !fromValue) {
      showMessage('Please select units and enter a value', 'error')
      return
    }

    try {
      const value = parseFloat(fromValue)
      if (isNaN(value)) {
        throw new Error('Invalid number')
      }

      if (type !== 'temperature' && value < 0) {
        throw new Error('Value cannot be negative for this conversion type')
      }

      const fromOption = conversionTypes[type].options.find(opt => opt.value === fromUnit)
      const toOption = conversionTypes[type].options.find(opt => opt.value === toUnit)

      if (!fromOption || !toOption) {
        throw new Error('Invalid units')
      }

      let convertedValue: number

      if (type === 'temperature') {
        // First convert to Celsius (our base unit for temperature)
        const celsius = fromOption.reverseFormula!(value)
        // Then convert from Celsius to target unit
        convertedValue = toOption.formula!(celsius)
      } else {
        // For other units, convert using factors
        const baseValue = value * fromOption.factor
        convertedValue = baseValue / toOption.factor
      }

      const formattedResult = convertedValue.toLocaleString(undefined, {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0,
      })

      setResult(formattedResult)
      setExplanation(
        `${value.toLocaleString()} ${fromOption.label} is approximately ${formattedResult} ${toOption.label}`
      )

      showMessage('Conversion completed')
    } catch (error) {
      setResult('')
      setExplanation('')
      showMessage(
        error instanceof Error ? error.message : 'Invalid input. Please check your value and units.',
        'error'
      )
    }
  }

  const handleReset = () => {
    setFromUnit('')
    setToUnit('')
    setFromValue('')
    setResult('')
    setExplanation('')
  }

  const handleSwapUnits = () => {
    if (!fromUnit || !toUnit) return
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    // Keep the value as-is; user can reconvert with the new direction
    setResult('')
    setExplanation('')
  }

  const copyResult = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      showMessage('Result copied to clipboard')
    } catch {
      showMessage('Failed to copy result', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        {/* Conversion Type Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(conversionTypes).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => handleTypeChange(key as ConversionType)}
              className={`p-2 rounded text-sm ${
                type === key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From Unit */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select unit</option>
                {conversionTypes[type].options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                placeholder="Enter value"
                inputMode="decimal"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* To Unit */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select unit</option>
                {conversionTypes[type].options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result
              </label>
              <input
                type="text"
                value={result}
                readOnly
                className="w-full rounded-md bg-gray-50 border-gray-300 shadow-sm text-gray-700"
              />
              {explanation && (
                <p className="mt-1 text-xs text-gray-500">
                  {explanation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={convert}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Convert
          </button>
          <button
            type="button"
            onClick={handleSwapUnits}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Swap units
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={copyResult}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Copy result
          </button>
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