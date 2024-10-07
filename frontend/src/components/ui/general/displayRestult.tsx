import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import useSolver from "@/hooks/solvers/useSolver.tsx"
import { ProblemFormats, Solvers } from "@/interfaces/SolverConstants.tsx"
import { useTranslation } from 'react-i18next' // Assume using react-i18next

interface GLPKSolverProps {
    lpProblem: string
    problemType: ProblemFormats
    lpSolver: Solvers
}



/**
 * Result Component
 *
 * This component handles solving and displaying of a given problem in a given format. You also need to pass the
 * solver the component should use.
 *
 * The component triggers solving on EVERY RERENDER!!! (be careful) and returns the output of the solver
 * (result, constraints, variable values, logs)
 *
 * @component
 * @param {string} lpProblem  - Problem to Solve
 * @param {ProblemFormats} problemType - Problem Format
 * @param {Solvers} lpSolver - Solver to user
 *
 */
export default function ResultComponent({ lpProblem, problemType, lpSolver }: GLPKSolverProps) {
    const { t } = useTranslation() // Initialize translation function
    const { result, isLoading, error, log } = useSolver(lpProblem, problemType, lpSolver)
    const [activeTab, setActiveTab] = useState("columns")

    //Display loading animation while the solver is working
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    //Display the error if solving was successful
    if (error) {
        return (
            <Card className="w-full max-w-4xl mx-auto bg-red-50">
                <CardHeader>
                    <CardTitle className="text-red-600">{t('error_title')}</CardTitle>
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

    //Result if solved successful
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">{`${lpSolver} ${t('solver_result_title')}`}</CardTitle>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-white text-sm ${statusColors[result.Status]}`}>
                        {result.Status} in {result.Duration?.toFixed(3)} S
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                {result.Status === 'Optimal' && (
                    <p className="text-lg font-semibold mb-4">{t('objective_value')}: {result.ObjectiveValue}</p>
                )}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="columns">{t('tab_columns')}</TabsTrigger>
                        <TabsTrigger value="rows">{t('tab_rows')}</TabsTrigger>
                        <TabsTrigger value="json">{t('tab_json')}</TabsTrigger>
                        <TabsTrigger value="logs">{t('tab_logs')}</TabsTrigger>
                        <TabsTrigger value="output">{t('tab_output')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="columns">
                        <ScrollArea className="h-[400px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('column_name')}</TableHead>
                                        <TableHead>{t('column_status')}</TableHead>
                                        <TableHead>{t('column_lower')}</TableHead>
                                        <TableHead>{t('column_upper')}</TableHead>
                                        <TableHead>{t('column_type')}</TableHead>
                                        <TableHead>{t('column_primal')}</TableHead>
                                        <TableHead>{t('column_dual')}</TableHead>
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
                                        <TableHead>{t('column_name')}</TableHead>
                                        <TableHead>{t('column_status')}</TableHead>
                                        <TableHead>{t('column_lower')}</TableHead>
                                        <TableHead>{t('column_upper')}</TableHead>
                                        <TableHead>{t('column_primal')}</TableHead>
                                        <TableHead>{t('column_dual')}</TableHead>
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