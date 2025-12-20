'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Formula {
  name: string;
  latex: string;
  description: string;
  category: string;
}

const formulas: Formula[] = [
  {
    name: 'Quadratic Formula',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Solves quadratic equations in the form ax² + bx + c = 0',
    category: 'Algebra'
  },
  {
    name: 'Pythagorean Theorem',
    latex: 'a^2 + b^2 = c^2',
    description: 'Relates the lengths of the sides of a right triangle',
    category: 'Geometry'
  },
  {
    name: 'Area of a Circle',
    latex: 'A = \\pi r^2',
    description: 'Calculates the area of a circle with radius r',
    category: 'Geometry'
  },
  {
    name: 'Volume of a Sphere',
    latex: 'V = \\frac{4}{3}\\pi r^3',
    description: 'Calculates the volume of a sphere with radius r',
    category: 'Geometry'
  },
  {
    name: 'Derivative Power Rule',
    latex: '\\frac{d}{dx}x^n = nx^{n-1}',
    description: 'Basic rule for finding the derivative of a power function',
    category: 'Calculus'
  },
  {
    name: 'Integration Power Rule',
    latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
    description: 'Basic rule for integrating a power function',
    category: 'Calculus'
  },
  // Add more formulas as needed
];

const categories = Array.from(new Set(formulas.map(f => f.category)));

export default function MathFormulas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || formula.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedFormula(latex);
    toast.success('Formula copied to clipboard');
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search formulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          {searchTerm && (
            <Button variant="ghost" onClick={() => setSearchTerm('')}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFormulas.map((formula) => (
          <Card key={formula.name} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{formula.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(formula.latex)}
                >
                  {copiedFormula === formula.latex ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center overflow-x-auto">
                <code className="text-lg">{formula.latex}</code>
              </div>
              <p className="text-sm text-muted-foreground">{formula.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {formula.category}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredFormulas.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">
          No formulas found matching your search criteria.
        </Card>
      )}
    </div>
  );
} 