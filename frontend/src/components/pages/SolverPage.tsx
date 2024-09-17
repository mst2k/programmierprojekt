// import { useTranslation } from "react-i18next";

import BasicModelInput from "@/components/ui/general/basicModelInput.tsx";
import {useEffect, useState} from "react";
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";
import TESTCallSolver from "@/components/ui/general/displayRestult.tsx";
import Sidebar from "@/components/ui/custom/sidebar.tsx";
import EasyModelInput from "@/components/ui/general/easyModelInput.tsx"

const SolverPage = () => {
    // const {t} = useTranslation();
    const [currentSolver, setCurrentSolver] = useState<Solvers>("GLPKHgourvest");
    const [currentLpFormat, setCurrentLpFormat] = useState<ProblemFormats>("GMPL")
    const [currentProblem, setCurrentProblem] = useState<string>("");
    const [currentInputVariant, setCurrentInputVariant] = useState<"general" | "easy">("general");
    const [solveTrigger, setSolveTrigger] = useState<number>(0);
    const [resultComponent, setResultComponent] = useState(<></>)
    const allStates =  {  currentSolver, setCurrentSolver,
        currentLpFormat, setCurrentLpFormat,
        currentProblem, setCurrentProblem,
        currentInputVariant, setCurrentInputVariant,
        solveTrigger, setSolveTrigger}


    useEffect(() => {
        if(currentSolver && currentLpFormat && currentProblem != "")
            setResultComponent(<TESTCallSolver lpProblem={currentProblem} problemType={currentLpFormat} lpSolver={currentSolver}></TESTCallSolver>);
    }, [solveTrigger]);

    useEffect(() => {
        console.log('current Solver:', currentSolver);
        console.log('current language:', currentLpFormat);
    }, [currentSolver, currentLpFormat])

    const renderContent = () => {
        //inputVariant: easy
        if(currentInputVariant === "easy"){
            return (
                <>
                    <div className="h-min-1/2 border-b-2 border-gray-300 p-4">
                        <EasyModelInput states={allStates}></EasyModelInput>
                    </div>
                    <div className="h-1/2 p-4">
                        {resultComponent}
                    </div>
                </>
            );
        //inputVariant: general
        } else {
            return(
                <>
                    <div className="h-min-1/2 border-b-2 border-gray-300 p-4">
                        <BasicModelInput states={allStates}></BasicModelInput>
                    </div>
                    <div className="h-1/2 p-4">
                        {resultComponent}
                    </div>
                </>
            );
        }
    }

    return (
        <div className="flex h-screen w-screen">
            <Sidebar
                currentInputVariant={currentInputVariant}
                setCurrentInputVariant={setCurrentInputVariant}
                currentSolver={currentSolver}
                setCurrentSolver={setCurrentSolver}
            />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-4 overflow-auto">
                    {renderContent()}
                    {/* <div className="h-min-1/2 border-b-2 border-gray-300 p-4">
                        <BasicModelInput states={allStates}></BasicModelInput>
                    </div>
                    <div className="h-1/2 p-4">
                        {resultComponent}
                    </div> */}
                </main>
                <footer className="bg-gray-800 text-white p-4 text-center">
                    Footer (About Page z.B.)
                </footer>
            </div>
        </div>
    );
};

export default SolverPage;