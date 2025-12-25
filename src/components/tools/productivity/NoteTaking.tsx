'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PlusIcon, TrashIcon, UploadIcon, DownloadIcon, SearchIcon, TagIcon, EditIcon, XIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
}

export function NoteTaking() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [category, setCategory] = useState('General')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterTag, setFilterTag] = useState<string>('all')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const categories = ['General', 'Work', 'Personal', 'Ideas', 'Shopping', 'Other']

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (error) {
        console.error('Error loading notes:', error)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes))
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }, [notes])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      showMessage('Please enter both title and content', 'error')
      return
    }

    const now = new Date().toISOString()

    if (selectedNote) {
      // Update existing note
      setNotes(notes.map(note =>
        note.id === selectedNote.id
          ? { ...note, title, content, tags, category, updatedAt: now }
          : note
      ))
      showMessage('Note updated successfully!')
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        tags,
        category,
        createdAt: now,
        updatedAt: now,
      }
      setNotes([newNote, ...notes])
      showMessage('Note saved successfully!')
    }

    handleClear()
  }

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    if (selectedNote?.id === id) {
      handleClear()
    }
    showMessage('Note deleted successfully!')
  }

  const handleEdit = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags)
    setCategory(note.category)
  }

  const handleClear = () => {
    setTitle('')
    setContent('')
    setTags([])
    setTagInput('')
    setCategory('General')
    setSelectedNote(null)
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      const text = await file.text()
      const fileName = file.name.replace(/\.[^/.]+$/, '')
      setTitle(fileName)
      setContent(text)
      showMessage('File imported successfully!')
    } catch (error) {
      showMessage('Error importing file', 'error')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileImport,
    accept: { 'text/plain': ['.txt'], 'text/markdown': ['.md'] },
    multiple: false,
    noClick: true,
  })

  const handleBrowseClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.md'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFileImport([file])
    }
    input.click()
  }

  const downloadNote = (note: Note) => {
    const blob = new Blob([note.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${note.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('Note downloaded!')
  }

  const exportAllNotes = () => {
    const notesText = notes.map(note => 
      `=== ${note.title} ===\nCategory: ${note.category}\nTags: ${note.tags.join(', ')}\nCreated: ${new Date(note.createdAt).toLocaleString()}\n\n${note.content}\n\n`
    ).join('\n---\n\n')
    
    const blob = new Blob([notesText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `all-notes-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('All notes exported!')
  }

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort()

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory
    const matchesTag = filterTag === 'all' || note.tags.includes(filterTag)
    
    return matchesSearch && matchesCategory && matchesTag
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div {...getRootProps()} className="w-full">
            <input {...getInputProps()} />
            <button
              type="button"
              onClick={handleBrowseClick}
              className="w-full mb-4 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50 transition-colors"
            >
              📄 Import Text File
            </button>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Add tag..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-indigo-600"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                rows={12}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                {selectedNote ? 'Update Note' : 'Save Note'}
              </button>
              {selectedNote && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Notes
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, content, or tags..."
                  className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs"
                >
                  <option value="all">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={exportAllNotes}
              className="w-full text-xs text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50"
            >
              <DownloadIcon className="h-3 w-3 inline mr-1" />
              Export All Notes
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {notes.length === 0 ? 'No notes yet. Create your first note!' : 'No notes match your filters.'}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{note.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {note.category}
                        </span>
                        {note.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            <TagIcon className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-indigo-600 hover:text-indigo-700"
                        title="Edit"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadNote(note)}
                        className="text-gray-600 hover:text-gray-700"
                        title="Download"
                      >
                        <DownloadIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(note.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
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
