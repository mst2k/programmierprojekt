import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CodeArea from "@/components/ui/custom/CodeArea.tsx";
import {test} from "@/hooks/CallConverter.tsx"
import GLPK_TEST from "@/hooks/Callglpk.tsx";

const CodeExecutionPage: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [from, setOptionFrom] = useState<string>('');
    const [to, setOptionTo] = useState<string>('');
    const [output, setOutput] = useState<string>('');

    const handleExecute = () => {
        test()
        console.log("Not supported yet")
        console.log(from)
        console.log(to)
        setOutput("Not supported yet")

    };

    return (
        <div className="flex flex-col h-screen w-screen p-10">
            <div className="mb-4">
                <h1 className="text-xl font-bold mb-2">Code Execution Page</h1>
                <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-40 p-4 border rounded-md mb-4"
                    placeholder="Geben Sie hier Ihren Code ein..."
                />
                <div className="flex space-x-10 mb-4">

                    <Select onValueChange={(e) => setOptionFrom(e)}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Modus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="GMPL">GMPL</SelectItem>
                                <SelectItem value="Value2(TEST)">Value2(TEST)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={to} onValueChange={(e) => setOptionTo(e)}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Modus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="GLPKInterface">GLPK Interface</SelectItem>
                                <SelectItem value="Value2">Value2(TEST)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleExecute} className="mb-4" variant="default">
                    Ausführen
                </Button>
            </div>
            <div>
                <CodeArea data={output} />
            </div>
            <GLPK_TEST></GLPK_TEST>
        </div>
    );
};

export default CodeExecutionPage;
