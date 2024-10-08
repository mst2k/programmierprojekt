import React, {useState, useEffect, useRef} from 'react'
import { Button } from "@/components/ui/button.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx"
import { InfoIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx"
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";
import {useTranslation} from "react-i18next";
import { ProblemEditor } from '../../custom/ProblemEditor/ProblemEditor.tsx'
import {clearUrlParams} from "@/hooks/urlBuilder.tsx"
import AdvancedShareButton from "@/components/ui/custom/shareFunction.tsx";
import {StatePersistence} from "@/components/ui/custom/keepState.tsx";

type Item = {
    id: number;
    content: ProblemFormats;
    status: 'nativ' | 'conversion' | 'unsupported';
    description: string;
}

/**
 * Basic Input
 *
 * Returns a text editor with syntax highlighting. The Editor can handle GMPL, LP and MPS.
 *
 * @param states various states that need to be synced about various pages (sidebar, result, etc.)
 *
 * */
export default function BasicModelInput(states:any) {
    const { t } = useTranslation()

    const {
        currentSolver,
        setCurrentLpFormat,
        currentProblem,
        setCurrentProblem,
        currentLpFormat,
        solveTrigger,
        setSolveTrigger,
        setCurrentInputVariant,
        setCurrentSolver
    }: {
        currentSolver: Solvers;
        setCurrentSolver: (solver: Solvers) => void;
        currentLpFormat: ProblemFormats;
        setCurrentLpFormat: (format: ProblemFormats) => void;
        currentProblem: string;
        setCurrentProblem: (problem: string) => void;
        solveTrigger: number,
        setSolveTrigger: (problem: number) => void
        currentInputVariant: string,
        setCurrentInputVariant: (variant: string) => void
    } = states.states;

    const [selectedItem, setSelectedItem] = useState<Item | null>({ id: 1, content: "GMPL", status: "nativ", description: t('description_gmpl') })
    const [modelInput, setModelInput] = useState('')
    const [showConverstionAlert, setShowConverstionAlert] = useState(false)
    const [showNoModelTypeAlert, setShowNoModelTypeAlert] = useState(false)
    const [gmplState, setGmplState] = useState<Item["status"]>("unsupported");
    const [lpState, setLpState] = useState<Item["status"]>("unsupported");
    const [mpsState, setMpsState] = useState<Item["status"]>("unsupported");
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const tooltipRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsTooltipOpen(false)
            }
        }

        if (isMobile && isTooltipOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('touchstart', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [isMobile, isTooltipOpen])

    const toggleTooltip = () => {
        if (isMobile) {
            setIsTooltipOpen(true)
        } else {
            setIsTooltipOpen(!isTooltipOpen)
        }
    }


    //SHARE BUTTON FUCTIONS
    const handleParametersLoaded = (loadedParams:{[key: string]: string}) => {
        console.log('Geladene Parameter:', loadedParams);
        if(loadedParams.currentPage){
            if(loadedParams.currentPage==="general"){
                if(loadedParams.currentSolver && loadedParams.currentLpFormat && loadedParams.currentPage && loadedParams.currentSolver){
                    setCurrentLpFormat(loadedParams.currentLPFormat as ProblemFormats)
                    setModelInput(loadedParams.currentProblem as string)
                    setCurrentSolver(loadedParams.currentSolver as Solvers)
                }
                clearUrlParams()
            }else{
                setCurrentInputVariant(loadedParams.currentPage)
            }
        }
    };

    const handleSaveState = () => {
        return {
            currentLPFormat: currentLpFormat,
            currentProblem: modelInput,
            currentSolver: currentSolver,
            currentPage: "basic"
        };
    };

    const handleRestoreState = (state: { [key: string]: string }) => {
        if (state.currentSolver) {
            setCurrentSolver(state.currentSolver as Solvers);
        }
        if (state.currentProblem) {
            setModelInput(state.currentProblem);
        }
        if (state.currentLPFormat) {
            setCurrentLpFormat(state.currentLPFormat as ProblemFormats);
        }
    };

    useEffect(() => {
        switch (currentSolver) {
            case "Highs":
                setSolverHighs();
                break;
            case "GLPKJavil":
                setSolverGlpkJavil();
                break;
            case "GLPKHgourvest":
                setSolverGlpkHgourvest();
                break;
        }
    }, [currentSolver]);

    useEffect(() => {
        console.log("Selected language:", selectedItem ? selectedItem.content : "Not selected");
    }, [selectedItem]);

    const items:Item[]=[
        { id: 1, content: 'GMPL', status: gmplState, description: t('description_gmpl') },
        { id: 2, content: 'LP', status: lpState, description: t('description_lp') },
        { id: 3, content: 'MPS', status: mpsState, description: t('description_mps') },
    ]

    const setSolverHighs = () => {
        setGmplState('conversion');
        setLpState('nativ');
        setMpsState('conversion');
    }
    const setSolverGlpkJavil = () => {
        setGmplState('conversion');
        setLpState('conversion');
        setMpsState('conversion');
    }
    const setSolverGlpkHgourvest = () => {
        setGmplState('nativ');
        setLpState('nativ');
        setMpsState('conversion');
    }

    const getStatusLabel = (status: Item['status']) => {
        switch (status) {
            case 'nativ':
                return t('status_native');
            case 'conversion':
                return t('status_conversion');
            case 'unsupported':
                return t('status_unsupported');
        }
    }

    const getStatusColor = (status: Item['status']) => {
        switch (status) {
            case 'nativ':
                return 'bg-green-500';
            case 'conversion':
                return 'bg-yellow-500';
            case 'unsupported':
                return 'bg-red-500';
        }
    }



    function triggerSolving(_:any, solveAnyway?: boolean) {
        let conversion = false;
        if(selectedItem?.content){
            const cItem = items.find(item => item.content === selectedItem.content) || null
            if(cItem?.status) conversion = cItem.status === "conversion";
        }
        if (solveAnyway != true && conversion) {
            setShowConverstionAlert(true);
        } else {
            if(selectedItem?.content){
                setCurrentLpFormat(selectedItem.content);
                setCurrentProblem(modelInput);
                setSolveTrigger(solveTrigger + 1);
            }else {
                setShowConverstionAlert(true);
            }
        }
    }

    const handleFileUpload = async (event:any) => {
        const file = event.target.files[0];
        if (!file) return;

        // Erkennen des Dateiformats basierend auf der Dateiendung
        const fileName = file.name.toLowerCase();
        let format;
        if (fileName.endsWith('.mps')) {
            format = 'MPS';
        } else if (fileName.endsWith('.lp')) {
            format = 'LP';
        } else if (fileName.endsWith('.mod') || fileName.endsWith('.gmpl')) {
            format = 'GMPL';
        } else {
            alert('Nicht unterstütztes Dateiformat. Bitte laden Sie eine .mps, .lp oder .mod/.gmpl Datei hoch.');
            return;
        }

        // Setzen des LP-Formats
        setCurrentLpFormat(format as ProblemFormats);

        // Lesen des Dateiinhalts
        const reader = new FileReader();
        reader.onload = async (e) => {
            //@ts-expect-error
            const content = e.target.result;
            //@ts-expect-error
            setModelInput(content);
        };
        reader.onerror = (error) => {
            console.error('Fehler beim Lesen der Datei:', error);
            alert('Fehler beim Lesen der Datei. Bitte versuchen Sie es erneut.');
        };
        reader.readAsText(file);
    };

    const UploadButton = () => {
        const fileInputRef = useRef(null);

        return (
            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".mps,.lp,.mod,.gmpl"
                />
                {/* @ts-expect-error*/}
                <Button onClick={() => fileInputRef.current.click()}>
                    {t('basicModelInput.upload')}
                </Button>
            </div>
        );
    };



    return (
        <TooltipProvider>
            <div className="flex items-center justify-center w-full">
                <div className="w-full max-w-4xl p-0 flex flex-col space-y-0 h-[62vh]">
                    <Tabs
                        value={selectedItem?.id.toString() || "1"}
                        onValueChange={(value) => setSelectedItem(items.find(item => item.id === parseInt(value)) || null)}
                        className="w-full mb-1 joyride-solver-input-tabs"
                    >
                        <TabsList className="grid w-full grid-cols-3 gap-2">
                            {items.map((item) => (
                                <TabsTrigger
                                    key={item.id}
                                    value={item.id.toString()}
                                    className="relative flex items-center justify-center"
                                >
                                    <span>{item.content}</span>
                                    <span
                                        className={`absolute top-1/2 right-1 transform -translate-y-1/2 px-2 text-xs rounded-full text-white ${getStatusColor(
                                            item.status
                                        )}`}
                                    >
                                        <p className={"hidden md:flex"}>{getStatusLabel(item.status)}</p>
                                        <p className={"md:hidden"}> <br/> </p>
                                </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                    <div className="relative flex-grow border rounded-lg p-1 joyride-solver-input-editor">
                        <ProblemEditor
                            problemFormat={selectedItem?.content || 'GMPL'}
                            value={modelInput}
                            onChange={(value: React.SetStateAction<string>) => setModelInput(value)}
                        />
                        {selectedItem && (
                            <Tooltip open={isTooltipOpen}>
                                <TooltipTrigger
                                    className="absolute top-2 right-6 p-1 text-muted-foreground hover:text-foreground"
                                    onClick={toggleTooltip}
                                    onTouchStart={toggleTooltip}
                                    ref={tooltipRef}
                                >
                                    <InfoIcon className="h-4 w-4 " />
                                    <span className="sr-only">Info</span>
                                </TooltipTrigger>
                                <TooltipContent
                                    className="max-w-xs p-2 bg-gray-800 text-white rounded-md shadow-lg whitespace-pre-wrap"
                                    sideOffset={5}
                                >
                                    <p className="text-sm">{selectedItem.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                    <div className="flex justify-between w-full">
                        <div className="pt-2 joyride-solver-upload-button">
                            <UploadButton/>
                        </div>
                        <div className="flex justify-end pt-2">
                            <div className='joyride-solver-solve-button'>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={triggerSolving}>{t('basicModelInput.solve')}</Button>
                                    </TooltipTrigger>
                                    <TooltipContent className='bg-gray-800 text-white rounded-md shadow-lg whitespace-pre-wrap'>
                                        <p className="text-sm">{t('tooltip.solveButton')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <span className="joyride-solver-share-button">
                                    <AdvancedShareButton
                                    parameters={{
                                        currentSolver: currentSolver , 
                                        currentLpFormat:currentLpFormat, 
                                        currentProblem:currentProblem, 
                                        currentPage: "general" 
                                    }}
                                    onParametersLoaded={handleParametersLoaded}
                                    />
                                </span>
                                </TooltipTrigger>
                                <TooltipContent className='bg-gray-800 text-white rounded-md shadow-lg whitespace-pre-wrap'>
                                    <p className="text-sm">{t('tooltip.shareButton')}</p>
                                </TooltipContent>
                            </Tooltip>
                            <div className="joyride-solver-state-button">
                                <StatePersistence
                                    pageIdentifier="basic"
                                    onSave={handleSaveState}
                                    onRestore={handleRestoreState}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={showConverstionAlert} onOpenChange={setShowConverstionAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('conversion_dialog_title')}</DialogTitle>
                        <DialogDescription>
                            {t('conversion_dialog_description')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConverstionAlert(false)}>Abbrechen</Button>
                        <Button variant="destructive" onClick={() => {
                            setShowConverstionAlert(false);
                            console.log('Es ist eine Konvertierung notwendig. Trotzdem fortfahren?', { selectedItem, modelInput });
                            triggerSolving(undefined, true);
                        }}>{t('proceed_button')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showNoModelTypeAlert} onOpenChange={setShowNoModelTypeAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('no_model_dialog_title')}</DialogTitle>
                        <DialogDescription>
                            {t('no_model_dialog_description')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => {
                            setShowNoModelTypeAlert(false);
                            console.log('Du musst einen Modelltypen auswählen! (in der Eingabebox oben rechts)', { selectedItem, modelInput });
                        }}>{t('proceed_button')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    )
}