import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export const metadata: Metadata = generateMetadata({
  title: 'Pomodoro Timer',
  description: 'Stay focused with customizable Pomodoro timer. Set work and break intervals with notifications.',
  path: '/misc/pomodoro',
  keywords: ['pomodoro timer', 'focus timer', 'work timer', 'productivity timer'],
})

export default function PomodoroTimer() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <Timer className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Pomodoro Timer
          </h1>
          <p className="text-lg text-gray-600">
            Stay focused with customizable Pomodoro timer. Set work and break intervals with notifications.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full bg-indigo-50 flex items-center justify-center">
                <div className="text-6xl font-mono font-bold text-indigo-600">
                  25:00
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="text-sm">
                Work
                <span className="ml-1 text-gray-500">(25m)</span>
              </Button>
              <Button variant="outline" className="text-sm">
                Short Break
                <span className="ml-1 text-gray-500">(5m)</span>
              </Button>
              <Button variant="outline" className="text-sm">
                Long Break
                <span className="ml-1 text-gray-500">(15m)</span>
              </Button>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg" className="w-32">
                Start
              </Button>
              <Button size="lg" variant="outline" className="w-32">
                Reset
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Settings</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Work Time (min)</Label>
                  <Input 
                    type="number" 
                    placeholder="25"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Short Break (min)</Label>
                  <Input 
                    type="number" 
                    placeholder="5"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Long Break (min)</Label>
                  <Input 
                    type="number" 
                    placeholder="15"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="autoStart" />
                  <Label htmlFor="autoStart">Auto-start breaks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sound" />
                  <Label htmlFor="sound">Play sound on completion</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 