import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PipelinePage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe seus negócios em andamento.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Novo Negócio
        </Button>
      </div>
    </div>
  );
}
