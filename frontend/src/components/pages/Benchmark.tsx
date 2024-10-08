import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import useBenchmark from "@/hooks/benchmark/benchmark.tsx"

type ProblemFormats = "GMPL" | "LP"

type SolverResult = {
    executionTime: number;
    durationSolving: number;
}

type BenchmarkResult = {
    "glpkHgourvest": SolverResult;
    "glpkJavil": SolverResult;
    "highs": SolverResult;
    "glpk(Backend)": SolverResult;
    "highs(Backend)": SolverResult;
}

export default function BenchmarkComponent() {
    const [file, setFile] = useState<File | null>(null)
    const [format, setFormat] = useState<ProblemFormats>("GMPL")
    const [logData, setLogData] = useState<string>("")
    const [loadedResults, setLoadedResults] = useState<BenchmarkResult | null>(null)
    const {runBenchmark, benchmarkResults} = useBenchmark()
    const loadResultsInputRef = useRef<HTMLInputElement | null>(null)

    function bmLog(newLog: string) {
        setLogData(prevLog => `${prevLog}\n${newLog}`)
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0]
        if (uploadedFile) {
            setFile(uploadedFile)
        }
    }

    const handleRunBenchmark = async () => {
        if (file) {
            setLogData("")
            setLoadedResults(null)
            const fileContent = await file.text()
            await runBenchmark(fileContent, format, bmLog)
        }
    }

    const formatData = (data: BenchmarkResult) => {
        return Object.entries(data).map(([name, result]) => ({
            name,
            executionTime: result.executionTime,
            durationSolving: result.durationSolving
        }))
    }

    const exportResults = () => {
        if (benchmarkResults) {
            const blob = new Blob([JSON.stringify(benchmarkResults, null, 2)], {type: "application/json"})
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = "benchmark_results.json"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }
    }

    const loadResults = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const importedResults = JSON.parse(e.target?.result as string)
                    setLoadedResults(importedResults)
                    bmLog("Loaded previous benchmark results successfully.")
                } catch (error) {
                    console.error("Error parsing imported file:", error)
                    bmLog("Error loading results. Please ensure the file is a valid JSON.")
                }
            }
            reader.readAsText(file)
        }
    }

    return (
        <div className="flex flex-col h-screen w-screen p-10">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Benchmark Tool</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".txt,.lp,.mod"
                        />
                    </div>
                    <RadioGroup value={format} onValueChange={(value) => setFormat(value as ProblemFormats)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="GMPL" id="gmpl" />
                            <Label htmlFor="gmpl">GMPL</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="LP" id="lp" />
                            <Label htmlFor="lp">LP</Label>
                        </div>
                    </RadioGroup>
                    <div className="flex space-x-2">
                        <Button onClick={handleRunBenchmark} disabled={!file}>
                            Run Benchmark
                        </Button>
                        <Button onClick={exportResults} disabled={!benchmarkResults}>
                            Export Results
                        </Button>
                        <Button onClick={() => loadResultsInputRef.current?.click()}>
                            Load Previous Results
                        </Button>
                        <Input
                            type="file"
                            ref={loadResultsInputRef}
                            className="hidden"
                            onChange={loadResults}
                            accept=".json"
                        />
                    </div>
                    {(benchmarkResults || loadedResults) && (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={formatData(loadedResults || benchmarkResults)}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="executionTime" fill="#8884d8" name="Total Execution Time" />
                                    <Bar dataKey="durationSolving" fill="#82ca9d" name="Solving Duration" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                        <pre className="whitespace-pre-wrap">{logData}</pre>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}