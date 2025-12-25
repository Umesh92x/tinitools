'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, RotateCcw, ChevronLeft, ChevronRight, Shuffle, Download, Upload } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Flashcard {
  id: string
  front: string
  back: string
}

export function FlashcardGenerator() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [newCard, setNewCard] = useState({ front: '', back: '' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    const savedCards = localStorage.getItem('flashcards')
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards))
      } catch (error) {
        console.error('Error loading flashcards:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (cards.length > 0) {
      try {
        localStorage.setItem('flashcards', JSON.stringify(cards))
      } catch (error) {
        console.error('Error saving flashcards:', error)
      }
    }
  }, [cards])

  const addCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) {
      showMessage('Please fill in both front and back', 'error')
      return
    }

    const card: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
    }

    setCards([...cards, card])
    setNewCard({ front: '', back: '' })
    showMessage('Flashcard added!')
  }

  const removeCard = (id: string) => {
    const newCards = cards.filter(card => card.id !== id)
    setCards(newCards)
    if (currentIndex >= newCards.length && newCards.length > 0) {
      setCurrentIndex(newCards.length - 1)
    } else if (newCards.length === 0) {
      setCurrentIndex(0)
    }
    showMessage('Flashcard removed!')
  }

  const nextCard = () => {
    if (cards.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % cards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    if (cards.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    setIsFlipped(false)
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    showMessage('Cards shuffled!')
  }

  const exportCards = () => {
    const content = cards.map((card, index) => 
      `Card ${index + 1}:\nFront: ${card.front}\nBack: ${card.back}\n\n`
    ).join('---\n\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flashcards-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('Flashcards exported!')
  }

  const importCards = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n')
        const importedCards: Flashcard[] = []
        let currentCard: Partial<Flashcard> = {}

        lines.forEach((line, index) => {
          if (line.startsWith('Card')) {
            if (currentCard.front && currentCard.back) {
              importedCards.push({
                id: Date.now().toString() + index,
                front: currentCard.front,
                back: currentCard.back,
              })
            }
            currentCard = {}
          } else if (line.startsWith('Front:')) {
            currentCard.front = line.replace('Front:', '').trim()
          } else if (line.startsWith('Back:')) {
            currentCard.back = line.replace('Back:', '').trim()
          }
        })

        if (currentCard.front && currentCard.back) {
          importedCards.push({
            id: Date.now().toString(),
            front: currentCard.front,
            back: currentCard.back,
          })
        }

        if (importedCards.length > 0) {
          setCards([...cards, ...importedCards])
          showMessage(`${importedCards.length} flashcards imported!`)
        } else {
          showMessage('No valid flashcards found in file', 'error')
        }
      } catch (error) {
        showMessage('Error importing file', 'error')
      }
    }
    reader.readAsText(file)
  }

  const currentCard = cards[currentIndex]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Flashcard</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front (Question/Term)
              </label>
              <textarea
                value={newCard.front}
                onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                placeholder="Enter the question or term..."
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back (Answer/Definition)
              </label>
              <textarea
                value={newCard.back}
                onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                placeholder="Enter the answer or definition..."
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              onClick={addCard}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Flashcard
            </button>
          </div>

          {cards.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-2">
                <button
                  onClick={exportCards}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <label className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".txt"
                    onChange={importCards}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={shuffleCards}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Shuffle
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {cards.length > 0 ? (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px] flex flex-col">
                <div className="text-center mb-4 text-sm text-gray-600">
                  Card {currentIndex + 1} of {cards.length}
                </div>
                <div
                  className="flex-1 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className="text-center w-full">
                    <div className="text-2xl font-semibold text-gray-900 mb-2">
                      {isFlipped ? 'Back' : 'Front'}
                    </div>
                    <div className="text-lg text-gray-700 whitespace-pre-wrap">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={prevCard}
                    className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    title="Previous"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <RotateCcw className="h-4 w-4 inline mr-2" />
                    Flip
                  </button>
                  <button
                    onClick={nextCard}
                    className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    title="Next"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Flashcards ({cards.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cards.map((card, index) => (
                    <div
                      key={card.id}
                      className={`flex items-center justify-between p-3 rounded border ${
                        index === currentIndex
                          ? 'bg-indigo-50 border-indigo-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {card.front}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {card.back}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentIndex(index)
                          setIsFlipped(false)
                        }}
                        className="ml-2 text-indigo-600 hover:text-indigo-700 text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => removeCard(card.id)}
                        className="ml-2 text-red-600 hover:text-red-700"
                        title="Remove"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
              No flashcards yet. Add your first flashcard above.
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

