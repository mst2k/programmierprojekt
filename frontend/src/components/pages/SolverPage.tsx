import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import BasicModelInput from "@/components/ui/general/inputVariants/basicModelInput.tsx";
import {useEffect, useState} from "react";
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";
import ResultComponent from "@/components/ui/general/displayRestult.tsx";
import Sidebar from "@/components/ui/general/webBasic/sidebar.tsx";
import EasyModelInput from "@/components/ui/general/inputVariants/easyModelInput.tsx"
import TransportationProblemUI from "@/components/ui/general/inputVariants/transportModelInput.tsx";
import KnapsackProblemUI from "@/components/ui/general/inputVariants/knapsackModelInput.tsx";
import WorkforceSchedulingUI from "@/components/ui/general/inputVariants/workforceScheduleModelInput.tsx";

import GuidedTour from "@/components/ui/custom/GuidedTour";
import { Step } from 'react-joyride';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'

export const inputModes: string[] = [
    "general",
    "easy",
    "transport",
    "knapsack",
    "workforce"
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
        solveTrigger, setSolveTrigger,}


    useEffect(() => {
        if(currentSolver && currentLpFormat && currentProblem != "")
            setResultComponent(<ResultComponent  lpProblem={currentProblem} problemType={currentLpFormat} lpSolver={currentSolver}></ResultComponent >);
    }, [solveTrigger]);

    useEffect(() => {
        if(currentInputVariant === 'general') setInputComponent(<BasicModelInput states={allStates}></BasicModelInput>);
        else if(currentInputVariant === 'easy') setInputComponent(<EasyModelInput states={allStates}></EasyModelInput>);
        else if(currentInputVariant === 'transport') setInputComponent(<TransportationProblemUI states={allStates}></TransportationProblemUI>);
        else if(currentInputVariant === 'knapsack') setInputComponent(<KnapsackProblemUI states={allStates}></KnapsackProblemUI>);
        else if(currentInputVariant === 'workforce') setInputComponent(<WorkforceSchedulingUI states={allStates}></WorkforceSchedulingUI>);
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
            target:'.joyride-solver-sidebar',
            content: t('guidedTour.solverPage.sidebar'),
            placement: "right-start"
        },
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
        <TooltipProvider>
            <div className="flex min-h-screen w-full">
                <GuidedTour
                    steps={steps}
                    run={runTour}
                    setRun={setRunTour}
                />

                <aside className="joyride-solver-sidebar">
                    <Sidebar
                        currentInputVariant={currentInputVariant}
                        setCurrentInputVariant={setCurrentInputVariant}
                        currentSolver={currentSolver}
                        setCurrentSolver={setCurrentSolver}
                        currentProblem={currentProblem}
                        currentLpFormat={currentLpFormat}
                    />
                </aside>

                <main className="flex-1 flex flex-col p-4 overflow-auto">
                    <section className="h-auto border-b-2 border-gray-300 p-4">
                        <div className="joyride-solver-input">
                            <div className="flex justify-start items-center mb-4">
                                <h2 className="text-lg font-semibold">{t('modelInput')}</h2>
                                <Tooltip>
                                    <TooltipTrigger className="-top-1 -right-6 p-1 text-muted-foreground hover:text-foreground">
                                        <InfoIcon className="h-3 w-3" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs p-2 bg-gray-800 text-white rounded-md shadow-lg whitespace-pre-wrap">
                                        <p className="text-sm">{t('tooltip.solverPage.inputHeader')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            {inputComponent}
                        </div>
                    </section>

                    <section className="min-h-[25%] p-4 joyride-solver-result">
                        <h2 className="text-lg font-semibold joyride-solv-conv">{t('displaySolution')}</h2>
                        {resultComponent}
                    </section>

                    <section className="joyride-converter" />
                </main>
            </div>
        </TooltipProvider>
    );
};

export default SolverPage;