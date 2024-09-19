import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRightFromLine } from "lucide-react"
import { useTranslation } from "react-i18next"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/general/seperator.tsx";
import {inputModes} from "@/components/pages/SolverPage.tsx";
import {Solvers} from "@/interfaces/SolverConstants.tsx";

interface SidebarProps {
    currentInputVariant: string;
    setCurrentInputVariant: (variant: string) => void;
    currentSolver: Solvers | null;
    setCurrentSolver: (solver: Solvers) => void;
}

type SolverTypes = {
    id: number;
    content: Solvers;
    description: string;
}

export default function Sidebar( { currentInputVariant, setCurrentInputVariant, currentSolver, setCurrentSolver }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true)
    const {t} = useTranslation();

    const toggleSidebar = () => setIsOpen(!isOpen)


    const solverTypes:SolverTypes[]=[
        { id: 1, content: 'GLPKHgourvest',  description: 'Description GLPKHgourvest' },
        { id: 2, content: 'GLPKJavil',  description: 'Description GLPKJavil' },
        { id: 3, content: 'Highs', description: 'Description Highs' },
    ]

    const handleSolverChange = (value: Solvers) => {
        setCurrentSolver(value)
    }

    return (
        <div className="flex h-screen">
            <div
                className={`bg-background border-r transition-all duration-300 flex flex-col ${
                    isOpen ? "w-64" : "w-16"
                }`}
            >
                <div className="flex justify-between items-center p-2 border-b">
                    {isOpen && (
                        <h2 className="text-lg font-semibold">{t('settings')}</h2>
                    )}
                    <Button
                        variant="ghost"
                        onClick={toggleSidebar}
                        className=" top-20 z-20 transition-all duration-300 bg-stone-50 hover:bg-stone-50"
                    >
                        {isOpen ? <X className=" h-4 w-4 text-black"/> : <ArrowRightFromLine className="h-4 w-4 text-black"/>}
                    </Button>
                </div>
                {isOpen && (
                    <>
                        <div className="space-y-2 p-2">
                            <h2 className="text-lg font-semibold">{t('mode')}</h2>
                            <Separator className="my-2 mx-auto h-[1%]"/>
                        </div>
                        <div className="flex flex-col space-y-2 p-4">
                            {inputModes.map((itype) => (
                                <Button
                                    variant={currentInputVariant === itype ? "default" : "outline"}
                                    onClick={() => setCurrentInputVariant(itype)}
                                    className="justify-start"
                                >
                                    {t(itype)}
                                </Button>
                            ))}
                        </div>
                        <div className="space-y-2 p-2">
                            <h2 className="text-lg font-semibold">{t('solver')}</h2>
                            <Separator className="my-2 mx-auto h-[1%]"/>
                        </div>

                        <div className="flex flex-col space-y-2 p-4">
                            <Select onValueChange={handleSolverChange} value={currentSolver || undefined}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('solvertype')} />
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
                    </>
                )}
            </div>
        </div>
    )
}