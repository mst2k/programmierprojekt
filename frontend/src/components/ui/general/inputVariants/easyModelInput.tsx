import { useState, useEffect, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Trash2, Plus } from 'lucide-react'
import { ProblemFormats } from "@/interfaces/SolverConstants.tsx"
import { useTranslation } from 'react-i18next'
import AdvancedShareButton from "@/components/ui/custom/shareFunction.tsx";
import { clearUrlParams } from "@/hooks/urlBuilder.tsx";
import { capitalize } from "@/lib/utils.ts";
import {StatePersistence} from "@/components/ui/custom/keepState.tsx";

type VariableType = 'continuous' | 'integer' | 'binary';

interface VariableInfo {
    name: string;
    type: VariableType;
    nonNegative: boolean;
}

export default function EnhancedStatusSelect(states: any) {
    const { t } = useTranslation();
    const {
        setCurrentLpFormat,
        setCurrentProblem,
        solveTrigger,
        setSolveTrigger,
        setCurrentInputVariant
    } = states.states;

    const [, setCurrentFormat] = useState<ProblemFormats>('LP')
    const [optimizationType, setOptimizationType] = useState<'maximize' | 'minimize'>('maximize');
    const [objectiveFunction, setObjectiveFunction] = useState('');
    const [restrictions, setRestrictions] = useState<string[]>(['']);
    const [bounds, setBounds] = useState<string[]>(['']);
    const [variables, setVariables] = useState<VariableInfo[]>([]);

    useEffect(() => {
        setCurrentLpFormat('LP');
        setCurrentFormat('LP');
    }, []);

    const updateOptimizationType = (value: 'maximize' | 'minimize') => {
        setOptimizationType(value);
    };

    const updateObjectiveFunction = (value: string) => {
        setObjectiveFunction(value);
        updateVariables();
    };

    const addRestriction = () => {
        setRestrictions(prev => [...prev, '']);
    };

    const updateRestriction = (index: number, value: string) => {
        setRestrictions(prev => prev.map((r, i) => i === index ? value : r));
        updateVariables();
    };

    const removeRestriction = (index: number) => {
        setRestrictions(prev => prev.filter((_, i) => i !== index));
    };

    const addBound = () => {
        setBounds(prev => [...prev, '']);
    };

    const updateBound = (index: number, value: string) => {
        setBounds(prev => prev.map((b, i) => i === index ? value : b));
        updateVariables();
    };

    const removeBound = (index: number) => {
        setBounds(prev => prev.filter((_, i) => i !== index));
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>, type: 'restriction' | 'bound', index: number) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (type === 'restriction') {
                if (index === restrictions.length - 1) {
                    addRestriction();
                }
                const nextInput = document.getElementById(`restriction-${index + 1}`);
                nextInput?.focus();
            } else if (type === 'bound') {
                if (index === bounds.length - 1) {
                    addBound();
                }
                const nextInput = document.getElementById(`bound-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const extractVariables = (): string[] => {
        const objectiveVars = objectiveFunction.match(/[a-zA-Z_]\w*/g) || [];
        const restrictionVars = restrictions.flatMap(restriction => restriction.match(/[a-zA-Z_]\w*/g) || []);
        const boundVars = bounds.flatMap(bound => bound.match(/[a-zA-Z_]\w*/g) || []);
        return Array.from(new Set([...objectiveVars, ...restrictionVars, ...boundVars]));
    };

    const updateVariables = () => {
        const extractedVars = extractVariables();
        setVariables(prev => {
            const newVars = extractedVars.filter(v => !prev.some(pv => pv.name === v));
            const existingVars = prev.filter(v => extractedVars.includes(v.name));
            return [...existingVars, ...newVars.map(v => ({ name: v, type: 'continuous' as VariableType, nonNegative: true }))];
        });
    };

    const updateVariableType = (varName: string, type: VariableType) => {
        setVariables(prev => prev.map(v => v.name === varName ? { ...v, type } : v));
    };

    const toggleNonNegative = (varName: string) => {
        setVariables(prev => prev.map(v => v.name === varName ? { ...v, nonNegative: !v.nonNegative } : v));
    };

    function triggerSolving() {
        let problem = `${capitalize(optimizationType)}\n`;
        problem += ` obj: ${objectiveFunction}\n`;
        problem += "Subject To\n";
        restrictions.forEach((restriction, index) => {
            problem += ` c${index + 1}: ${restriction}\n`;
        });
        problem += "Bounds\n";
        bounds.forEach((bound) => {
            problem += `${bound}\n`;
        });
        variables.forEach(variable => {
            if (variable.nonNegative && !bounds.some(bound => bound.includes(variable.name))) {
                problem += ` ${variable.name} >= 0\n`;
            }
        });
        problem += "General\n";
        variables.filter(v => v.type === 'integer').forEach(v => {
            problem += ` ${v.name}\n`;
        });
        problem += "Binary\n";
        variables.filter(v => v.type === 'binary').forEach(v => {
            problem += ` ${v.name}\n`;
        });
        problem += "End";

        setCurrentProblem(problem);
        setCurrentLpFormat("LP")
        console.log("Problem:\n", problem);
        setSolveTrigger(solveTrigger + 1);
    }

    const handleParametersLoaded = (loadedParams: { [key: string]: string }) => {
        console.log('Geladene Parameter:', loadedParams);
        if (loadedParams.currentPage) {
            if (loadedParams.currentPage === "easy") {
                if (loadedParams.optimizationType) {
                    setOptimizationType(loadedParams.optimizationType as 'maximize' | 'minimize');
                }
                if (loadedParams.objectiveFunction) {
                    setObjectiveFunction(loadedParams.objectiveFunction);
                }
                if (loadedParams.restrictions) {
                    setRestrictions(JSON.parse(loadedParams.restrictions));
                }
                if (loadedParams.bounds) {
                    setBounds(JSON.parse(loadedParams.bounds));
                }
                if (loadedParams.variables) {
                    setVariables(JSON.parse(loadedParams.variables));
                }
                clearUrlParams()
            } else {
                setCurrentInputVariant(loadedParams.currentPage);
            }
        }
    };

    const handleSaveState = () => {
        return {
            restrictions: JSON.stringify(restrictions),
            bounds: JSON.stringify(bounds),
            variables: JSON.stringify(variables),
            optimizationType: optimizationType,
            objectiveFunction: objectiveFunction,
            currentPage: "easy"
        };
    };

    const handleRestoreState = (state: { [key: string]: string }) => {
        if (state.variables) {
            setVariables(JSON.parse(state.variables));
        }
        if (state.bounds) {
            setBounds(JSON.parse(state.bounds));
        }
        if (state.restrictions) {
            setRestrictions(JSON.parse(state.restrictions));
        }
        if (state.optimizationType) {
            setOptimizationType(state.optimizationType as "maximize" | "minimize");
        }
        if (state.objectiveFunction) {
            setObjectiveFunction(state.objectiveFunction);
        }

    };

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
                placeholder={t('enterOFunc')}
                value={objectiveFunction}
                onChange={(e) => updateObjectiveFunction(e.target.value)}
            />
            <h3 className="font-bold mb-2">{t("rest")}</h3>
            {restrictions.map((restriction, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <Input
                        id={`restriction-${index}`}
                        placeholder={t('Res') + `${index + 1}`}
                        value={restriction}
                        onChange={(e) => updateRestriction(index, e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, 'restriction', index)}
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
                        id={`bound-${index}`}
                        placeholder={t('easyInput.bound') + `${index + 1}`}
                        value={bound}
                        onChange={(e) => updateBound(index, e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, 'bound', index)}
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
            <h3 className="font-bold mb-2">{t("easyInput.Variables")}</h3>
            <div className="space-y-2">
                {variables.map(variable => (
                    <div key={variable.name} className="flex items-center space-x-2">
                        <div className="w-24 overflow-hidden text-ellipsis">{variable.name}</div>
                        <Select value={variable.type} onValueChange={(value: VariableType) => updateVariableType(variable.name, value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="continuous">{t('easyInput.Continuous')}</SelectItem>
                                <SelectItem value="integer">{t('easyInput.Integer')}</SelectItem>
                                <SelectItem value="binary">{t('easyInput.Binary')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`nonNegative-${variable.name}`}
                                checked={variable.nonNegative}
                                onChange={() => toggleNonNegative(variable.name)}
                                className="h-4 w-4"
                            />
                            <label htmlFor={`nonNegative-${variable.name}`}>{t("easyInput.Non-negative")}</label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex items-center justify-center joyride-solver-sidebar-modi-easy">
            <div className="w-full max-w-4xl p-0 flex flex-col space-y-4">
                <div className="relative pt-8">
                    {renderTabContent()}
                </div>
                <div className="flex justify-end">
                    <Button onClick={triggerSolving}>{t('solve')}</Button>
                    <AdvancedShareButton
                        parameters={{
                            optimizationType: optimizationType,
                            objectiveFunction: objectiveFunction,
                            restrictions: JSON.stringify(restrictions),
                            bounds: JSON.stringify(bounds),
                            variables: JSON.stringify(variables),
                            currentPage: "easy"
                        }}
                        onParametersLoaded={handleParametersLoaded}
                    />
                    <StatePersistence
                        pageIdentifier="knapsack"
                        onSave={handleSaveState}
                        onRestore={handleRestoreState}
                    />
                </div>
            </div>
        </div>
    )
}