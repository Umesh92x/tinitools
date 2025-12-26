'use client'

import { useState, useEffect } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  tx: number
  ty: number
}

export function ParticleEffect() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const particlesList: Particle[] = []
    for (let i = 0; i < 30; i++) {
      particlesList.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
        tx: (Math.random() - 0.5) * 100,
        ty: (Math.random() - 0.5) * 100,
      })
    }
    setParticles(particlesList)
  }, [])

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60 dark:opacity-40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `sparkle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            '--tx': `${particle.tx}px`,
            '--ty': `${particle.ty}px`,
          } as React.CSSProperties & { '--tx': string; '--ty': string }}
        />
      ))}
    </div>
  )
}

