'use client'

import { useState } from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface Formula {
  id: string
  title: string
  latex: string
  description: string
  category: 'Algebra' | 'Geometry' | 'Calculus'
}

const formulas: Formula[] = [
  {
    id: 'quadratic',
    title: 'Quadratic Formula',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Solves quadratic equations in the form ax² + bx + c = 0',
    category: 'Algebra',
  },
  {
    id: 'pythagorean',
    title: 'Pythagorean Theorem',
    latex: 'a^2 + b^2 = c^2',
    description: 'Relates the lengths of the sides of a right triangle',
    category: 'Geometry',
  },
  {
    id: 'circle-area',
    title: 'Area of a Circle',
    latex: 'A = \\pi r^2',
    description: 'Calculates the area of a circle with radius r',
    category: 'Geometry',
  },
  {
    id: 'sphere-volume',
    title: 'Volume of a Sphere',
    latex: 'V = \\frac{4}{3}\\pi r^3',
    description: 'Calculates the volume of a sphere with radius r',
    category: 'Geometry',
  },
  {
    id: 'derivative-power',
    title: 'Derivative Power Rule',
    latex: '\\frac{d}{dx}x^n = nx^{n-1}',
    description: 'Basic rule for finding the derivative of a power function',
    category: 'Calculus',
  },
  {
    id: 'integration-power',
    title: 'Integration Power Rule',
    latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
    description: 'Basic rule for integrating a power function',
    category: 'Calculus',
  },
  {
    id: 'exponential',
    title: 'Exponential Function',
    latex: 'f(x) = e^x',
    description: 'The natural exponential function',
    category: 'Algebra',
  },
  {
    id: 'logarithm',
    title: 'Natural Logarithm',
    latex: '\\ln(e^x) = x',
    description: 'The natural logarithm function',
    category: 'Algebra',
  },
  {
    id: 'sine-cosine',
    title: 'Sine and Cosine',
    latex: '\\sin^2(x) + \\cos^2(x) = 1',
    description: 'Fundamental trigonometric identity',
    category: 'Algebra',
  },
  {
    id: 'cylinder-volume',
    title: 'Volume of a Cylinder',
    latex: 'V = \\pi r^2h',
    description: 'Calculates the volume of a cylinder with radius r and height h',
    category: 'Geometry',
  },
  {
    id: 'derivative-chain',
    title: 'Chain Rule',
    latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x))g\'(x)',
    description: 'Rule for finding the derivative of a composite function',
    category: 'Calculus',
  },
  {
    id: 'integration-by-parts',
    title: 'Integration by Parts',
    latex: '\\int u\\,dv = uv - \\int v\\,du',
    description: 'Formula for integrating products of functions',
    category: 'Calculus',
  },
  {
    id: 'arithmetic-sequence',
    title: 'Arithmetic Sequence',
    latex: 'a_n = a_1 + (n-1)d',
    description: 'nth term of an arithmetic sequence with first term a₁ and common difference d',
    category: 'Algebra',
  },
  {
    id: 'geometric-sequence',
    title: 'Geometric Sequence',
    latex: 'a_n = a_1r^{n-1}',
    description: 'nth term of a geometric sequence with first term a₁ and common ratio r',
    category: 'Algebra',
  },
  {
    id: 'arithmetic-series',
    title: 'Arithmetic Series Sum',
    latex: 'S_n = \\frac{n}{2}(a_1 + a_n) = \\frac{n}{2}[2a_1 + (n-1)d]',
    description: 'Sum of n terms of an arithmetic sequence',
    category: 'Algebra',
  },
  {
    id: 'geometric-series',
    title: 'Geometric Series Sum',
    latex: 'S_n = a_1\\frac{1-r^n}{1-r}',
    description: 'Sum of n terms of a geometric sequence where r ≠ 1',
    category: 'Algebra',
  },
  {
    id: 'surface-area-sphere',
    title: 'Surface Area of Sphere',
    latex: 'A = 4\\pi r^2',
    description: 'Calculates the surface area of a sphere with radius r',
    category: 'Geometry',
  },
  {
    id: 'cone-volume',
    title: 'Volume of Cone',
    latex: 'V = \\frac{1}{3}\\pi r^2h',
    description: 'Calculates the volume of a cone with radius r and height h',
    category: 'Geometry',
  },
  {
    id: 'triangle-area',
    title: 'Area of Triangle',
    latex: 'A = \\frac{1}{2}bh = \\frac{1}{2}ab\\sin(C)',
    description: 'Area using base and height, or two sides and included angle',
    category: 'Geometry',
  },
  {
    id: 'derivative-product',
    title: 'Product Rule',
    latex: '\\frac{d}{dx}[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)',
    description: 'Rule for finding the derivative of a product of functions',
    category: 'Calculus',
  },
  {
    id: 'derivative-quotient',
    title: 'Quotient Rule',
    latex: '\\frac{d}{dx}[\\frac{f(x)}{g(x)}] = \\frac{f\'(x)g(x) - f(x)g\'(x)}{[g(x)]^2}',
    description: 'Rule for finding the derivative of a quotient of functions',
    category: 'Calculus',
  },
  {
    id: 'trig-derivatives',
    title: 'Trigonometric Derivatives',
    latex: '\\frac{d}{dx}\\sin(x) = \\cos(x), \\frac{d}{dx}\\cos(x) = -\\sin(x)',
    description: 'Basic derivatives of sine and cosine functions',
    category: 'Calculus',
  },
  {
    id: 'distance-formula',
    title: 'Distance Formula',
    latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
    description: 'Distance between two points in a plane',
    category: 'Geometry',
  },
  {
    id: 'midpoint-formula',
    title: 'Midpoint Formula',
    latex: '(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2})',
    description: 'Coordinates of the midpoint between two points',
    category: 'Geometry',
  },
  {
    id: 'slope-formula',
    title: 'Slope Formula',
    latex: 'm = \\frac{y_2-y_1}{x_2-x_1}',
    description: 'Slope of a line through two points',
    category: 'Algebra',
  },
  {
    id: 'compound-interest',
    title: 'Compound Interest',
    latex: 'A = P(1 + \\frac{r}{n})^{nt}',
    description: 'Amount after t years with principal P, rate r, compounded n times per year',
    category: 'Algebra',
  }
]

export default function MathFormulaSheet() {
  const [selectedCategory, setSelectedCategory] = useState<Formula['category'] | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFormulas = formulas.filter(formula => {
    const matchesCategory = selectedCategory === 'All' || formula.category === selectedCategory
    const matchesSearch = formula.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formula.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search formulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="flex justify-center space-x-2">
          {['All', 'Algebra', 'Geometry', 'Calculus'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as Formula['category'] | 'All')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFormulas.map((formula) => (
          <div
            key={formula.id}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {formula.title}
            </h3>
            <div className="py-4 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
              <BlockMath math={formula.latex} />
            </div>
            <p className="text-sm text-gray-600">{formula.description}</p>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {formula.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 