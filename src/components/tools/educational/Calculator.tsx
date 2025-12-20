'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ScientificButton {
  label: string;
  fn?: (n: number) => number;
  value?: number | string;
}

const scientificButtons: ScientificButton[] = [
  { label: 'sin', fn: Math.sin },
  { label: 'cos', fn: Math.cos },
  { label: 'tan', fn: Math.tan },
  { label: 'log', fn: Math.log10 },
  { label: 'ln', fn: Math.log },
  { label: '√', fn: Math.sqrt },
  { label: 'π', value: Math.PI },
  { label: 'e', value: Math.E },
  { label: '^', value: '^' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: '!', fn: (n: number) => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
  }},
];

const numberButtons = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [memory, setMemory] = useState<number>(0);
  const [degreeMode, setDegreeMode] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    if (op === '=') {
      try {
        let result = evaluateExpression(expression + display);
        setDisplay(result.toString());
        setExpression('');
      } catch (error) {
        toast.error('Invalid expression');
        setDisplay('0');
      }
    } else {
      setExpression(expression + display + op);
      setIsNewNumber(true);
    }
  };

  const handleScientific = (button: ScientificButton) => {
    if ('value' in button && button.value !== undefined) {
      handleNumber(button.value.toString());
    } else if ('fn' in button && button.fn !== undefined) {
      try {
        const value = parseFloat(display);
        let result: number;
        
        if (button.label === 'sin' || button.label === 'cos' || button.label === 'tan') {
          const radians = degreeMode ? value * (Math.PI / 180) : value;
          result = button.fn(radians);
        } else {
          result = button.fn(value);
        }
        
        setDisplay(result.toString());
        setIsNewNumber(true);
      } catch (error) {
        toast.error('Invalid operation');
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setIsNewNumber(true);
  };

  const handleMemory = (operation: 'M+' | 'M-' | 'MR' | 'MC') => {
    const currentValue = parseFloat(display);
    switch (operation) {
      case 'M+':
        setMemory(memory + currentValue);
        toast.success('Added to memory');
        break;
      case 'M-':
        setMemory(memory - currentValue);
        toast.success('Subtracted from memory');
        break;
      case 'MR':
        setDisplay(memory.toString());
        setIsNewNumber(true);
        break;
      case 'MC':
        setMemory(0);
        toast.success('Memory cleared');
        break;
    }
  };

  const evaluateExpression = (expr: string): number => {
    // This is a simple implementation. In a real calculator, you'd want to use a proper
    // expression parser/evaluator library for safety and accuracy
    return Function('"use strict";return (' + expr + ')')();
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
            {expression}
          </div>
          <Input
            value={display}
            readOnly
            className="text-right text-2xl font-mono"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={() => setDegreeMode(!degreeMode)}
            className="col-span-2"
          >
            {degreeMode ? 'DEG' : 'RAD'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleClear()}
            className="col-span-2"
          >
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" onClick={() => handleMemory('MC')}>MC</Button>
          <Button variant="outline" onClick={() => handleMemory('MR')}>MR</Button>
          <Button variant="outline" onClick={() => handleMemory('M+')}>M+</Button>
          <Button variant="outline" onClick={() => handleMemory('M-')}>M-</Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {scientificButtons.map((button) => (
            <Button
              key={button.label}
              variant="outline"
              onClick={() => handleScientific(button)}
            >
              {button.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {numberButtons.map((button) => (
            <Button
              key={button}
              variant={['/', '*', '-', '+', '='].includes(button) ? 'default' : 'outline'}
              onClick={() =>
                ['/', '*', '-', '+', '='].includes(button)
                  ? handleOperator(button)
                  : handleNumber(button)
              }
            >
              {button}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
} 