import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ProblemFormats, Solvers } from "@/interfaces/SolverConstants.tsx";
import { ProblemEditor } from '../custom/ProblemEditor/ProblemEditor'

type Item = {
    id: number;
    content: ProblemFormats;
    status: 'nativ' | 'conversion' | 'unsupported';
    description: string;
}

export default function EnhancedStatusSelect(states: any) {
    const {
        currentSolver,
        setCurrentLpFormat,
        setCurrentProblem,
        solveTrigger,
        setSolveTrigger
    }: {
        currentSolver: Solvers;
        setCurrentSolver: (solver: Solvers) => void;
        currentLpFormat: ProblemFormats;
        setCurrentLpFormat: (format: ProblemFormats) => void;
        currentProblem: string;
        setCurrentProblem: (problem: string) => void;
        solveTrigger: number,
        setSolveTrigger: (problem: number) => void
    } = states.states;

    const [selectedItem, setSelectedItem] = useState<Item | null>({ id: 1, content: "GMPL", status: "nativ", description: "Description GMPL" })
    const [modelInput, setModelInput] = useState('')
    const [showConverstionAlert, setShowConverstionAlert] = useState(false)
    const [showNoModelTypeAlert, setShowNoModelTypeAlert] = useState(false)
    const [gmplState, setGmplState] = useState<Item["status"]>("unsupported");
    const [lpState, setLpState] = useState<Item["status"]>("unsupported");
    const [mpsState, setMpsState] = useState<Item["status"]>("unsupported");

    useEffect(() => {
        console.log(selectedItem);
    }, [selectedItem])

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

    const items: Item[] = [
        { id: 1, content: 'GMPL', status: gmplState, description: 'Description GMPL' },
        { id: 2, content: 'LP', status: lpState, description: 'Description LP' },
        { id: 3, content: 'MPS', status: mpsState, description: 'Description MPS' },
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
                return 'Native';
            case 'conversion':
                return 'Conversion';
            case 'unsupported':
                return 'Unsupported';
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

    function triggerSolving(_: any, solveAnyway?: boolean) {
        if (solveAnyway != undefined || selectedItem && selectedItem.status !== 'nativ') {
            setShowConverstionAlert(true);
        } else {
            if (selectedItem?.content) {
                setCurrentLpFormat(selectedItem.content);
                setCurrentProblem(modelInput);
                setSolveTrigger(solveTrigger + 1);
            } else {
                setShowNoModelTypeAlert(true);
            }
        }
    }

    return (
        <TooltipProvider>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl p-0 flex flex-col space-y-0 h-[60vh]">
                    <Tabs 
                        value={selectedItem?.id.toString() || "1"}
                        onValueChange={(value) => setSelectedItem(items.find(item => item.id === parseInt(value)) || null)}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-3 rounded-b-none bg-background">
                            {items.map((item) => (
                                <TabsTrigger 
                                    key={item.id} 
                                    value={item.id.toString()}
                                    className="relative data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
                                >
                                    {item.content}
                                    <span className={`absolute top-0 right-0 mt-1 mr-1 px-1 text-xs rounded-full text-white ${getStatusColor(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                    <div className="relative flex-grow border border-t-0 rounded-b-lg">
                        <ProblemEditor
                            problemFormat={selectedItem?.content || 'GMPL'}
                            value={modelInput}
                            onChange={(value: React.SetStateAction<string>) => setModelInput(value)}
                        />
                        {selectedItem && (
                            <Tooltip>
                                <TooltipTrigger className="absolute top-2 right-6 p-1 text-muted-foreground hover:text-foreground">
                                    <InfoIcon className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{selectedItem.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button onClick={triggerSolving}>Abschicken</Button>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={showConverstionAlert} onOpenChange={setShowConverstionAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Achtung</DialogTitle>
                        <DialogDescription>
                            Es ist eine Konvertierung notwendig. Trotzdem fortfahren?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConverstionAlert(false)}>Abbrechen</Button>
                        <Button variant="destructive" onClick={() => {
                            setShowConverstionAlert(false);
                            console.log('Es ist eine Konvertierung notwendig. Trotzdem fortfahren?', { selectedItem, modelInput });
                        }}>Fortfahren</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showNoModelTypeAlert} onOpenChange={setShowNoModelTypeAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Achtung</DialogTitle>
                        <DialogDescription>
                            Du musst einen Modelltypen auswählen! (in der Eingabebox oben rechts)
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => {
                            setShowNoModelTypeAlert(false);
                            console.log('Du musst einen Modelltypen auswählen! (in der Eingabebox oben rechts)', { selectedItem, modelInput });
                        }}>Fortfahren</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    )
}