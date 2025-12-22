'use client'

import { useState, useEffect } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [passwordHistory, setPasswordHistory] = useState<string[]>([])
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('strong')

  const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'iIlL1oO0',
    ambiguous: '{}[]()/\\\'"`~,;:.<>',
  }

  const generatePassword = () => {
    try {
      let charset = ''
      if (options.uppercase) charset += characters.uppercase
      if (options.lowercase) charset += characters.lowercase
      if (options.numbers) charset += characters.numbers
      if (options.symbols) charset += characters.symbols

      if (options.excludeSimilar) {
        characters.similar.split('').forEach(char => {
          charset = charset.replace(new RegExp(char, 'g'), '')
        })
      }

      if (options.excludeAmbiguous) {
        characters.ambiguous.split('').forEach(char => {
          charset = charset.replace(new RegExp('\\' + char, 'g'), '')
        })
      }

      if (!charset) {
        throw new Error('Please select at least one character type')
      }

      let result = ''
      const length = options.length
      for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length))
      }

      // Ensure at least one character of each selected type is included
      let finalPassword = result
      if (options.uppercase && !/[A-Z]/.test(result)) {
        const pos = Math.floor(Math.random() * length)
        finalPassword = replaceAt(result, pos, getRandomChar(characters.uppercase))
      }
      if (options.lowercase && !/[a-z]/.test(result)) {
        const pos = Math.floor(Math.random() * length)
        finalPassword = replaceAt(finalPassword, pos, getRandomChar(characters.lowercase))
      }
      if (options.numbers && !/[0-9]/.test(result)) {
        const pos = Math.floor(Math.random() * length)
        finalPassword = replaceAt(finalPassword, pos, getRandomChar(characters.numbers))
      }
      if (options.symbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(result)) {
        const pos = Math.floor(Math.random() * length)
        finalPassword = replaceAt(finalPassword, pos, getRandomChar(characters.symbols))
      }

      setPassword(finalPassword)
      calculatePasswordStrength(finalPassword)
      
      // Add to history (keep last 5)
      setPasswordHistory(prev => [finalPassword, ...prev].slice(0, 5))
      
      setToastMessage('Password generated successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Failed to generate password')
      setToastType('error')
      setShowToast(true)
    }
  }

  // Auto-generate on mount
  useEffect(() => {
    if (!password) {
      generatePassword()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const replaceAt = (str: string, index: number, char: string) => {
    return str.substring(0, index) + char + str.substring(index + 1)
  }

  const getRandomChar = (charset: string) => {
    return charset.charAt(Math.floor(Math.random() * charset.length))
  }

  const calculatePasswordStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 12) score += 2
    if (pwd.length >= 16) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 2
    if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,}$/.test(pwd)) score += 1

    setPasswordStrength(score <= 3 ? 'weak' : score <= 5 ? 'medium' : 'strong')
  }

  const copyToClipboard = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setToastMessage('Password copied to clipboard!')
    setToastType('success')
    setShowToast(true)
  }

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (preset: 'strong' | 'pin' | 'simple') => {
    switch (preset) {
      case 'strong':
        setOptions({
          length: 20,
          uppercase: true,
          lowercase: true,
          numbers: true,
          symbols: true,
          excludeSimilar: true,
          excludeAmbiguous: false,
        })
        break
      case 'pin':
        setOptions({
          length: 6,
          uppercase: false,
          lowercase: false,
          numbers: true,
          symbols: false,
          excludeSimilar: true,
          excludeAmbiguous: false,
        })
        break
      case 'simple':
        setOptions({
          length: 12,
          uppercase: true,
          lowercase: true,
          numbers: true,
          symbols: false,
          excludeSimilar: false,
          excludeAmbiguous: false,
        })
        break
    }
    setTimeout(() => generatePassword(), 100)
  }

  const generateMultiple = (count: number = 3) => {
    const passwords: string[] = []
    for (let i = 0; i < count; i++) {
      const tempOptions = { ...options }
      const tempPassword = generatePasswordWithOptions(tempOptions)
      if (tempPassword) passwords.push(tempPassword)
    }
    setPasswordHistory(prev => [...passwords, ...prev].slice(0, 5))
    setToastMessage(`Generated ${passwords.length} passwords!`)
    setToastType('success')
    setShowToast(true)
  }

  const generatePasswordWithOptions = (opts: PasswordOptions): string | null => {
    try {
      let charset = ''
      if (opts.uppercase) charset += characters.uppercase
      if (opts.lowercase) charset += characters.lowercase
      if (opts.numbers) charset += characters.numbers
      if (opts.symbols) charset += characters.symbols

      if (opts.excludeSimilar) {
        characters.similar.split('').forEach(char => {
          charset = charset.replace(new RegExp(char, 'g'), '')
        })
      }

      if (opts.excludeAmbiguous) {
        characters.ambiguous.split('').forEach(char => {
          charset = charset.replace(new RegExp('\\' + char, 'g'), '')
        })
      }

      if (!charset) return null

      let result = ''
      for (let i = 0; i < opts.length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length))
      }

      return result
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => applyPreset('strong')}
                  className="flex-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  Strong
                </button>
                <button
                  onClick={() => applyPreset('pin')}
                  className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  PIN
                </button>
                <button
                  onClick={() => applyPreset('simple')}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Simple
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={password}
                readOnly
                className="w-full pr-24 font-mono text-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                onClick={copyToClipboard}
                disabled={!password}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
              >
                Copy
              </button>
            </div>

            {password && (
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium">Strength:</div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    passwordStrength === 'strong'
                      ? 'bg-green-100 text-green-800'
                      : passwordStrength === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password Length: {options.length}
                </label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={options.length}
                  onChange={(e) => updateOption('length', parseInt(e.target.value))}
                  className="w-full mt-1"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Character Types
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.uppercase}
                      onChange={(e) => updateOption('uppercase', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Uppercase (A-Z)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.lowercase}
                      onChange={(e) => updateOption('lowercase', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Lowercase (a-z)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.numbers}
                      onChange={(e) => updateOption('numbers', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Numbers (0-9)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.symbols}
                      onChange={(e) => updateOption('symbols', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Symbols (!@#$%^&*)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Advanced Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.excludeSimilar}
                      onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Exclude similar characters (i, l, 1, L, o, 0, O)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.excludeAmbiguous}
                      onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Exclude ambiguous characters ({}, [], (), /, \, etc.)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={generatePassword}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Regenerate
              </button>
              <button
                onClick={() => generateMultiple(3)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Generate 3
              </button>
            </div>
          </div>

          {passwordHistory.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Passwords</h3>
              <div className="space-y-2">
                {passwordHistory.map((pwd, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <code className="text-sm font-mono text-gray-700 flex-1 truncate">{pwd}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pwd)
                        setToastMessage('Password copied!')
                        setShowToast(true)
                      }}
                      className="ml-2 text-xs text-indigo-600 hover:text-indigo-500"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Password Strength Guide
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Strong Password</h4>
                <p className="text-sm text-gray-600">
                  - At least 12 characters long
                  <br />
                  - Contains uppercase and lowercase letters
                  <br />
                  - Includes numbers and symbols
                  <br />
                  - No common patterns or words
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Tips for Usage</h4>
                <p className="text-sm text-gray-600">
                  - Use different passwords for different accounts
                  <br />
                  - Store passwords securely in a password manager
                  <br />
                  - Change passwords periodically
                  <br />
                  - Never share passwords via email or text
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Customize Options</h4>
                <p className="text-sm text-gray-600">
                  Choose password length and character types. Enable advanced options
                  for more secure passwords.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Generate</h4>
                <p className="text-sm text-gray-600">
                  Click "Generate Password" to create a new password with your
                  selected options.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Copy & Use</h4>
                <p className="text-sm text-gray-600">
                  Click "Copy" to copy the password to your clipboard. Store it
                  securely in a password manager.
                </p>
              </div>
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