import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react"; // Optional: Icon für den Button
import { useTranslation } from "react-i18next";

interface CodeAreaProps {
    data: string;
    className?: string;
}

const JsonDisplay: React.FC<CodeAreaProps> = ({ data, className }) => {
    const [isCopied, setIsCopied] = useState(false);
    const {t} = useTranslation();

    const handleCopy = () => {
        navigator.clipboard
            .writeText(data)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Zeigt kurzzeitig an, dass kopiert wurde
            })
            .catch((err) => console.error(t('lastTranslations.converterPage.codearea.copyErr'), err));
    };

    return (
        <div className={`relative ${className}`}>
            <Textarea
                value={data}
                readOnly
                className="w-full h-64 p-4 border rounded-md"
            />
            <Button onClick={handleCopy} className="absolute top-2 right-6" variant="ghost" size={"sm"}>
                <Copy className="mr-2" size={10} />
                {isCopied ? t('lastTranslations.converterPage.codearea.copied') : t('lastTranslations.converterPage.codearea.copy')}
            </Button>
        </div>
    );
};

export default JsonDisplay;
