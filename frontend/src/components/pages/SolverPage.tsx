// import { useTranslation } from "react-i18next";

import BasicModelInput from "@/components/ui/general/basicModelInput.tsx";
import {useEffect, useState} from "react";
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";
import ResultComponent from "@/components/ui/general/displayRestult.tsx";
import Sidebar from "@/components/ui/custom/sidebar.tsx";
import EasyModelInput from "@/components/ui/general/easyModelInput.tsx"

export const inputModes:string[] = [
    "general",
    "easy",
    "transport"
]

const SolverPage = () => {
    // const {t} = useTranslation();
    const [currentSolver, setCurrentSolver] = useState<Solvers | null>(null);
    const [currentLpFormat, setCurrentLpFormat] = useState<ProblemFormats>("GMPL")
    const [currentProblem, setCurrentProblem] = useState<string>("");
    const [currentInputVariant, setCurrentInputVariant] = useState<string>("general");
    const [solveTrigger, setSolveTrigger] = useState<number>(0);
    const [resultComponent, setResultComponent] = useState(<></>)
    const [inputComponent, setInputComponent] = useState(<></>)
    const allStates =  {  
        currentSolver, setCurrentSolver,
        currentLpFormat, setCurrentLpFormat,
        currentProblem, setCurrentProblem,
        currentInputVariant, setCurrentInputVariant,
        solveTrigger, setSolveTrigger}


    useEffect(() => {
        if(currentSolver && currentLpFormat && currentProblem != "")
            setResultComponent(<ResultComponent  lpProblem={currentProblem} problemType={currentLpFormat} lpSolver={currentSolver}></ResultComponent >);
    }, [solveTrigger]);

    useEffect(() => {
        if(currentInputVariant === 'general') setInputComponent(<BasicModelInput states={allStates}></BasicModelInput>);
        else if(currentInputVariant === 'easy') setInputComponent(<EasyModelInput states={allStates}></EasyModelInput>);
        else setInputComponent(<p>CURRENTLY NOT SUPPORTED</p>)
    }, [currentInputVariant, currentSolver, solveTrigger]);



    useEffect(() => {
        console.log("current Solver:", currentSolver);
    }, [currentSolver]);

    return (
        <div className="flex h-screen w-screen">
            <Sidebar
                currentInputVariant={currentInputVariant}
                setCurrentInputVariant={setCurrentInputVariant}
                currentSolver={currentSolver}
                setCurrentSolver={setCurrentSolver}
                currentProblem={currentProblem}
                currentLpFormat={currentLpFormat}/>
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-4 overflow-auto">
                    <div className="h-min-1/2 border-b-2 border-gray-300 p-4">
                        {inputComponent}
                    </div>
                    <div className="h-1/2 p-4">
                        {resultComponent}
                    </div>
                </main>
                <footer className="bg-gray-800 text-white p-4 text-center">
                    Footer (About Page z.B.)
                </footer>
            </div>
        </div>
    );
};

export default SolverPage;