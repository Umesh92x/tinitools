import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { Dice5 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export const metadata: Metadata = generateMetadata({
  title: 'Random Number Generator',
  description: 'Generate random numbers with custom ranges, decimal places, and multiple numbers at once.',
  path: '/misc/random',
  keywords: ['random number', 'number generator', 'random generator'],
})

export default function RandomNumberGenerator() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <Dice5 className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Random Number Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate random numbers with custom ranges, decimal places, and multiple numbers at once.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min">Minimum</Label>
                <Input 
                  id="min" 
                  type="number" 
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max">Maximum</Label>
                <Input 
                  id="max" 
                  type="number" 
                  placeholder="100"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="count">Number of Results</Label>
                <Input 
                  id="count" 
                  type="number" 
                  placeholder="1"
                  min="1"
                  max="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="decimals">Decimal Places</Label>
                <Input 
                  id="decimals" 
                  type="number" 
                  placeholder="0"
                  min="0"
                  max="10"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="unique" />
              <Label htmlFor="unique">Generate unique numbers only</Label>
            </div>

            <Button type="submit" className="w-full">
              Generate Numbers
            </Button>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <Label>Generated Numbers</Label>
              <div className="mt-2 text-lg font-mono">
                Click generate to see results
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 