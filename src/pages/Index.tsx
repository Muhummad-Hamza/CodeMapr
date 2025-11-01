import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CodeInput } from "@/components/CodeInput";
import { FlowchartDisplay } from "@/components/FlowchartDisplay";
import { AlgorithmDisplay } from "@/components/AlgorithmDisplay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Node, Edge } from "reactflow";

const Index = () => {
  const [showApp, setShowApp] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flowchartData, setFlowchartData] = useState<{ nodes: Node[], edges: Edge[] } | null>(null);
  const [algorithmSteps, setAlgorithmSteps] = useState<string[]>([]);

  const handleAnalyze = async (code: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-code', {
        body: { code }
      });

      if (error) throw error;

      setFlowchartData(data.flowchart);
      setAlgorithmSteps(data.algorithm);
      toast.success("Code analyzed successfully!");
    } catch (error) {
      console.error('Error analyzing code:', error);
      toast.error("Failed to analyze code. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBackToHome = () => {
    setShowApp(false);
    setFlowchartData(null);
    setAlgorithmSteps([]);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-[var(--gradient-subtle)]">
        <Header onLogoClick={handleBackToHome} />
        
        {!showApp ? (
          <Hero onGetStarted={() => setShowApp(true)} />
        ) : (
          <main className="pt-24 pb-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <CodeInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                
                {flowchartData && (
                  <FlowchartDisplay 
                    nodes={flowchartData.nodes} 
                    edges={flowchartData.edges}
                  />
                )}
              </div>
              
              {algorithmSteps.length > 0 && (
                <AlgorithmDisplay steps={algorithmSteps} />
              )}
            </div>
          </main>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
