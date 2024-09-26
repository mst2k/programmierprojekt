import React, { useState, useEffect, useRef } from 'react';
import { Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {buildUrlParameter, parseUrlParameter} from "@/hooks/urlBuilder.tsx";

// Importieren Sie hier Ihre buildUrlParameter und parseUrlParameter Funktionen
// import { buildUrlParameter, parseUrlParameter } from './urlUtils';

const AdvancedShareButton = ({
                                 parameters,
                                 onParametersLoaded
                             }) => {
    const [shareLink, setShareLink] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const linkInputRef = useRef(null);

    useEffect(() => {
        const loadParametersFromUrl = async () => {
            const hash = window.location.hash;
            const queryStartIndex = hash.indexOf('?');

            if (queryStartIndex !== -1) {
                const queryString = hash.slice(queryStartIndex + 1);
                const urlParams = new URLSearchParams(queryString);
                let compressedParam = urlParams.get('param');

                if (compressedParam) {
                    try {
                        const decompressedParams = await parseUrlParameter(queryString);
                        console.log('Decompressed params:', decompressedParams);
                        onParametersLoaded(decompressedParams);
                    } catch (error) {
                        console.error('Failed to parse URL parameters:', error);
                    }
                } else {
                    console.log('No parameters found in URL');
                }
            }
        };

        loadParametersFromUrl();
    }, [onParametersLoaded]);

    const generateShareLink = async () => {
        try {
            const urlParam = await buildUrlParameter(parameters);
            const fullLink = `${window.location.origin}/#/solver?${urlParam}`;

            setShareLink(fullLink);
            setShowAlert(true);
            setCopySuccess(false);

            navigator.clipboard.writeText(fullLink).then(() => {
                console.log('Link copied to clipboard');
                setCopySuccess(true);
            }).catch(err => {
                console.error('Failed to copy link: ', err);
            });

            setTimeout(() => setShowAlert(false), 10000);
        } catch (error) {
            console.error('Failed to generate share link:', error);
        }
    };

    const handleManualCopy = () => {
        if (linkInputRef.current) {
            linkInputRef.current.select();
            document.execCommand('copy');
            setCopySuccess(true);
        }
    };

    return (
        <div className="relative ml-2">
            <Button onClick={generateShareLink} variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
            </Button>
            {showAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
                        <Alert>
                            <AlertTitle>Link generiert!</AlertTitle>
                            <AlertDescription>
                                <div className="mt-2 flex items-center space-x-2">
                                    <Input
                                        ref={linkInputRef}
                                        value={shareLink}
                                        readOnly
                                        className="flex-grow"
                                    />
                                    <Button onClick={handleManualCopy} size="sm">
                                        <Copy className="h-4 w-4 mr-2" />
                                        Kopieren
                                    </Button>
                                </div>
                                {copySuccess && (
                                    <p className="mt-2 text-sm text-green-600">Link wurde kopiert!</p>
                                )}
                            </AlertDescription>
                        </Alert>
                        <div className="mt-4 text-right">
                            <Button onClick={() => setShowAlert(false)} variant="outline">Schließen</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedShareButton;