import {Import} from "lucide-react";
import {parseGMPL, } from "@/components/ConvertGMPLtoGLPKinterface.tsx";
import CodeArea from "@/components/ui/custom/CodeArea.tsx";

const SolverPage = () => {
    const GMPLModel :string = "/* decision variables*/\n" +
        "var x1 >= 0;\n" +
        "var x2 >=0;\n" +
        "/* Objective function */ maximize label : 4*x1 +5*x2; /* Constraints */\n" +
        "subject to label1: x1 + 2*x2 <= 40; s.t. label2: 4*x1 + 3*x2 <= 120;\n" +
        "end;"

    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="flex flex-1">
                <aside className="w-1/4 bg-gray-200 p-4">
                    <ul>
                        <li>General</li>
                        <li>Simplex</li>
                        <li>Andere Standard Probleme</li>
                        <li>Toggle Solver</li>
                    </ul>
                </aside>
                <main className="flex-1 p-4">
                    <div className="h-1/2 border-b-2 border-gray-300 p-4">
                        <h2 className="text-xl font-bold">Eingabe des Modells</h2>
                        <p>Unterschiedliche Layout je nach Problem</p>
                    </div>

                    <div className="h-1/2 p-4">
                        <h2 className="text-xl font-bold">Anzeige der Lösung / Erklärungen möglicher Fehler</h2>
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