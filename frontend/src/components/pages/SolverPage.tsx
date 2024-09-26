// import { useTranslation } from "react-i18next";

import BasicModelInput from "@/components/ui/general/basicModelInput.tsx";
import {useEffect, useState} from "react";
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";
import ResultComponent from "@/components/ui/general/displayRestult.tsx";
import Sidebar from "@/components/ui/custom/sidebar.tsx";
import EasyModelInput from "@/components/ui/general/easyModelInput.tsx";

import GuidedTour from "@/components/ui/custom/GuidedTour";
import { Step } from 'react-joyride';

export const inputModes: string[] = [
    "general",
    "easy",
    "transport"
]

const SolverPage = () => {
    // const {t} = useTranslation();
    const [currentSolver, setCurrentSolver] = useState<Solvers>("GLPKHgourvest");
    const [currentLpFormat, setCurrentLpFormat] = useState<ProblemFormats>("GMPL")
    const [currentProblem, setCurrentProblem] = useState<string>("");
    const [currentInputVariant, setCurrentInputVariant] = useState<string>("general");
    const [solveTrigger, setSolveTrigger] = useState<number>(0);
    const [resultComponent, setResultComponent] = useState(<></>)
    const [inputComponent, setInputComponent] = useState(<></>)
    const [runTour, setRunTour] = useState(true);
    
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

    const steps: Step[] = [
        {
            target: '.joyride-solver-input',
            content: 'Here you can input your problem in various formats.',
        },
        {
            target: '.joyride-solver-result',
            content: 'The results of your solved problem will appear here.',
        },
        // {
        //     target: '.joyride-converter',
        //     content: "Let's move to the Converter Page to convert between different formats.",
        // },
    ];

    return (
        <div className="flex min-h-screen w-full">
            <GuidedTour 
                steps={steps}
                run={runTour}
                setRun={setRunTour} 
            />
            <Sidebar
                currentInputVariant={currentInputVariant}
                setCurrentInputVariant={setCurrentInputVariant}
                currentSolver={currentSolver}
                setCurrentSolver={setCurrentSolver}
                currentProblem={currentProblem}
                currentLpFormat={currentLpFormat}/>
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-4 overflow-auto">
                    <div className="min-h-[50%] border-b-2 border-gray-300 p-4 joyride-solver-input">
                        {inputComponent}
                    </div>
                    <div className="min-h-[50%] p-4 joyride-solver-result">
                        {resultComponent}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SolverPage;