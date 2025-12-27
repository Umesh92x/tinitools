import { Metadata } from "next";
import Calculator from "@/components/tools/educational/Calculator";
import { generateMetadata } from '@/lib/metadata'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export const metadata: Metadata = generateMetadata({
  title: "Scientific Calculator",
  description: "Free scientific calculator - Perform advanced calculations with scientific functions and unit conversions instantly. No signup required.",
  path: '/educational/calculator',
  keywords: ['scientific calculator', 'advanced calculator', 'calculator', 'math calculator', 'unit converter'],
});

export default function CalculatorPage() {
  const relatedTools = [
    { name: 'Math Formula Sheet', href: '/educational/math-formulas' },
    { name: 'Multiplication Table', href: '/educational/multiplication-table' },
    { name: 'Grade Calculator', href: '/educational/grade-calculator' },
    { name: 'GPA Calculator', href: '/educational/gpa-calculator' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Scientific Calculator"
        description="Free scientific calculator - Perform advanced calculations with scientific functions and unit conversions instantly. No signup required."
        category="Educational Tools"
        url="/educational/calculator"
      />
      <div className="container py-8">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Educational Tools', href: '/educational' },
          { label: 'Scientific Calculator' },
        ]} />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold dark:text-white">Scientific Calculator</h1>
          <p className="text-muted-foreground dark:text-gray-300 text-lg">
            Perform advanced calculations with scientific functions and unit conversions.
          </p>
        </div>
        <div className="mt-8">
          <Calculator />
        </div>
        <RelatedTools tools={relatedTools} currentTool="/educational/calculator" />
      </div>
    </>
  );
} 