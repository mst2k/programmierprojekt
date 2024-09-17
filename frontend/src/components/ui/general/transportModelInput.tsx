'use client'

import React, { useState } from 'react'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";

export default function TransportationProblemUI(states:any) {
    const [plants, setPlants] = useState([{ name: '', capacity: '' }])
    const [markets, setMarkets] = useState([{ name: '', demand: '' }])
    const [distances, setDistances] = useState([[]])
    const [freightCost, setFreightCost] = useState('')

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

    const addPlant = () => setPlants([...plants, { name: '', capacity: '' }])
    const addMarket = () => {
        setMarkets([...markets, { name: '', demand: '' }])
        setDistances(plants.map((plant, i) => [...(distances[i] || []), '']))
    }

    const removePlant = (index: number) => {
        const newPlants = plants.filter((_, i) => i !== index)
        const newDistances = distances.filter((_, i) => i !== index)
        setPlants(newPlants)
        setDistances(newDistances)
    }

    const removeMarket = (index: number) => {
        const newMarkets = markets.filter((_, i) => i !== index)
        const newDistances = distances.map(row => row.filter((_, i) => i !== index))
        setMarkets(newMarkets)
        setDistances(newDistances)
    }

    const updatePlant = (index: number, key: 'name' | 'capacity', value: string) => {
        const newPlants = [...plants]
        newPlants[index][key] = value
        setPlants(newPlants)
    }

    const updateMarket = (index: number, key: 'name' | 'demand', value: string) => {
        const newMarkets = [...markets]
        newMarkets[index][key] = value
        setMarkets(newMarkets)
    }

    const updateDistance = (plantIndex: number, marketIndex: number, value: string) => {
        const newDistances = [...distances]
        newDistances[plantIndex] = newDistances[plantIndex] || []
        newDistances[plantIndex][marketIndex] = value
        setDistances(newDistances)
    }

    function triggerSolving(gmpl) {
        setCurrentLpFormat("GMPL");
        setCurrentProblem(gmpl);
        setSolveTrigger(solveTrigger + 1);
    }


    const generateGMPL = (plants, markets, distances, freightCost) => {
        let gmplCode = `
# A TRANSPORTATION PROBLEM
#
# This problem finds a least cost shipping schedule that meets
# requirements at markets and supplies at factories.
#
#  References:
#              Dantzig G B, "Linear Programming and Extensions."
#              Princeton University Press, Princeton, New Jersey, 1963,
#              Chapter 3-3.

set I;
/* canning plants */

set J;
/* markets */

param a{i in I};
/* capacity of plant i in cases */

param b{j in J};
/* demand at market j in cases */

param d{i in I, j in J};
/* distance in thousands of miles */

param f;
/* freight in dollars per case per thousand miles */

param c{i in I, j in J} := f * d[i,j] / 1000;
/* transport cost in thousands of dollars per case */

var x{i in I, j in J} >= 0;
/* shipment quantities in cases */

minimize cost: sum{i in I, j in J} c[i,j] * x[i,j];
/* total transportation costs in thousands of dollars */

s.t. supply{i in I}: sum{j in J} x[i,j] <= a[i];
/* observe supply limit at plant i */

s.t. demand{j in J}: sum{i in I} x[i,j] >= b[j];
/* satisfy demand at market j */



solve;

# Report / Result Section (Optional)
printf '#################################\\n';
printf 'Transportation Problem / LP Model Result\\n';
printf '\\n';
printf 'Minimum Cost = %.2f\\n', cost;
printf '\\n';

printf '\\n';
printf 'Variables  (i.e. shipment quantities in cases ) \\n';

printf 'Shipment quantities in cases\\n';
printf 'Canning Plants  Markets   Solution (Cases) \\n';
printf{i in I, j in J}:'%14s %10s %11s\\n',i,j, x[i,j];
printf '\\n';

printf 'Constraints\\n';
printf '\\n';
printf 'Observe supply limit at plant i\\n';
printf 'Canning Plants Solution Sign  Required\\n';
for {i in I} {
 printf '%14s %10.2f <= %.3f\\n', i, sum {j in J} x[i,j], a[i];
   }

printf '\\n';
printf 'Satisfy demand at market j\\n';
printf 'Market Solution Sign  Required\\n';
for {j in J} {
 printf '%5s %10.2f >= %.3f\\n', j, sum {i in I} x[i,j], b[j];
   }
   
data;\n`;


        // Generate sets
        gmplCode += `set I := ${plants.map(p => p.name).join(' ')};\n\n`;
        gmplCode += `set J := ${markets.map(m => m.name).join(' ')};\n\n`;

        // Generate plant capacities
        gmplCode += 'param a :=\n';
        plants.forEach(plant => {
            gmplCode += `           ${plant.name.padEnd(10)} ${plant.capacity}\n`;
        });
        gmplCode += ';\n\n';

        // Generate market demands
        gmplCode += 'param b :=\n';
        markets.forEach(market => {
            gmplCode += `           ${market.name.padEnd(10)} ${market.demand}\n`;
        });
        gmplCode += ';\n\n';

        // Generate distances
        gmplCode += 'param d :';
        markets.forEach(market => {
            gmplCode += `${market.name.padStart(12)}`;
        });
        gmplCode += ' :=\n';
        plants.forEach((plant, i) => {
            gmplCode += `           ${plant.name.padEnd(10)}`;
            distances[i].forEach(distance => {
                gmplCode += `${distance.padStart(12)}`;
            });
            gmplCode += '\n';
        });
        gmplCode += ';\n\n';

        // Generate freight cost
        gmplCode += `param f := ${freightCost};\n`;

        triggerSolving(gmplCode);
        return gmplCode
    };

    const handleGenerateGMPL = () => {
        const gmplCode = generateGMPL(plants, markets, distances, freightCost);
        console.log(gmplCode)
        // Here you could set the generated code to state, display it in a modal, or download it as a file
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Transportation Problem Input</h1>

    <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">Canning Plants</h2>
    {plants.map((plant, index) => (
        <div key={index} className="flex items-center mb-2">
    <Input
        value={plant.name}
        onChange={(e) => updatePlant(index, 'name', e.target.value)}
        placeholder="Plant name"
        className="mr-2"
        />
        <Input
            type="number"
        value={plant.capacity}
        onChange={(e) => updatePlant(index, 'capacity', e.target.value)}
        placeholder="Capacity"
        className="mr-2"
        />
        <Button onClick={() => removePlant(index)} size="icon" variant="ghost">
    <MinusCircle className="h-4 w-4" />
        </Button>
        </div>
    ))}
    <Button onClick={addPlant} className="mt-2">
    <PlusCircle className="mr-2 h-4 w-4" /> Add Plant
    </Button>
    </div>

    <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">Markets</h2>
    {markets.map((market, index) => (
        <div key={index} className="flex items-center mb-2">
    <Input
        value={market.name}
        onChange={(e) => updateMarket(index, 'name', e.target.value)}
        placeholder="Market name"
        className="mr-2"
        />
        <Input
            type="number"
        value={market.demand}
        onChange={(e) => updateMarket(index, 'demand', e.target.value)}
        placeholder="Demand"
        className="mr-2"
        />
        <Button onClick={() => removeMarket(index)} size="icon" variant="ghost">
    <MinusCircle className="h-4 w-4" />
        </Button>
        </div>
    ))}
    <Button onClick={addMarket} className="mt-2">
    <PlusCircle className="mr-2 h-4 w-4" /> Add Market
    </Button>
    </div>

    <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">Distances (in thousands of miles)</h2>
    <Table>
    <TableHeader>
        <TableRow>
            <TableHead>Plant \ Market</TableHead>
    {markets.map((market, index) => (
        <TableHead key={index}>{market.name}</TableHead>
    ))}
    </TableRow>
    </TableHeader>
    <TableBody>
    {plants.map((plant, plantIndex) => (
            <TableRow key={plantIndex}>
                <TableCell>{plant.name}</TableCell>
    {markets.map((_, marketIndex) => (
        <TableCell key={marketIndex}>
        <Input
            type="number"
        value={distances[plantIndex]?.[marketIndex] || ''}
        onChange={(e) => updateDistance(plantIndex, marketIndex, e.target.value)}
        placeholder="Distance"
            />
            </TableCell>
    ))}
    </TableRow>
))}
    </TableBody>
    </Table>
    </div>

    <div className="mb-6">
    <Label htmlFor="freightCost">Freight Cost (dollars per case per thousand miles)</Label>
    <Input
    id="freightCost"
    type="number"
    value={freightCost}
    onChange={(e) => setFreightCost(e.target.value)}
    placeholder="Freight cost"
        />
        </div>
            <Button onClick={handleGenerateGMPL}>Generate GMPL</Button>
    </div>
)
}