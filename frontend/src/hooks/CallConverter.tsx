/*
// Ausführen der Parsing-Funktion
let lpInterface = parseLP(lpString);
console.log("___________________PARSE LP________________________")
console.log(JSON.stringify(lpInterface, null, 2));

lpInterface = parseMPS(mpsString);
console.log("___________________PARSE MPS________________________")
console.log(JSON.stringify(lpInterface, null, 2));

console.log("___________________Convert to LP________________________")
// Ausgabe des LP-Formats
console.log(convertToLP(LPObject));

console.log("___________________Convert to MPS________________________")
// Ausgabe des LP-Formats
console.log(convertToMPS(LPObject));

*/


import {parseGMPL, convertToGLPM} from "@/hooks/GMPLConverter.tsx";
import {gmplString, lpObject} from "@/interfaces/TestData.tsx"
import {LP} from "@/interfaces/LP.tsx";
import GLPK_TEST from "@/hooks/Callglpk.tsx";


export function test(){
    <GLPK_TEST></GLPK_TEST>

    console.log("Teste die Converter Funktionen")
    let lpInterface:LP = parseGMPL(gmplString);
    console.log("___________________PARSE GMPL________________________")
    console.log(JSON.stringify(lpInterface, null, 2));

    console.log("___________________Convert to GMPL________________________")
// Ausgabe des LP-Formats
    console.log(convertToGLPM(lpObject));
}




