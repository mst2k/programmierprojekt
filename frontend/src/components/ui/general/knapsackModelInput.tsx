import { useState } from 'react'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProblemFormats, Solvers } from "@/interfaces/SolverConstants"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { ProblemEditor } from "@/components/ui/custom/ProblemEditor/ProblemEditor"
import AdvancedShareButton from "@/components/ui/custom/shareFunction.tsx";
import {clearUrlParams} from "@/hooks/urlBuilder.tsx";

export default function KnapsackProblemUI(states: any) {
    const gmplInit = `
# A KNAPSACK PROBLEM
#
# This problem finds the most valuable combination of items
# that can be carried in a knapsack of limited capacity.

set ITEMS;

param weight{i in ITEMS};
param value{i in ITEMS};
param capacity;

var take{i in ITEMS} binary;

maximize total_value: sum{i in ITEMS} value[i] * take[i];

s.t. weight_limit: sum{i in ITEMS} weight[i] * take[i] <= capacity;

solve;

printf "Knapsack Problem Solution\\n";
printf "-------------------------\\n";
printf "Total value: %g\\n", total_value;
printf "Items to take:\\n";
for {i in ITEMS: take[i] > 0.5} {
  printf "%s\\n", i;
}

data;
`

    const { t } = useTranslation()
    const [items, setItems] = useState([{ name: '', weight: '', value: '' }])
    const [capacity, setCapacity] = useState('')
    const [gmplCodeState, setGmplCode] = useState(gmplInit)
    const [isGmplDialogOpen, setIsGmplDialogOpen] = useState(false)

    const {
        setCurrentLpFormat,
        setCurrentProblem,
        solveTrigger,
        setSolveTrigger,
        setCurrentInputVariant
    }: {
        currentSolver: Solvers;
        setCurrentLpFormat: (format: ProblemFormats) => void;
        setCurrentProblem: (problem: string) => void;
        solveTrigger: number,
        setSolveTrigger: (problem: number) => void;
        setCurrentInputVariant: (variant: string) => void
    } = states.states;

    const addItem = () => setItems([...items, { name: '', weight: '', value: '' }])

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        setItems(newItems)
    }

    const updateItem = (index: number, key: 'name' | 'weight' | 'value', value: string) => {
        const newItems = [...items]
        newItems[index][key] = value
        setItems(newItems)
    }

    function triggerSolving(gmpl: string) {
        setCurrentLpFormat("GMPL");
        setCurrentProblem(gmpl);
        setSolveTrigger(solveTrigger + 1);
    }

    const generateGMPL = (items: { name: string; weight: string; value: string; }[], capacity: string) => {
        let gmplCode = gmplInit;

        gmplCode += `\nset ITEMS := ${items.map(item => item.name).join(' ')};\n\n`;

        gmplCode += 'param weight :=\n';
        items.forEach(item => {
            gmplCode += `  ${item.name} ${item.weight}\n`;
        });
        gmplCode += ';\n\n';

        gmplCode += 'param value :=\n';
        items.forEach(item => {
            gmplCode += `  ${item.name} ${item.value}\n`;
        });
        gmplCode += ';\n\n';

        gmplCode += `param capacity := ${capacity};\n\n`;

        gmplCode += 'end;\n';

        return gmplCode;
    };

    const handleGenerateGMPL = () => {
        const generatedCode = generateGMPL(items, capacity);
        setGmplCode(generatedCode);
        triggerSolving(gmplCodeState)
        setIsGmplDialogOpen(true);
    };

    const handleEditGMPL = (newCode: string) => {
        setGmplCode(newCode);
    };

    const handleSaveGMPL = () => {
        setIsGmplDialogOpen(false);
        triggerSolving(gmplCodeState);
    };

    const handleParametersLoaded = (loadedParams: { [key: string]: string }) => {
        console.log('Geladene Parameter:', loadedParams);
        if (loadedParams.currentPage) {
            if (loadedParams.currentPage === "knapsack") {
                if (loadedParams.items) {
                    setItems(JSON.parse(loadedParams.items));
                }
                if (loadedParams.capacity) {
                    setCapacity(loadedParams.capacity);
                }
                clearUrlParams()
            } else {
                setCurrentInputVariant(loadedParams.currentPage)
            }
        }
    };


    return (
        <div className="p-4 max-w-4xl mx-auto h-auto">
            <h1 className="text-2xl font-bold mb-4">{t('knapsackInput.title')}</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t('knapsackInput.items')}</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('knapsackInput.itemName')}</TableHead>
                            <TableHead>{t('knapsackInput.weight')}</TableHead>
                            <TableHead>{t('knapsackInput.value')}</TableHead>
                            <TableHead>{t('knapsackInput.action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Input
                                        value={item.name}
                                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                                        placeholder={t('knapsackInput.itemName')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={item.weight}
                                        onChange={(e) => updateItem(index, 'weight', e.target.value)}
                                        placeholder={t('knapsackInput.weight')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={item.value}
                                        onChange={(e) => updateItem(index, 'value', e.target.value)}
                                        placeholder={t('knapsackInput.value')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => removeItem(index)} size="icon" variant="ghost">
                                        <MinusCircle className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={addItem} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('knapsackInput.addItem')}
                </Button>
            </div>

            <div className="mb-6">
                <Label htmlFor="capacity">{t('knapsackInput.capacity')}</Label>
                <Input
                    id="capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder={t('knapsackInput.capacity')}
                />
            </div>
            <div className="flex flex-row items-center space-x-2 w-full mb-2">
                <Button className="" onClick={handleGenerateGMPL}>{t('knapsackInput.generateGMPL')}</Button>
                <Button className="ml-2" onClick={() => {setIsGmplDialogOpen(true)}}>{t('knapsackInput.showGMPL')}</Button>
                <AdvancedShareButton
                    parameters={{
                        items: JSON.stringify(items),
                        capacity: capacity,
                        currentPage:"knapsack"
                    }}
                    onParametersLoaded={handleParametersLoaded}
                />
            </div>
            <Dialog open={isGmplDialogOpen} onOpenChange={setIsGmplDialogOpen}>
                <DialogContent className="h-auto">
                    <DialogHeader>
                        <DialogTitle>{t('knapsackInput.editGMPL')}</DialogTitle>
                    </DialogHeader>
                    <div className="relative flex-grow border border-t-0 rounded-b-lg h-[400px]">
                        <ProblemEditor
                            problemFormat={'GMPL'}
                            value={gmplCodeState}
                            onChange={(value: string) => handleEditGMPL(value)}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                        <Button onClick={handleSaveGMPL}>{t('knapsackInput.generateGMPL')}</Button>
                        <Button onClick={() => setIsGmplDialogOpen(false)} variant="outline">
                            {t('knapsackInput.closeGMPL')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}