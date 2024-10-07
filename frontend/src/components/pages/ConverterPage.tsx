import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const [code, setCode] = useState<string>('');
    const [from, setOptionFrom] = useState<string>('');
    const [to, setOptionTo] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [runTour, setRunTour] = useState(false);

    useEffect(() => {
        const state = location.state as { fromSolverGuideTour?: boolean };
        //check whether fromSolverGuideTour is set (=> comes from SolverPage via guideTour )
        if (state && state.fromSolverGuideTour) {
            setRunTour(true);
        }
    }, [location]);

    const handleExecute = async () => {
        try {
            if (from === to) {
                setOutput(code);
                return;
            }

            let lpObject: LP | undefined = undefined;

            const fromFunction = convertOptions.find(c => c.name === from);
            const toFunction = convertOptions.find(c => c.name === to);

            if (!fromFunction || !toFunction) {
                throw new Error(t('converterPage.invalidConversionOption'));
            }

            try {
                lpObject = await Promise.resolve(fromFunction.from(code));
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${t('converterPage.parseError')}: ${error.message}`);
                } else {
                    throw new Error(t('converterPage.unknownParseError'));
                }
            }

            if (!lpObject) {
                throw new Error(t('converterPage.noValidLpObject'));
            }

            const result = toFunction.to(lpObject);
            setOutput(result);
        } catch (error) {
            if (error instanceof Error) {
                setOutput(`Error: ${error.message}`);
            } else {
                setOutput(t('converterPage.unknownError'));
            }
        }
    };

    const steps: Step[] = [
        {
            target: '.joyride-converter-input',
            content:  t('guidedTour.converterPage.input'), 
        },
        {
            target: '.joyride-converter-format',
            content: t('guidedTour.converterPage.format'),
        },
        {
            target: '.joyride-converter-exec',
            content: t('guidedTour.converterPage.exec'),
        },
        {
            target: '.joyride-converter-output',
            content: t('guidedTour.converterPage.output'),
        },
        {
            target: '.joyride-bye',
            content: (
                <React.Fragment>
                    {t('guidedTour.converterPage.last_pt1')}
                    <br />
                    <br />
                    {t('guidedTour.converterPage.last_pt2')}
                </React.Fragment>
            ),
            placement: 'center'
        },
        {
            target: '.joyride-last',
            content: '',
        }
    ];

    return (
        <div className="flex flex-col h-screen w-screen p-10">
            <GuidedTour 
                steps={steps}
                run={runTour}
                setRun={setRunTour} 
            />
            <main className="flex-grow">
                <div className="mb-4">
                    <h1 className="text-xl font-bold mb-2">{t('converterPage.title')}</h1>   
                    <div className="joyride-converter-input">
                        <Textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-40 p-4 border rounded-md mb-4"
                            placeholder={t('converterPage.codePlaceholder')}
                        />
                    </div>
                    <div className="flex mb-4">
                        <div className="inline-flex space-x-4 joyride-converter-format">
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
                    </div>
                    <Button onClick={handleExecute} className="mb-4 joyride-converter-exec" variant="default">
                        {t('converterPage.execute')}
                    </Button>
                </div>
                <CodeArea className="joyride-converter-output" data={output} />
                <div className='joyride-bye'/>
                <div className='joyride-last'/>
            </main>
        </div>
    );
};

export default CodeExecutionPage;