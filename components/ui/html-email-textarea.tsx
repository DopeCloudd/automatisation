import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";

export function CopyableHtmlEmail({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const blob = new Blob([html], { type: "text/html" });
    const data = [new ClipboardItem({ "text/html": blob })];
    await navigator.clipboard.write(data);
    setCopied(true);

    // Revenir à l’état initial après 3 secondes
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <FormLabel>Listing des réunions prêt à copier :</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copier
            </>
          )}
        </Button>
      </div>

      <div
        ref={ref}
        className="prose bg-muted p-4 rounded border text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
