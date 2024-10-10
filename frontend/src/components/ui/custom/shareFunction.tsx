import { useState, useEffect, useRef } from 'react';
import { Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { buildUrlParameter, parseUrlParameter } from "@/hooks/urlBuilder.tsx";
import { useTranslation } from 'react-i18next';


/**
 * AdvancedShareButton Component
 *
 * A React component that generates and manages sharable links for application state.
 * It provides functionality to create, display, and copy a URL that encodes the current state parameters.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.parameters - An object containing the current state parameters to be shared
 * @param {Function} props.onParametersLoaded - A callback function that handles the loaded parameters from a shared URL
 *
 * @example
 * <AdvancedShareButton
 *   parameters={{ key1: 'value1', key2: 'value2' }}
 *   onParametersLoaded={(loadedParams) => handleLoadedParams(loadedParams)}
 * />
 *
 * @returns {JSX.Element} A button that, when clicked, generates a sharable link and displays it in an alert dialog
 *
 * @description
 * This component offers the following features:
 * - Generates a compressed URL parameter string from the provided state
 * - Displays the generated link in a modal dialog
 * - Provides a copy-to-clipboard functionality for the generated link
 * - Parses and loads parameters from the URL on component mount
 *
 * The component uses custom hooks for URL parameter building and parsing,
 * and integrates with UI components from a custom library.
 * It manages its own state for showing/hiding the share dialog and copy success message.
 */
const AdvancedShareButton = ({
    parameters,
    onParametersLoaded
}: {parameters: any, onParametersLoaded: any}) => {
    const [shareLink, setShareLink] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const linkInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const copySuccessTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    useEffect(() => {
        // Clear copySuccess when shareLink changes
        setCopySuccess(false);
        if (copySuccessTimeoutRef.current) {
            clearTimeout(copySuccessTimeoutRef.current);
        }
    }, [shareLink]);

    const generateShareLink = async () => {
        try {
            const urlParam = await buildUrlParameter(parameters);
            const fullLink = `${window.location.origin}${window.location.pathname}/#/solver?${urlParam}`;

            setShareLink(fullLink);
            setShowAlert(true);
            setCopySuccess(false);

            setTimeout(() => setShowAlert(false), 10000);
        } catch (error) {
            console.error('Failed to generate share link:', error);
        }
    };

    const handleManualCopy = () => {
        if (linkInputRef.current) {
            linkInputRef.current.select();
            navigator.clipboard.writeText(linkInputRef.current.value)
                .then(() => {
                    console.log('Link copied to clipboard');
                    setCopySuccess(true);
                    if (copySuccessTimeoutRef.current) {
                        clearTimeout(copySuccessTimeoutRef.current);
                    }
                    copySuccessTimeoutRef.current = setTimeout(() => {
                        setCopySuccess(false);
                    }, 10000);
                })
                .catch(err => {
                    console.error('Failed to copy link: ', err);
                    setCopySuccess(false);
                });
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
                            <AlertTitle>{t('sharableLink.linkGenerated')}</AlertTitle>
                            <AlertDescription>
                                <div className="mt-2 flex items-center space-x-2">
                                    <Input
                                        ref={linkInputRef}
                                        value={shareLink}
                                        readOnly
                                        className="flex-grow"
                                    />
                                    <Button onClick={handleManualCopy} size="sm">
                                        <Copy className="h-4 w-4 mr-2"/>
                                        {t('sharableLink.copy')}
                                    </Button>
                                </div>
                                {copySuccess && (
                                    <p className="mt-2 text-sm text-green-600">{t('sharableLink.linkCopied')}</p>
                                )}
                            </AlertDescription>
                        </Alert>
                        <div className="mt-4 text-right">
                            <Button onClick={() => setShowAlert(false)} variant="outline">{t('sharableLink.close')}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedShareButton;