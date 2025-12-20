'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon, UploadIcon, DownloadIcon } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  fileName?: string;  // Original file name if imported
  fileType?: string;  // File type (txt/doc)
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

interface Window {
  showSaveFilePicker(options: {
    suggestedName: string;
    types: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }): Promise<FileSystemFileHandle>;
}

export default function NoteTaking() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedNotes, setSavedNotes] = useState<Record<string, { 
    title: string; 
    content: string; 
    lastModified: string;
    fileName?: string;
  }>>({});

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        setSavedNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
        toast.error('Error loading saved notes');
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(savedNotes));
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Error saving notes to storage');
    }
  }, [savedNotes]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter both title and content');
      return;
    }

    try {
      // Save to localStorage
      const note = { 
        title, 
        content, 
        lastModified: new Date().toISOString(),
        fileName: `${title}.txt`
      };
      const notes = { ...savedNotes, [title]: note };
      setSavedNotes(notes);

      // Save to file
      const blob = new Blob([content], { type: 'text/plain' });
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `${title}.txt`,
        types: [
          {
            description: 'Text Files',
            accept: {
              'text/plain': ['.txt'],
            },
          },
        ],
      });
      
      // Get write permission and save the file
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();

      setTitle('');
      setContent('');
      setSelectedNote(null);
      toast.success('Note saved successfully!');
    } catch (err: unknown) {
      // If user cancels the save dialog, don't show error
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error saving file:', err);
        toast.error('Failed to save file');
      }
    }
  };

  const handleDelete = (noteTitle: string) => {
    const newNotes = { ...savedNotes };
    delete newNotes[noteTitle];
    setSavedNotes(newNotes);
    
    if (selectedNote?.title === noteTitle) {
      setSelectedNote(null);
      setTitle('');
      setContent('');
    }
    toast.success('Note deleted successfully');
  };

  const handleEdit = (noteTitle: string) => {
    const note = savedNotes[noteTitle];
    setSelectedNote({ title: note.title, content: note.content } as Note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
    setSelectedNote(null);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const fileName = file.name;
      const fileTitle = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
      
      setTitle(fileTitle);
      setContent(text);
      toast.success('File imported successfully');
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Error importing file');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Write your note here..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit">
              <PlusIcon className="w-4 h-4 mr-2" />
              {selectedNote ? 'Update Note' : 'Save Note'}
            </Button>
            {selectedNote && (
              <Button variant="outline" onClick={handleClear} type="button">
                Cancel
              </Button>
            )}
            <div className="ml-auto">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".txt,.doc,.docx"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Import File
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            * Notes are saved both locally in your browser and as text files
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {Object.entries(savedNotes).map(([noteTitle, note]) => (
          <Card key={noteTitle} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{note.title}</h3>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                    TXT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {note.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(note.lastModified).toLocaleDateString()}
                  {note.fileName && ` • ${note.fileName}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(noteTitle)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(noteTitle)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 