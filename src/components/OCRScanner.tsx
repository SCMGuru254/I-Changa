import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseOCRText } from '@/utils/ocrUtils';

interface OCRScannerProps {
    onScanComplete: (data: { text: string; amount?: number; date?: Date; foundName?: string }) => void;
    knownNames?: string[];
}

export function OCRScanner({ onScanComplete, knownNames = [] }: OCRScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        toast({
            title: "Scanning image...",
            description: "Please wait while we extract the text.",
        });

        try {
            const result = await Tesseract.recognize(
                file,
                'eng',
                { logger: m => console.log(m) }
            );

            const text = result.data.text;
            const extractedData = parseOCRText(text, knownNames);

            onScanComplete({
                text,
                ...extractedData
            });

            toast({
                title: "Scan Complete",
                description: "We've extracted info from the image!",
            });

        } catch (error) {
            console.error("OCR Error:", error);
            toast({
                title: "Scan Failed",
                description: "Could not read the image. Please try a clearer photo.",
                variant: "destructive",
            });
        } finally {
            setIsScanning(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex gap-2 w-full">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <Button
                type="button"
                variant="outline"
                className="w-full flex gap-2 border-dashed border-2 py-8"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
            >
                {isScanning ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span>Scanning...</span>
                    </>
                ) : (
                    <>
                        <Camera className="w-6 h-6 text-muted-foreground" />
                        <div className="flex flex-col items-start">
                            <span className="font-semibold">Scan Record Book / Receipt</span>
                            <span className="text-xs text-muted-foreground">Auto-fill details from photo</span>
                        </div>
                    </>
                )}
            </Button>
        </div>
    );
}
