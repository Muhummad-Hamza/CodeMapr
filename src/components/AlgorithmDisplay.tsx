import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ListOrdered, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AlgorithmDisplayProps {
  steps: string[];
}

export const AlgorithmDisplay = ({ steps }: AlgorithmDisplayProps) => {
  const handleDownload = () => {
    const content = steps.map((step, index) => `${index + 1}. ${step}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'algorithm-steps.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded successfully",
      description: "Algorithm saved as text file",
    });
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-secondary" />
            <h2 className="text-xl font-semibold">Step-by-Step Algorithm</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        
        <ScrollArea className="h-[600px] rounded-lg border border-border/50 bg-background/50 p-4">
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li 
                key={index}
                className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-semibold">
                  {index + 1}
                </span>
                <p className="flex-1 text-sm leading-relaxed group-hover:text-foreground transition-colors">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </div>
    </Card>
  );
};
