'use client'

import { useState } from 'react'
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
      setToastMessage('Password generated successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Failed to generate password')
      setToastType('error')
      setShowToast(true)
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
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

            <button
              onClick={generatePassword}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Password
            </button>
          </div>
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