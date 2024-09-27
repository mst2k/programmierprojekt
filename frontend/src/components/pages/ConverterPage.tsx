import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CodeArea from "@/components/ui/custom/CodeArea.tsx";
import { LP } from "@/interfaces/glpkJavil/LP.tsx";
import { convertToGMPL, parseGMPL } from "@/hooks/converters/GMPLConverter.tsx";
import { convertToLP, parseLP } from "@/hooks/converters/LPConverter.tsx";
import { convertToMPS, parseMPS } from "@/hooks/converters/MPSConverter.tsx";
import { parseGLPMAdvanced } from "@/hooks/converters/GLPKConverter.tsx";

import GuidedTour from "@/components/ui/custom/GuidedTour";
import { Step } from 'react-joyride';

const convertOptions = [
    {name: "glpkInterface",
        from: (code:string):LP => {return JSON.parse(code)},
        to: (lpObject:LP):string => {return JSON.stringify(lpObject, null, 2)}},
    {name: "gmpl", from: parseGMPL, to: convertToGMPL},
    {name: "lp", from: parseLP, to: convertToLP},
    {name: "mps", from: parseMPS, to: convertToMPS},
    {name: "gmpl(Advanced)", from: parseGLPMAdvanced, to: convertToGMPL}
];

const CodeExecutionPage: React.FC = () => {
    const { t } = useTranslation();
    const [code, setCode] = useState<string>('');
    const [from, setOptionFrom] = useState<string>('');
    const [to, setOptionTo] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [runTour, setRunTour] = useState(true);

    const handleExecute = async () => {
        if (from === to) {
            setOutput(code)
            return
        }
        let lpObject: LP | Promise<LP> | undefined = undefined;

        const fromFunction = convertOptions.find(c => c.name === from) ?? undefined;
        if (fromFunction) {
            lpObject = await fromFunction.from(code);
        }
        const toFunction = convertOptions.find(c => c.name === to) ?? undefined;
        if (toFunction) {
            if (lpObject) {
                setOutput(toFunction.to(lpObject as LP));
            } else
                throw t('converterPage.noValidLpObject');
        }
    };

    const steps: Step[] = [
        {
            target: '.joyride-converter-input',
            content: 'Here you can input your problem to convert between different formats.',
        },
        {
            target: '.joyride-converter-output',
            content: 'The converted problem will be displayed here.',
        },
    ];

    return (
        <div className="flex flex-col h-screen w-screen p-10">
            <GuidedTour 
                steps={steps}
                run={runTour}
                setRun={setRunTour} 
            />
            <div className="mb-4">
                <h1 className="text-xl font-bold mb-2 ">{t('converterPage.title')}</h1>   
                <div className="joyride-converter-input">
                    <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-40 p-4 border rounded-md mb-4"
                        placeholder={t('converterPage.codePlaceholder')}
                    />
                </div>
                <div className="flex space-x-10 mb-4">
                    <Select onValueChange={(e) => setOptionFrom(e)}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder={t('converterPage.from')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('converterPage.from')}</SelectLabel>
                                {convertOptions.map((converter, index) => (
                                    <SelectItem key={index} value={converter.name}>{converter.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={to} onValueChange={(e) => setOptionTo(e)}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder={t('converterPage.to')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('converterPage.to')}</SelectLabel>
                                {convertOptions.map((converter, index) => (
                                    <SelectItem key={index} value={converter.name}>{converter.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleExecute} className="mb-4" variant="default">
                    {t('converterPage.execute')}
                </Button>
            </div>
            <div>
                <div className='joyride-converter-output'>
                    <CodeArea data={output} />
                </div>
            </div>
        </div>
    );
};

export default CodeExecutionPage;