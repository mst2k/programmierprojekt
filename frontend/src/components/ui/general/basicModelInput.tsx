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


export default function EnhancedStatusSelect(states) {
    const {
        currentSolver,
        setCurrentSolver,
        currentLpFormat,
        setCurrentLpFormat,
        currentProblem,
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
    const [showAlert, setShowAlert] = useState(false)
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

    function triggerSolving(e, solveAnyway?: boolean) {
        if (solveAnyway != undefined || selectedItem && selectedItem.status !== 'nativ') {
            setShowAlert(true)
        } else {
            if(selectedItem?.content){
                setCurrentLpFormat(selectedItem.content)
                setCurrentProblem(modelInput)
                setSolveTrigger(solveTrigger + 1)
            }
        }
    }


    return (
        <TooltipProvider>
            <div className="p-0 flex flex-col space-y-4">
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
            <Dialog open={showAlert} onOpenChange={setShowAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Achtung</DialogTitle>
                        <DialogDescription>
                            Das ausgewählte Element ist nicht aktiv. Möchten Sie wirklich fortfahren?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAlert(false)}>Abbrechen</Button>
                        <Button variant="destructive" onClick={() => {
                            setShowAlert(false)
                            console.log('Fortgefahren trotz inaktivem Status:', { selectedItem, modelInput })
                        }}>Fortfahren</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>

    )
}