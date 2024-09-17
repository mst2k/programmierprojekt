import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { InfoIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";

type Item = {
    id: number;
    content: ProblemFormats;
    status: 'nativ' | 'conversion' | 'unsupported';
    description: string;
}


export default function EnhancedStatusSelect(states:any) {
    const {
        currentSolver,
//        setCurrentSolver,
//        currentLpFormat,
        setCurrentLpFormat,
//        currentProblem,
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
        setSolveTrigger: (problem:number) => void
    } = states.states;


    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [modelInput, setmodelInput] = useState('')
    const [showConverstionAltert, setShowConverstionAltert] = useState(false)
    const [showNoModelTypeAltert, setShowNoModelTypeAltert] = useState(false)
    const [gmplState, setGmplState] = useState<Item["status"]>("unsupported");
    const [lpState, setLpState] = useState<Item["status"]>("unsupported");
    const [mpsState, setMpsState] = useState<Item["status"]>("unsupported");

    useEffect(() => {
        switch (currentSolver){
            case "Highs":
                setSolverHighs();
                break;
            case "GLPKJavil":
                setSolverrGlpkJavil();
                break;
            case "GLPKHgourvest":
                setSolverrGlpkHgourvest();
                break;
        }
    }, [currentSolver]);

    useEffect(() => {
        console.log("Selected language:", selectedItem ? selectedItem.content : "LP (default)");
    }, [selectedItem]);

    const items:Item[]=[
        { id: 1, content: 'GMPL', status: gmplState, description: 'Description GMPL' },
        { id: 2, content: 'LP', status: lpState, description: 'Description LP' },
        { id: 3, content: 'MPS', status: mpsState, description: 'Description MPS' },
    ]

    const setSolverHighs = () =>{
        setGmplState('conversion');
        setLpState('nativ');
        setMpsState('conversion');
    }
    const setSolverrGlpkJavil = () =>{
        setGmplState('conversion');
        setLpState('conversion');
        setMpsState('conversion');
    }

    const setSolverrGlpkHgourvest = () =>{
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

    function triggerSolving(_:any, solveAnyway?: boolean) {

        if (solveAnyway != undefined || selectedItem && selectedItem.status !== 'nativ') {
            setShowConverstionAltert(true);
        } else {
            if(selectedItem?.content){
                setCurrentLpFormat(selectedItem.content);
                setCurrentProblem(modelInput);
                setSolveTrigger(solveTrigger + 1);
            }else {
                setShowNoModelTypeAltert(true);
            }
        }
    }


    return (
        <TooltipProvider>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl p-0 flex flex-col space-y-4">
                    <div className="relative">
                        <Textarea
                            placeholder="Geben Sie hier Ihren Text ein"
                            value={modelInput}
                            onChange={(e) => setmodelInput(e.target.value)}
                            className="min-h-[200px] pr-24"
                        />
                        <div className="absolute top-2 right-2 flex items-center space-x-2">
                            {selectedItem && (
                                <Tooltip>
                                    <TooltipTrigger className="p-1">
                                        <InfoIcon className="h-4 w-4" />
                                        <span className="sr-only">Info</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{selectedItem.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            <Select onValueChange={(value) => setSelectedItem(items.find(item => item.id === parseInt(value)) || null)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Wählen" />
                                </SelectTrigger>
                                <SelectContent>
                                    {items.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()} className="flex justify-between items-center">
                                            <span>{item.content}</span>
                                            <span className={`ml-2 px-2 py-1 text-xs rounded-full text-white ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={triggerSolving}>Abschicken</Button>
                    </div>
                </div>
            </div>

            {/* Dialoge */}
            <Dialog open={showConverstionAltert} onOpenChange={setShowConverstionAltert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Achtung</DialogTitle>
                        <DialogDescription>
                            Es ist eine Konvertierung notwendig. Trotzdem fortfahren?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConverstionAltert(false)}>Abbrechen</Button>
                        <Button variant="destructive" onClick={() => {
                            setShowConverstionAltert(false);
                            console.log('Es ist eine Konvertierung notwendig. Trotzdem fortfahren?', { selectedItem, modelInput });
                        }}>Fortfahren</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showNoModelTypeAltert} onOpenChange={setShowNoModelTypeAltert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Achtung</DialogTitle>
                        <DialogDescription>
                            Du musst einen Modelltypen auswählen! (in der Eingabebox oben rechts)
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => {
                            setShowNoModelTypeAltert(false);
                            console.log('Du musst einen Modelltypen auswählen! (in der Eingabebox oben rechts)', { selectedItem, modelInput });
                        }}>Fortfahren</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>


    )
}