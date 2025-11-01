import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Code, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CodeInputProps {
  onAnalyze: (code: string) => void;
  isAnalyzing: boolean;
}

export const CodeInput = ({ onAnalyze, isAnalyzing }: CodeInputProps) => {
  const [code, setCode] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        toast.success("File uploaded successfully!");
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast.error("Please enter or upload some code first!");
      return;
    }
    onAnalyze(code);
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your Code</h2>
          </div>
          
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" asChild className="cursor-pointer">
              <span>
                <Upload className="h-4 w-4" />
                Upload File
              </span>
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".py,.js,.java,.cpp,.c,.ts,.jsx,.tsx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        
        <Textarea
          placeholder="Paste your code here or upload a file...&#10;&#10;Example:&#10;function fibonacci(n) {&#10;  if (n <= 1) return n;&#10;  return fibonacci(n-1) + fibonacci(n-2);&#10;}"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-[400px] font-mono text-sm bg-background/50 resize-none"
        />
        
        <Button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          variant="gradient"
          size="lg"
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Flowchart & Algorithm
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75L19 3z" />
  </svg>
);
