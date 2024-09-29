import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

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
    const {t} = useTranslation();
    const location = useLocation();

    const [currentSolver, setCurrentSolver] = useState<Solvers>("GLPKHgourvest");
    const [currentLpFormat, setCurrentLpFormat] = useState<ProblemFormats>("GMPL")
    const [currentProblem, setCurrentProblem] = useState<string>("");
    const [currentInputVariant, setCurrentInputVariant] = useState<string>("general");
    const [solveTrigger, setSolveTrigger] = useState<number>(0);
    const [resultComponent, setResultComponent] = useState(<></>)
    const [inputComponent, setInputComponent] = useState(<></>)
    const [runTour, setRunTour] = useState(false);
    
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

    useEffect(() => {
        //check whether fromWelcomeGuideTour is set (=> comes from WelcomePage via guideTour )
       if (location.state && location.state.fromWelcomeGuideTour) {
        setRunTour(true); 
    } else {
        setRunTour(false);
    }
    }, [location]);

    const steps: Step[] = [
        {
            target: '.joyride-solver-input',
            content: t('guidedTour.solverPage.input'),
        },
        {
            target: '.joyride-solver-result',
            content:  t('guidedTour.solverPage.result'),
        },
        {
            target: '.joyride-solv-conv',
            content:  t('guidedTour.solverPage.solv-conv'),
            placement: 'center'
        },
        {
            target: '.joyride-converter',
            content: '',
        },
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
                    <div className="min-h-[50%] border-b-2 border-gray-300 p-4">
                        <div className="joyride-solver-input">
                            <h2 className="text-lg font-semibold">{t('modelInput')}</h2>
                            {inputComponent}
                        </div>
                    </div>
                    <div className="min-h-[25%] p-4 joyride-solver-result">
                        <h2 className="text-lg font-semibold joyride-solv-conv">{t('displaySolution')}</h2>
                        {resultComponent}
                    </div>
                    <div className="joyride-converter"/>
                </main>
            </div>
        </div>
    );
};

export default SolverPage;