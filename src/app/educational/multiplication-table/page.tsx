import { Metadata } from "next";
import MultiplicationTable from "@/components/tools/educational/MultiplicationTable";

export const metadata: Metadata = {
  title: "Multiplication Table Generator - TiniTools",
  description: "Generate customizable multiplication tables for learning and practice.",
};

export default function MultiplicationTablePage() {
  return (
    <div className="container py-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Multiplication Table Generator</h1>
        <p className="text-muted-foreground text-lg">
          Generate multiplication tables with customizable ranges. Perfect for learning and teaching basic mathematics.
        </p>
      </div>
      <div className="mt-8">
        <MultiplicationTable />
      </div>
    </div>
  );
} 