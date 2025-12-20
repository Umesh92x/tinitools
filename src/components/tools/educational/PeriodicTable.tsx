'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, X } from 'lucide-react';

interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: string;
  block: string;
  electronConfiguration: string;
  description: string;
}

// Sample data for demonstration (first few elements)
const elements: Element[] = [
  {
    atomicNumber: 1,
    symbol: 'H',
    name: 'Hydrogen',
    atomicMass: 1.008,
    category: 'Nonmetal',
    block: 's',
    electronConfiguration: '1s¹',
    description: 'Hydrogen is the lightest element. Under ordinary conditions, it is a colorless, odorless, tasteless, non-toxic, nonmetallic gas.'
  },
  {
    atomicNumber: 2,
    symbol: 'He',
    name: 'Helium',
    atomicMass: 4.003,
    category: 'Noble Gas',
    block: 's',
    electronConfiguration: '1s²',
    description: 'Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas.'
  },
  // Add more elements as needed
];

const categoryColors: Record<string, string> = {
  'Nonmetal': 'bg-green-100 hover:bg-green-200',
  'Noble Gas': 'bg-purple-100 hover:bg-purple-200',
  'Alkali Metal': 'bg-red-100 hover:bg-red-200',
  'Alkaline Earth Metal': 'bg-orange-100 hover:bg-orange-200',
  'Metalloid': 'bg-teal-100 hover:bg-teal-200',
  'Halogen': 'bg-yellow-100 hover:bg-yellow-200',
  'Transition Metal': 'bg-blue-100 hover:bg-blue-200',
  'Post-Transition Metal': 'bg-indigo-100 hover:bg-indigo-200',
  'Lanthanide': 'bg-pink-100 hover:bg-pink-200',
  'Actinide': 'bg-rose-100 hover:bg-rose-200',
};

export default function PeriodicTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const filteredElements = elements.filter(element =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.atomicNumber.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search elements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {searchTerm && (
            <Button variant="ghost" onClick={() => setSearchTerm('')}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-18 gap-2">
        {elements.map((element) => (
          <button
            key={element.atomicNumber}
            className={`aspect-square p-2 rounded-lg ${categoryColors[element.category]} transition-colors`}
            onClick={() => setSelectedElement(element)}
          >
            <div className="text-xs text-right">{element.atomicNumber}</div>
            <div className="text-xl font-bold text-center">{element.symbol}</div>
            <div className="text-xs text-center truncate">{element.name}</div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
        {selectedElement && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedElement.name} ({selectedElement.symbol})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Atomic Number</div>
                  <div className="font-semibold">{selectedElement.atomicNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Atomic Mass</div>
                  <div className="font-semibold">{selectedElement.atomicMass}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="font-semibold">{selectedElement.category}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Block</div>
                  <div className="font-semibold">{selectedElement.block}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Electron Configuration</div>
                <div className="font-semibold">{selectedElement.electronConfiguration}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <p className="mt-1">{selectedElement.description}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {searchTerm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredElements.map((element) => (
              <button
                key={element.atomicNumber}
                className={`p-4 rounded-lg ${categoryColors[element.category]} text-left`}
                onClick={() => setSelectedElement(element)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold">{element.symbol}</div>
                  <div>
                    <div className="font-medium">{element.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Atomic number: {element.atomicNumber}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
} 