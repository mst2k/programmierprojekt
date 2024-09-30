'use client'

import { useState } from 'react'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProblemFormats, Solvers } from "@/interfaces/SolverConstants"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { ProblemEditor } from "@/components/ui/custom/ProblemEditor/ProblemEditor"
import AdvancedShareButton from "@/components/ui/custom/shareFunction.tsx";
import {clearUrlParams} from "@/hooks/urlBuilder.tsx";

export default function WorkforceSchedulingUI(states: any) {
    const gmplInit = `
# WORKFORCE SCHEDULING PROBLEM
#
# This problem assigns employees to shifts while respecting
# maximum working hours and shift requirements.

set EMPLOYEES;
set SHIFTS;

param maxHours{e in EMPLOYEES};
param required{s in SHIFTS};
param preference{e in EMPLOYEES, s in SHIFTS};

var assign{e in EMPLOYEES, s in SHIFTS} binary;

maximize total_preference: sum{e in EMPLOYEES, s in SHIFTS} preference[e,s] * assign[e,s];

s.t. shift_requirement{s in SHIFTS}: sum{e in EMPLOYEES} assign[e,s] >= required[s];
s.t. max_hours{e in EMPLOYEES}: sum{s in SHIFTS} assign[e,s] <= maxHours[e];

solve;

printf "Workforce Scheduling Solution\\n";
printf "------------------------------\\n";
printf "Total preference score: %g\\n", total_preference;
printf "Assignments:\\n";
for {e in EMPLOYEES, s in SHIFTS: assign[e,s] > 0.5} {
  printf "%s assigned to %s\\n", e, s;
}

data;
`

    const { t } = useTranslation()
    const [employees, setEmployees] = useState([{ name: '', maxHours: '' }])
    const [shifts, setShifts] = useState([{ name: '', required: '' }])
    const [preferences, setPreferences] = useState([[]])
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

    const addEmployee = () => {
        setEmployees([...employees, { name: '', maxHours: '' }])
        // @ts-expect-error
        setPreferences(preferences.map(row => [...row, '']))
    }

    const addShift = () => {
        setShifts([...shifts, { name: '', required: '' }])
        // @ts-expect-error
        setPreferences([...preferences, new Array(employees.length).fill('')])
    }

    const removeEmployee = (index: number) => {
        const newEmployees = employees.filter((_, i) => i !== index)
        const newPreferences = preferences.map(row => row.filter((_, i) => i !== index))
        setEmployees(newEmployees)
        setPreferences(newPreferences)
    }

    const removeShift = (index: number) => {
        const newShifts = shifts.filter((_, i) => i !== index)
        const newPreferences = preferences.filter((_, i) => i !== index)
        setShifts(newShifts)
        setPreferences(newPreferences)
    }

    const updateEmployee = (index: number, key: 'name' | 'maxHours', value: string) => {
        const newEmployees = [...employees]
        newEmployees[index][key] = value
        setEmployees(newEmployees)
    }

    const updateShift = (index: number, key: 'name' | 'required', value: string) => {
        const newShifts = [...shifts]
        newShifts[index][key] = value
        setShifts(newShifts)
    }

    const updatePreference = (shiftIndex: number, employeeIndex: number, value: string) => {
        const newPreferences = [...preferences]
        // @ts-expect-error
        newPreferences[employeeIndex][shiftIndex] = value
        setPreferences(newPreferences)
    }

    function triggerSolving(gmpl: string) {
        setCurrentLpFormat("GMPL");
        setCurrentProblem(gmpl);
        setSolveTrigger(solveTrigger + 1);
    }

    const generateGMPL = (employees: { name: string; maxHours: string }[], shifts: { name: string; required: string }[], preferences: string[][]) => {
        let gmplCode = gmplInit;

        gmplCode += `\nset EMPLOYEES := ${employees.map(e => e.name).join(' ')};\n`;
        gmplCode += `set SHIFTS := ${shifts.map(s => s.name).join(' ')};\n\n`;

        gmplCode += 'param maxHours :=\n';
        employees.forEach(e => {
            gmplCode += `  ${e.name} ${e.maxHours}\n`;
        });
        gmplCode += ';\n\n';

        gmplCode += 'param required :=\n';
        shifts.forEach(s => {
            gmplCode += `  ${s.name} ${s.required}\n`;
        });
        gmplCode += ';\n\n';

        gmplCode += 'param preference :\n    ';
        gmplCode += shifts.map(e => e.name).join(' ');
        gmplCode += ' :=\n';
        employees.forEach((e, i) => {
            gmplCode += `  ${e.name} ${preferences[i].join(' ')}\n`;
        });
        gmplCode += ';\n\n';

        gmplCode += 'end;\n';
        setGmplCode(gmplCode)
        return gmplCode;
    };

    const handleGenerateGMPL = () => {
        const generatedCode = generateGMPL(employees, shifts, preferences);
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
            if (loadedParams.currentPage === "workforce") {
                if (loadedParams.employees) {
                    setEmployees(JSON.parse(loadedParams.employees));
                }
                if (loadedParams.shifts) {
                    setShifts(JSON.parse(loadedParams.shifts));
                }
                if (loadedParams.preferences) {
                    setPreferences(JSON.parse(loadedParams.preferences));
                }
                clearUrlParams()
            } else {
                setCurrentInputVariant(loadedParams.currentPage)
            }
        }
    };



    return (
        <div className="p-4 max-w-4xl mx-auto h-auto">
            <h1 className="text-2xl font-bold mb-4">{t('workforceInput.title')}</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t('workforceInput.employees')}</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('workforceInput.employeeName')}</TableHead>
                            <TableHead>{t('workforceInput.maxHours')}</TableHead>
                            <TableHead>{t('workforceInput.action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Input
                                        value={employee.name}
                                        onChange={(e) => updateEmployee(index, 'name', e.target.value)}
                                        placeholder={t('workforceInput.employeeName')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={employee.maxHours}
                                        onChange={(e) => updateEmployee(index, 'maxHours', e.target.value)}
                                        placeholder={t('workforceInput.maxHours')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => removeEmployee(index)} size="icon" variant="ghost">
                                        <MinusCircle className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={addEmployee} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('workforceInput.addEmployee')}
                </Button>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t('workforceInput.shifts')}</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('workforceInput.shiftName')}</TableHead>
                            <TableHead>{t('workforceInput.requiredEmployees')}</TableHead>
                            <TableHead>{t('workforceInput.action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shifts.map((shift, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Input
                                        value={shift.name}
                                        onChange={(e) => updateShift(index, 'name', e.target.value)}
                                        placeholder={t('workforceInput.shiftName')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={shift.required}
                                        onChange={(e) => updateShift(index, 'required', e.target.value)}
                                        placeholder={t('workforceInput.requiredEmployees')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => removeShift(index)} size="icon" variant="ghost">
                                        <MinusCircle className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={addShift} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('workforceInput.addShift')}
                </Button>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t('workforceInput.preferences')}</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('workforceInput.shiftEmployee')}</TableHead>
                            {employees.map((employee, index) => (
                                <TableHead key={index}>{employee.name}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shifts.map((shift, shiftIndex) => (
                            <TableRow key={shiftIndex}>
                                <TableCell>{shift.name}</TableCell>
                                {employees.map((_, employeeIndex) => (
                                    <TableCell key={employeeIndex}>
                                        <Input
                                            type="number"
                                            value={preferences[employeeIndex]?.[shiftIndex] || ''}
                                            onChange={(e) => updatePreference(shiftIndex, employeeIndex, e.target.value)}
                                            placeholder={t('workforceInput.preference')}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-row items-center space-x-2 w-full mb-2">
                <Button className="mb" onClick={handleGenerateGMPL}>{t('workforceInput.generateGMPL')}</Button>
                <Button className="ml-2" onClick={() => {setIsGmplDialogOpen(true)}}>{t('workforceInput.showGMPL')}</Button>
                <AdvancedShareButton
                    parameters={{
                        employees: JSON.stringify(employees),
                        shifts: JSON.stringify(shifts),
                        preferences: JSON.stringify(preferences),
                        currentPage:"workforce"
                    }}
                    onParametersLoaded={handleParametersLoaded}
                />

            </div>

            <Dialog open={isGmplDialogOpen} onOpenChange={setIsGmplDialogOpen}>
                <DialogContent className="h-auto">
                    <DialogHeader>
                        <DialogTitle>{t('workforceInput.editGMPL')}</DialogTitle>
                    </DialogHeader>
                    <div className="relative flex-grow border border-t-0 rounded-b-lg h-[400px]">
                        <ProblemEditor
                            problemFormat={'GMPL'}
                            value={gmplCodeState}
                            onChange={(value: string) => handleEditGMPL(value)}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                        <Button onClick={handleSaveGMPL}>{t('workforceInput.generateGMPL')}</Button>
                        <Button onClick={() => setIsGmplDialogOpen(false)} variant="outline">
                            {t('workforceInput.closeGMPL')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}