import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"
import { Save, Trash2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface StatePersistenceProps {
    pageIdentifier: string;
    onSave: () => { [key: string]: string };
    onRestore: (state: { [key: string]: string }) => void;
}

const STORAGE_KEY_PREFIX = 'lastState_';

export const StatePersistence: React.FC<StatePersistenceProps> = ({ pageIdentifier, onSave, onRestore }) => {
    const { t } = useTranslation();
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [lastState, setLastState] = useState<{ [key: string]: string } | null>(null);
    const { toast } = useToast()

    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const hash = window.location.hash;
        const queryStartIndex = hash.indexOf('?');
        if (queryStartIndex === -1) {
            const storedState = localStorage.getItem(`${STORAGE_KEY_PREFIX}${pageIdentifier}`);
            if (storedState) {

                setLastState(JSON.parse(storedState));
                setShowRestoreDialog(true);
            }
        }
    }, [pageIdentifier]);

    const handleSave = () => {
        const stateToSave = onSave();
        setIsSaving(true)
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${pageIdentifier}`, JSON.stringify(stateToSave));
        setIsSaving(false)
        toast({
            title: t('store.saved'),
            description: t('store.savedDescription'),
            duration: 3000,
        })
    };

    const handleRestore = () => {
        if (lastState) {
            onRestore(lastState);
            setShowRestoreDialog(false);
            // Hier würden Sie zur entsprechenden Seite navigieren, falls nötig
            // navigate(`/page/${pageIdentifier}?${new URLSearchParams(lastState).toString()}`);
        }
    };

    const handleDecline = () => {
        setShowRestoreDialog(false);
    };

    const handleDelete = () => {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${pageIdentifier}`);
        setShowRestoreDialog(false);
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="ml-2"
                            variant="outline"
                            size="icon"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('store.name')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('store.restorePreviousState')}</DialogTitle>
                    </DialogHeader>
                    <p>{t('store.restorePreviousStateQuestion')}</p>
                    <DialogFooter>
                        <Button onClick={handleRestore}>{t('store.restore')}</Button>
                        <Button variant="outline" onClick={handleDecline}>{t('store.decline')}</Button>
                        <Button variant="outline" size={"icon"} onClick={handleDelete}><Trash2Icon className="h-4 w-4"/></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};