'use client'

import React, { useState } from 'react'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProblemFormats, Solvers } from "@/interfaces/SolverConstants"

export default function KnapsackProblemUI(states: any) {
    const [items, setItems] = useState([{ name: '', weight: '', value: '' }])
    const [capacity, setCapacity] = useState('')

    const {
        currentSolver,
        setCurrentLpFormat,
        setCurrentProblem,
        solveTrigger,
        setSolveTrigger
    }: {
        currentSolver: Solvers;
        setCurrentLpFormat: (format: ProblemFormats) => void;
        setCurrentProblem: (problem: string) => void;
        solveTrigger: number,
        setSolveTrigger: (problem: number) => void
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
        let gmplCode = `
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

set ITEMS := ${items.map(item => item.name).join(' ')};

param weight :=
${items.map(item => `  ${item.name} ${item.weight}`).join('\n')};

param value :=
${items.map(item => `  ${item.name} ${item.value}`).join('\n')};

param capacity := ${capacity};

end;
`

        triggerSolving(gmplCode);
        return gmplCode
    };

    const handleGenerateGMPL = () => {
        const gmplCode = generateGMPL(items, capacity);
        console.log(gmplCode)
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Knapsack Problem Input</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Items</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Input
                                        value={item.name}
                                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                                        placeholder="Item name"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={item.weight}
                                        onChange={(e) => updateItem(index, 'weight', e.target.value)}
                                        placeholder="Weight"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={item.value}
                                        onChange={(e) => updateItem(index, 'value', e.target.value)}
                                        placeholder="Value"
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
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <div className="mb-6">
                <Label htmlFor="capacity">Knapsack Capacity</Label>
                <Input
                    id="capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Capacity"
                />
            </div>

            <Button onClick={handleGenerateGMPL}>Generate GMPL</Button>
        </div>
    )
}