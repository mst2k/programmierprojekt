import { useTranslation } from "react-i18next";
import React, { useState } from 'react';

import { NavigationMenuDemo } from "../ui/navbar";
import  CollapsableSidebar from "@/components/ui/custom/sidebar";

const SolverPage = () => {
    const {t} = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex flex-col h-screen w-screen">
            {/* <header className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}> */}
                <NavigationMenuDemo/>
            {/* </header> */}
            <div className="flex-1 relative">
                <CollapsableSidebar 
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                {/* <aside className="w-1/4 bg-gray-200 p-4">
                   <ul>
                        <li>{t('general')}</li>
                        <li>{t('simplex')}</li>
                        <li>{t('otherProbs')}</li>
                        <li>{t('toggleSolver')}</li>
                    </ul>
                </aside>  */}
           <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    <main className="p-4">
                        <div className="h-1/2 border-b-2 border-gray-300 p-4">
                            <h2 className="text-xl font-bold">{t('modelInput')}</h2>
                            <p>{t('differentLayout')}</p>
                        </div>
                        <div className="h-1/2 p-4">
                            <h2 className="text-xl font-bold">{t('displaySolution')}</h2>
                        </div>
                    </main>
                </div>
            </div>
            <footer className="bg-gray-800 text-white p-4 text-center">
                Footer (About Page z.B.)
            </footer>
        </div>
    );
};

export default SolverPage;