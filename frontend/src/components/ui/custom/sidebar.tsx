import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRightFromLine, Menu } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/general/seperator"
import { inputModes } from "@/components/pages/SolverPage"
import { ProblemFormats, Solvers } from "@/interfaces/SolverConstants"
import { FileExport } from "@/components/ui/general/fileExport"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps {
    currentInputVariant: string
    setCurrentInputVariant: (variant: string) => void
    currentSolver: Solvers | null
    setCurrentSolver: (solver: Solvers) => void
    currentProblem: string
    currentLpFormat: ProblemFormats
}

type SolverTypes = {
    id: number
    content: Solvers
    description: string
}

export default function Sidebar({
                                    currentInputVariant,
                                    setCurrentInputVariant,
                                    currentSolver,
                                    setCurrentSolver,
                                    currentProblem,
                                    currentLpFormat,
                                }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true)
    const { t } = useTranslation()

    const toggleSidebar = () => setIsOpen(!isOpen)

    const solverTypes: SolverTypes[] = [
        { id: 1, content: 'GLPKHgourvest', description: 'Description GLPKHgourvest' },
        { id: 2, content: 'GLPKJavil', description: 'Description GLPKJavil' },
        { id: 3, content: 'Highs', description: 'Description Highs' },
    ]

    const handleSolverChange = (value: Solvers) => {
        setCurrentSolver(value)
    }

    const SidebarContent = () => (
        <>
            <div className="flex flex-col space-y-2 p-4">
                {inputModes.map((itype) => (
                    <Button
                        key={itype}
                        variant={currentInputVariant === itype ? "default" : "outline"}
                        onClick={() => setCurrentInputVariant(itype)}
                        className="justify-start"
                    >
                        {t(itype)}
                    </Button>
                ))}
            </div>
            <div className="space-y-2 p-2">
                <h2 className="text-lg font-semibold">{t('sidebar.solver')}</h2>
                <Separator className="my-2 mx-auto h-[1%]" />
            </div>
            <div className="flex flex-col space-y-2 p-4">
                <Select onValueChange={handleSolverChange} value={currentSolver || undefined}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('sidebar.solvertype')} />
                    </SelectTrigger>
                    <SelectContent>
                        {solverTypes.map((sTyp) => (
                            <SelectItem key={sTyp.id} value={sTyp.content}>
                                {sTyp.content}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 p-2">
                <h2 className="text-lg font-semibold">{t('sidebar.export')}</h2>
                <Separator className="my-2 mx-auto h-[1%]" />
            </div>
            <div className="flex flex-col space-y-2 p-4">
                <FileExport currentProblem={currentProblem} currentInputVariant={currentLpFormat}></FileExport>
            </div>
        </>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-screen">
                <div
                    className={`bg-background border-r transition-all duration-300 flex flex-col ${
                        isOpen ? "w-64" : "w-16"
                    }`}
                >
                    <div className="flex justify-between items-center p-2 border-b">
                        {isOpen && <h2 className="text-lg font-semibold">{t('sidebar.mode')}</h2>}
                        <Button
                            variant="ghost"
                            onClick={toggleSidebar}
                            className="top-20 z-20 transition-all duration-300 bg-stone-50 hover:bg-stone-50"
                        >
                            {isOpen ? <X className="h-4 w-4 text-black" /> : <ArrowRightFromLine className="h-4 w-4 text-black" />}
                        </Button>
                    </div>
                    {isOpen && <SidebarContent />}
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="absolute top-[4rem] left-2 z-40">
                            <ArrowRightFromLine className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <div className="py-4">
                            <h2 className="text-lg font-semibold mb-4">{t('sidebar.mode')}</h2>
                            <SidebarContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}