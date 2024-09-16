import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {ChevronDown, ChevronUp, Loader2} from "lucide-react"
import useSolver from "@/hooks/solvers/useSolver.tsx";
import {Button} from "@/components/ui/button.tsx";

// Definieren Sie diese Typen entsprechend Ihrer tatsächlichen Implementierung
type ProblemFormats = string // Ersetzen Sie dies durch den tatsächlichen Typ
type Solvers = string // Ersetzen Sie dies durch den tatsächlichen Typ

interface GLPKSolverProps {
    lpProblem: string
    problemType: ProblemFormats
    lpSolver: Solvers
}
export default function GLPKSolverComponent({ lpProblem, problemType, lpSolver }: GLPKSolverProps) {
    const { result, isLoading, error, log } = useSolver(lpProblem, problemType, lpSolver)
    const [activeTab, setActiveTab] = useState("columns")
    const [isExpanded, setIsExpanded] = useState(true)

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <Card className="w-full max-w-4xl mx-auto bg-red-50">
                <CardHeader>
                    <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error.message}</p>
                </CardContent>
            </Card>
        )
    }

    if (!result) {
        return null
    }

    const statusColors = {
        Optimal: "bg-green-500",
        Infeasible: "bg-red-500",
        Unbounded: "bg-yellow-500",
        Error: "bg-red-500",
        Unknown: "bg-gray-500"
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">GLPK Solver Result</CardTitle>
                <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-white text-sm ${statusColors[result.Status]}`}>
                        {result.Status}
                      </span>
                </div>
            </CardHeader>
                <CardContent>
                    {result.Status === 'Optimal' && (
                        <p className="text-lg font-semibold mb-4">Objective Value: {result.ObjectiveValue}</p>
                    )}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="columns">Columns</TabsTrigger>
                            <TabsTrigger value="rows">Rows</TabsTrigger>
                            <TabsTrigger value="json">JSON</TabsTrigger>
                            <TabsTrigger value="logs">Logs</TabsTrigger>
                            <TabsTrigger value="output">Output</TabsTrigger>
                        </TabsList>
                        <TabsContent value="columns">
                            <ScrollArea className="h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Lower</TableHead>
                                            <TableHead>Upper</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Primal</TableHead>
                                            <TableHead>Dual</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(result.Columns).map(([name, data]) => (
                                            <TableRow key={name}>
                                                <TableCell>{name}</TableCell>
                                                <TableCell>{data.Status}</TableCell>
                                                <TableCell>{data.Lower}</TableCell>
                                                <TableCell>{data.Upper}</TableCell>
                                                <TableCell>{data.Type}</TableCell>
                                                <TableCell>{data.Primal}</TableCell>
                                                <TableCell>{data.Dual}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="rows">
                            <ScrollArea className="h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Lower</TableHead>
                                            <TableHead>Upper</TableHead>
                                            <TableHead>Primal</TableHead>
                                            <TableHead>Dual</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {result.Rows.map((row) => (
                                            <TableRow key={row.Index}>
                                                <TableCell>{row.Name}</TableCell>
                                                <TableCell>{row.Status}</TableCell>
                                                <TableCell>{row.Lower}</TableCell>
                                                <TableCell>{row.Upper}</TableCell>
                                                <TableCell>{row.Primal}</TableCell>
                                                <TableCell>{row.Dual}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="json">
                            <ScrollArea className="h-[400px] w-full border rounded-md p-4">
                                <pre>{JSON.stringify(result, null, 2)}</pre>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="logs">
                            <ScrollArea className="h-[400px] w-full border rounded-md p-4">
                                <pre>{log}</pre>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="output">
                            <ScrollArea className="h-[400px] w-full border rounded-md p-4">
                                <pre>{result.Output}</pre>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>
        </Card>
    )
}