import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function QrDialog({ open, onOpenChange, url, slug }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  url: string;
  slug: string;
}) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(url, { width: 512, margin: 2, color: { dark: "#7a1f2b", light: "#ffffff" } })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [open, url]);

  const download = () => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${slug}.png`;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription className="break-all">{url}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          {dataUrl ? (
            <img src={dataUrl} alt="QR Code" className="h-64 w-64 rounded-xl border border-border" />
          ) : (
            <div className="h-64 w-64 animate-pulse rounded-xl bg-muted" />
          )}
          <Button onClick={download} disabled={!dataUrl} className="bg-gradient-primary text-primary-foreground">
            <Download className="h-4 w-4" /> Unduh PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
