
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from 'lucide-react'
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog"
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx"
import { useTranslation } from 'react-i18next'

export default function EnhancedStatusSelect(states:any) {
    const { t } = useTranslation();
    const {
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

    const [currentFormat, setCurrentFormat] = useState<ProblemFormats>('LP')

    const [optimizationType, setOptimizationType] = useState<'maximize' | 'minimize'>('maximize');
    const [objectiveFunction, setObjectiveFunction] = useState('');
    const [restrictions, setRestrictions] = useState<string[]>(['']);
    const [bounds, setBounds] = useState<string[]>(['']);
    const [selectedVariables, setSelectedVariables] = useState<string[]>([]); // State for selected checkboxes

    useEffect(() => {
        // Set LP as the default format
        setCurrentLpFormat('LP');
        setCurrentFormat('LP');
        console.log("Selected language:", currentFormat);
    }, []);

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

    const addBound = () => {
        setBounds(prev => [...prev, '']);
    };

    const updateBound = (index: number, value: string) => {
        setBounds(prev => prev.map((b, i) => i === index ? value : b));
    };

    const removeBound = (index: number) => {
        setBounds(prev => prev.filter((_, i) => i !== index));
    };


    //extracts vars with regex, return var-list without duplicates
    const extractVariables = (): string[] => {
        const objectiveVars = objectiveFunction.match(/[a-zA-Z_]\w*/g) || [];
        const restrictionVars = restrictions.flatMap(restriction => restriction.match(/[a-zA-Z_]\w*/g) || []);
        const boundVars = bounds.flatMap(bound => bound.match(/[a-zA-Z_]\w*/g) || []);
        return Array.from(new Set([...objectiveVars, ...restrictionVars, ...boundVars])); // deletes duplicates
    };

    // includes all checked vars, updates dynamically
    const toggleVariableSelection = (variable: string) => {
        setSelectedVariables(prev => 
            prev.includes(variable)
                ? prev.filter(v => v !== variable)
                : [...prev, variable]
        );
    };

    function triggerSolving( ) {
        //format problem in LP
        let problem = `${optimizationType}\n`;
        problem += `obj: ${objectiveFunction}\n`;
        problem += "Subject To\n";
        restrictions.forEach((restriction, index) => {
            problem += `c${index + 1}: ${restriction}\n`;
        });
        problem += "Bounds\n";
        bounds.forEach((bound) => {
            problem += `${bound}\n`;
        });
        selectedVariables.forEach(variable => {
            if (!bounds.some(bound => bound.includes(variable))) {
                problem += ` ${variable} >= 0\n`;
            }
        });
        problem += "end";

        setCurrentProblem(problem);
        console.log("Problem:\n", problem);
        setSolveTrigger(solveTrigger + 1);
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
            <h3 className="font-bold mb-2">{t("bounds")}</h3>
            {bounds.map((bound, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <Input
                        key ={index}
                        placeholder={`Einschränkung ${index + 1}`} //z.B. 0 <= x1 <= 40
                        value={bound} 
                        onChange={(e) => updateBound(index, e.target.value)}
                    />
                    {bounds.length > 1 && (
                        <Button onClick={() => removeBound(index)} variant="outline" className="p-1">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}
            <Button onClick={addBound} className="py-2 text-sm ml-auto block">
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
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl p-0 flex flex-col space-y-4">
                    <div className="relative pt-8">
                        {renderTabContent()}
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={triggerSolving}>{t('send')}</Button>
                    </div>
                </div>
            </div>
    )
}