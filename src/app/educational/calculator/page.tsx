import { Metadata } from "next";
import Calculator from "@/components/tools/educational/Calculator";

export const metadata: Metadata = {
  title: "Scientific Calculator - TiniTools",
  description: "Advanced calculator with scientific functions and unit conversions.",
};

export default function CalculatorPage() {
  return (
    <div className="container py-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Scientific Calculator</h1>
        <p className="text-muted-foreground text-lg">
          Perform advanced calculations with scientific functions and unit conversions.
        </p>
      </div>
      <div className="mt-8">
        <Calculator />
      </div>
    </div>
  );
} 