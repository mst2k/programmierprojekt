import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react"; // Optional: Icon für den Button

const JsonDisplay: React.FC<{ data: string }> = ({ data }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard
            .writeText(data)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Zeigt kurzzeitig an, dass kopiert wurde
            })
            .catch((err) => console.error("Fehler beim Kopieren:", err));
    };

    return (
        <div className="relative">
            <Textarea
                value={data}
                readOnly
                className="w-full h-64 p-4 border rounded-md"
            />
            <Button onClick={handleCopy} className="absolute top-2 right-6" variant="ghost" size={"sm"}>
                <Copy className="mr-2" size={10} />
                {isCopied ? "Kopiert!" : "Kopieren"}
            </Button>
        </div>
    );
};

export default JsonDisplay;
