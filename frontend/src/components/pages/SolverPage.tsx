import { useTranslation } from "react-i18next";


import { NavigationMenuDemo } from "../ui/navbar";
import BasicModelInput from "@/components/ui/general/basicModelInput.tsx";
import {useEffect, useState} from "react";
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";
import TESTCallSolver from "@/components/ui/general/TESTCallSolver.tsx";

const SolverPage = () => {
    const {t} = useTranslation();
    const [currentSolver, setCurrentSolver] = useState<Solvers>("GLPKHgourvest");
    const [currentLpFormat, setCurrentLpFormat] = useState<ProblemFormats>("GMPL")
    const [currentProblem, setCurrentProblem] = useState<string>("");
    const [solveTrigger, setSolveTrigger] = useState<number>(0);
    const [resultComponent, setResultComponent] = useState(<></>)
    const allStates =  {  currentSolver, setCurrentSolver,
                            currentLpFormat, setCurrentLpFormat,
                            currentProblem, setCurrentProblem,
                            solveTrigger, setSolveTrigger}


    useEffect(() => {
        if(currentSolver && currentLpFormat && currentProblem != "")
            setResultComponent(<TESTCallSolver lpProblem={currentProblem} problemType={currentLpFormat} lpSolver={currentSolver}></TESTCallSolver>);
    }, [solveTrigger]);

    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="flex flex-1">
                <aside className="w-1/4 bg-gray-200 p-4">
                    <ul>
                        <li>{t('general')}</li>
                        <li>{t('simplex')}</li>
                        <li>{t('otherProbs')}</li>
                        <li>{t('toggleSolver')}</li>
                    </ul>
                </aside>
                <main className="flex-1 p-4">
                    <div className="h-min-1/2 border-b-2 border-gray-300 p-4">
                        <BasicModelInput states={allStates}></BasicModelInput>
                    </div>

                    <div className="h-1/2 p-4">
                        {resultComponent}
                    </div>
                </main>
            </div>

            <footer className="bg-gray-800 text-white p-4 text-center">
                Footer (About Page z.B.)
            </footer>
        </div>


    );
};

export default SolverPage;