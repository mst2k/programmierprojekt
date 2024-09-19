"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import useBenchmark from "@/hooks/benchmark/benchmark.tsx";

type ProblemFormats = "GMPL" | "LP"

type BenchmarkResult = {
    "glpkHgourvest": number
    "glpkJavil": number
    "highs": number
    "glpk(Backend)": number
    "highs(Backend)": number
}

export default function BenchmarkComponent() {
    const [file, setFile] = useState<File | null>(null)
    const [format, setFormat] = useState<ProblemFormats>("GMPL")
    const [result, setResult] = useState<BenchmarkResult | null>(null)
    const {runBenchmark, benchmarkResults}  =useBenchmark()

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0]
        if (uploadedFile) {
            setFile(uploadedFile)
        }
    }

    const handleRunBenchmark = async () => {
        if (file) {
            const fileContent = await file.text()
            await runBenchmark(fileContent, format)
        }
    }

    const formatData = (data: BenchmarkResult) => {
        return Object.entries(data).map(([name, value]) => ({ name, value }))
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
                <Button onClick={handleRunBenchmark} disabled={!file}>
                    Run Benchmark
                </Button>
                {benchmarkResults && (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={formatData(benchmarkResults)}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
        </div>
    )
}