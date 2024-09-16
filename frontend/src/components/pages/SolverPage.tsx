import { useTranslation } from "react-i18next";

import BasicModelInput from "@/components/ui/general/basicModelInput.tsx";
import {useEffect, useState} from "react";
import {ProblemFormats, Solvers} from "@/interfaces/SolverConstants.tsx";
import TESTCallSolver from "@/components/ui/general/displayRestult.tsx";
import { NavigationMenuDemo } from "../ui/navbar";
import  CollapsableSidebar from "@/components/ui/custom/sidebar";

const SolverPage = () => {
    const {t} = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="flex flex-1">
            <div className="flex-1 relative">
                <CollapsableSidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            </div>
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