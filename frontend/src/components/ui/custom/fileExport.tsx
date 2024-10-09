import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button.tsx"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.tsx"
import { ProblemFormats } from "@/interfaces/SolverConstants.tsx";
import {LP} from "@/interfaces/glpkJavil/LP.tsx";
import {convertToGMPL} from "@/hooks/converters/GMPLConverter.tsx";
import {convertToLP, parseLP} from "@/hooks/converters/LPConverter.tsx";
import {convertToMPS, parseMPS} from "@/hooks/converters/MPSConverter.tsx";
import {parseGLPMAdvanced} from "@/hooks/converters/GLPKConverter.tsx";


/**
 * FileExport Component
 *
 * This component provides a UI-Button for exporting mathematical programming problems
 * in various file formats (GMPL, LP, MPS). you have to pass the problem and the format. The Button handles
 * coversion internally
 *
 *
 * @component
 * @param {Object} props - The properties passed to the component
 * @param {string} props.currentProblem - The current problem in string format
 * @param {ProblemFormats} props.currentInputVariant - The current input format of the problem
 *
 * @example
 * <FileExport
 *   currentProblem="max: x + y; subject to: x + y <= 10;"
 *   currentInputVariant="LP"
 * />
 */
export function FileExport({ currentProblem, currentInputVariant }: { currentProblem: string, currentInputVariant: ProblemFormats }) {
    const { t } = useTranslation();

    /**
     * Handles the export of the problem to a specific file format.
     *
     * @async
     * @function
     * @param {ProblemFormats} fileType - The desired output file format
     * @throws {Error} Throws an error if the conversion is not possible or if there's no valid LP object
     */
    const handleExport = async (fileType: ProblemFormats) => {
        let outputString = currentProblem;
        if(currentInputVariant !== fileType) {
            try {
                const convertOptions = [
                    {name: "GMPL", from: parseGLPMAdvanced, to: convertToGMPL},
                    {name: "LP", from: parseLP, to: convertToLP},
                    {name: "MPS", from: parseMPS, to: convertToMPS},
                ]

                let lpObject: LP | Promise<LP> | undefined = undefined;
                const fromFunction = convertOptions.find(c => c.name === currentInputVariant) ?? undefined;
                if (fromFunction) {
                    lpObject = await fromFunction.from(currentProblem);
                }
                const toFunction = convertOptions.find(c => c.name === fileType) ?? undefined;
                if (toFunction) {
                    if (lpObject) {
                        outputString = toFunction.to(lpObject as LP);
                    } else
                        throw t('fileExport.noValidLpObject');
                }else{
                    throw t('fileExport.noValidFormat');
                }
            }catch (er){
                console.log(t('fileExport.conversionNotPossible'));
            }
        }
        let fileExtension;
        switch (fileType) {
            case 'GMPL':
                fileExtension = '.mod';
                break;
            case 'LP':
                fileExtension = '.lp';
                break;
            case 'MPS':
                fileExtension = '.mps';
                break;
            default:
                fileExtension = '.txt';
        }
        if (outputString !== ""){
            const fileName = `problem${fileExtension}`;
            const blob = new Blob([outputString], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }else{
            alert(t('fileExport.exportFailed'));
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">{t('fileExport.exportFiles')}</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t('fileExport.title')}</SheetTitle>
                    <SheetDescription>
                        {t('fileExport.description')}
                    </SheetDescription>
                </SheetHeader>
                <div style={{ padding: '20px' }}>
                    <div className="flex flex-col space-y-2 p-4">
                        <Button onClick={() => handleExport('GMPL')}>{t('fileExport.exportGMPL')}</Button>
                        <Button onClick={() => handleExport('LP')} style={{ marginTop: '10px' }}>{t('fileExport.exportLP')}</Button>
                        <Button onClick={() => handleExport('MPS')} style={{ marginTop: '10px' }}>{t('fileExport.exportMPS')}</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}