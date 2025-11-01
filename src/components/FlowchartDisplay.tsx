import { useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { toPng } from "html-to-image";

interface FlowchartDisplayProps {
  nodes: Node[];
  edges: Edge[];
}

const FlowchartContent = ({ nodes, edges }: FlowchartDisplayProps) => {
  const [localNodes, , onNodesChange] = useNodesState(nodes);
  const [localEdges, , onEdgesChange] = useEdgesState(edges);
  const { getNodes } = useReactFlow();

  const handleDownload = useCallback(() => {
    const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (viewportElement) {
      // Get the bounding box of all nodes to crop properly
      const nodes = getNodes();
      if (nodes.length === 0) return;

      toPng(viewportElement, {
        backgroundColor: '#ffffff',
        filter: (node) => {
          // Exclude controls, minimap, and other UI elements
          return !node.classList?.contains('react-flow__controls') &&
                 !node.classList?.contains('react-flow__minimap') &&
                 !node.classList?.contains('react-flow__panel');
        },
      })
        .then((dataUrl) => {
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = 'flowchart.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast({
            title: "Downloaded successfully",
            description: "Flowchart saved as PNG image",
          });
        })
        .catch((error) => {
          console.error('Error downloading flowchart:', error);
          toast({
            title: "Download failed",
            description: "Could not export flowchart",
            variant: "destructive",
          });
        });
    }
  }, [getNodes]);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Visual Flowchart</h2>
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
        
        <div className="h-[600px] rounded-lg border border-border/50 overflow-hidden bg-background/50">
          <ReactFlow
            nodes={localNodes}
            edges={localEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            className="bg-transparent"
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={16} 
              size={1}
              className="opacity-50"
            />
            <Controls className="bg-card border-border" />
            <MiniMap 
              className="bg-card border-border"
              nodeColor={(node) => {
                if (node.type === 'input') return 'hsl(214, 100%, 52%)';
                if (node.type === 'output') return 'hsl(160, 84%, 39%)';
                return 'hsl(214, 20%, 96%)';
              }}
            />
          </ReactFlow>
        </div>
      </div>
    </Card>
  );
};

export const FlowchartDisplay = (props: FlowchartDisplayProps) => {
  return (
    <ReactFlowProvider>
      <FlowchartContent {...props} />
    </ReactFlowProvider>
  );
};
