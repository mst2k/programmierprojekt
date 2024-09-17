'use client'

import React, { useState } from 'react'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProblemFormats, Solvers } from "@/interfaces/SolverConstants"

export default function WorkforceSchedulingUI(states: any) {
    const [employees, setEmployees] = useState([{ name: '', maxHours: '' }])
    const [shifts, setShifts] = useState([{ name: '', required: '' }])
    const [preferences, setPreferences] = useState([[]])

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

    const addEmployee = () => {
        setEmployees([...employees, { name: '', maxHours: '' }])
        setPreferences(preferences.map(row => [...row, '']))
    }

    const addShift = () => {
        setShifts([...shifts, { name: '', required: '' }])
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
        newPreferences[shiftIndex][employeeIndex] = value
        setPreferences(newPreferences)
    }

    function triggerSolving(gmpl: string) {
        setCurrentLpFormat("GMPL");
        setCurrentProblem(gmpl);
        setSolveTrigger(solveTrigger + 1);
    }

    const generateGMPL = (employees: { name: string; maxHours: string }[], shifts: { name: string; required: string }[], preferences: string[][]) => {
        let gmplCode = `
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

set EMPLOYEES := ${employees.map(e => e.name).join(' ')};
set SHIFTS := ${shifts.map(s => s.name).join(' ')};

param maxHours :=
${employees.map(e => `  ${e.name} ${e.maxHours}`).join('\n')};

param required :=
${shifts.map(s => `  ${s.name} ${s.required}`).join('\n')};

param preference :
${shifts.map(s => s.name).join(' ')} :=
${employees.map((e, i) => `  ${e.name} ${preferences.map(row => row[i]).join(' ')}`).join('\n')};

end;
`

        triggerSolving(gmplCode);
        return gmplCode
    };

    const handleGenerateGMPL = () => {
        const gmplCode = generateGMPL(employees, shifts, preferences);
        console.log(gmplCode)
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Workforce Scheduling Problem Input</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Employees</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee Name</TableHead>
                            <TableHead>Max Hours</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Input
                                        value={employee.name}
                                        onChange={(e) => updateEmployee(index, 'name', e.target.value)}
                                        placeholder="Employee name"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={employee.maxHours}
                                        onChange={(e) => updateEmployee(index, 'maxHours', e.target.value)}
                                        placeholder="Max hours"
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
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Shifts</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Shift Name</TableHead>
                            <TableHead>Required Employees</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shifts.map((shift, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Input
                                        value={shift.name}
                                        onChange={(e) => updateShift(index, 'name', e.target.value)}
                                        placeholder="Shift name"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={shift.required}
                                        onChange={(e) => updateShift(index, 'required', e.target.value)}
                                        placeholder="Required employees"
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
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Shift
                </Button>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Employee Preferences</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Shift \ Employee</TableHead>
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
                                            value={preferences[shiftIndex]?.[employeeIndex] || ''}
                                            onChange={(e) => updatePreference(shiftIndex, employeeIndex, e.target.value)}
                                            placeholder="Preference"
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Button onClick={handleGenerateGMPL}>Generate GMPL</Button>
        </div>
    )
}