
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
import { Input } from "@/components/ui/input"
import { InfoIcon, Trash2, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx"
import { useTranslation } from 'react-i18next'

type Item = {
    id: number;
    content: ProblemFormats;
    status: 'nativ' | 'conversion' | 'unsupported';
    description: string;
}

export default function EnhancedStatusSelect(states:any) {
    const { t } = useTranslation();
    const {
        currentSolver,
        setCurrentLpFormat,
        setCurrentProblem,
        solveTrigger,
        setSolveTrigger
    }: {
        currentSolver: Solvers; setCurrentSolver: (solver: Solvers) => void;
        currentLpFormat: ProblemFormats; setCurrentLpFormat: (format: ProblemFormats) => void;
        currentProblem: string; setCurrentProblem: (problem: string) => void;
        solveTrigger: number, setSolveTrigger: (problem:number) => void
    } = states.states;

    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [showConverstionAltert, setShowConverstionAltert] = useState(false)
    const [showNoModelTypeAltert, setShowNoModelTypeAltert] = useState(false)
    const [gmplState, setGmplState] = useState<Item["status"]>("unsupported");
    const [lpState, setLpState] = useState<Item["status"]>("unsupported");
    const [mpsState, setMpsState] = useState<Item["status"]>("unsupported");

    // const [activeTab, setActiveTab] = useState<'allgemein' | 'simplex' | 'andere'>('allgemein');
    const [optimizationType, setOptimizationType] = useState<'maximize' | 'minimize'>('maximize');
    const [objectiveFunction, setObjectiveFunction] = useState('');
    const [restrictions, setRestrictions] = useState<string[]>(['']);
    const [selectedVariables, setSelectedVariables] = useState<string[]>([]); // State for selected checkboxes


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

    const setSolverHighs = () => {
        setGmplState('conversion');
        setLpState('nativ');
        setMpsState('conversion');
    }
    const setSolverrGlpkJavil = () => {
        setGmplState('conversion');
        setLpState('conversion');
        setMpsState('conversion');
    }
    const setSolverrGlpkHgourvest = () => {
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

    const updateOptimizationType = (value: 'maximize' | 'minimize') => {
        setOptimizationType(value);
    };

    const updateObjectiveFunction = (value: string) => {
        setObjectiveFunction(value);
    };

    const addRestriction = () => {
        setRestrictions(prev => [...prev, '']);
    };

    const updateRestriction = (index: number, value: string) => {
        setRestrictions(prev => prev.map((r, i) => i === index ? value : r));
    };

    const removeRestriction = (index: number) => {
        setRestrictions(prev => prev.filter((_, i) => i !== index));
    };

    //extracts vars with regex, return var-list without duplicates
    const extractVariables = (): string[] => {
        const objectiveVars = objectiveFunction.match(/[a-zA-Z_]\w*/g) || [];
        const restrictionVars = restrictions.flatMap(restriction => restriction.match(/[a-zA-Z_]\w*/g) || []);
        return Array.from(new Set([...objectiveVars, ...restrictionVars])); // deletes duplicates
    };

    // includes all checked vars, updates dynamically
    const toggleVariableSelection = (variable: string) => {
        setSelectedVariables(prev => 
            prev.includes(variable)
                ? prev.filter(v => v !== variable)
                : [...prev, variable]
        );
    };

    function triggerSolving(_:any, solveAnyway?: boolean) {
        if (solveAnyway != undefined || selectedItem && selectedItem.status !== 'nativ') {
            setShowConverstionAltert(true);
        } else {
            if(selectedItem?.content){
                setCurrentLpFormat(selectedItem.content);
                const problem = `${optimizationType} ${objectiveFunction}\nsubject to\n${restrictions.join('\n')}`;
                setCurrentProblem(problem);
                setSolveTrigger(solveTrigger + 1);
            } else {
                setShowNoModelTypeAltert(true);
            }
        }
    }

    const renderTabContent = () => (
        <div className="space-y-4">
            <h3 className="font-bold mb-2">{t("orTyp")}</h3>
            <Select value={optimizationType} onValueChange={updateOptimizationType}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Optimierungstyp wählen" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="maximize">{t('Max')}</SelectItem>
                    <SelectItem value="minimize">{t('Min')}</SelectItem>
                </SelectContent>
            </Select>
            <h3 className="font-bold mb-2">{t('orFunction')}</h3>
            <Input 
                placeholder="Zielfunktion eingeben" 
                value={objectiveFunction}
                onChange={(e) => updateObjectiveFunction(e.target.value)}
            />
            <h3 className="font-bold mb-2">{t("rest")}</h3>
            {restrictions.map((restriction, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <Input
                        key={index}
                        placeholder={`Restriktion ${index + 1}`}
                        value={restriction}
                        onChange={(e) => updateRestriction(index, e.target.value)}
                    />
                    {restrictions.length > 1 && (
                        <Button onClick={() => removeRestriction(index)} variant="outline" className="p-1">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}
            <Button onClick={addRestriction} className="py-2 text-sm ml-auto block">
                <Plus className="h-4 w-4" />
            </Button>
            <h3 className="font-bold mb-2">{t("nnb")}</h3>
            <div className="space-y-2">
                {extractVariables().map(variable => (
                    <div key={variable} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={variable}
                            checked={selectedVariables.includes(variable)}
                            onChange={() => toggleVariableSelection(variable)}
                            className='h-4 w-4 bg-black'
                        />
                        <label htmlFor={variable}>{variable}</label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <TooltipProvider>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl p-0 flex flex-col space-y-4">
                    <div className="relative pt-8">
                        {/* <div className="flex flex-row space-x-1 mb-4">
                            {[
                                { id: 'allgemein', label: t('general') },
                                { id: 'simplex', label: t('simplex') },
                                { id: 'andere', label: t('otherProbs') }
                            ].map((tab) => (
                                <Button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as 'allgemein' | 'simplex' | 'andere')}
                                    variant={activeTab === tab.id ? 'default' : 'outline'}
                                    className="flex-1 py-1 text-sm justify-center"
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div> */}
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
                        {renderTabContent()}
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
                            console.log('Es ist eine Konvertierung notwendig. Trotzdem fortfahren?', { selectedItem, objectiveFunction, restrictions });
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
                            console.log('Du musst einen Modelltypen auswählen! (in der Eingabebox oben rechts)', { selectedItem, objectiveFunction, restrictions });
                        }}>Fortfahren</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    )
}