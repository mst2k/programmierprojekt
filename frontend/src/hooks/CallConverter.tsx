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
import {gmplString} from "@/interfaces/TestData.tsx"
import {LP} from "@/interfaces/LP.tsx";

export function test(){
    console.log("Teste die Converter Funktionen")
    console.log("__________________________________________________________________")
    console.log("Mit diesem GMPL string wird getetst")
    console.log(gmplString)
    console.log("Erstelle Object aus GMPL String")
    console
    let lpInterface:LP = parseGMPL(gmplString);
    console.log(JSON.stringify(lpInterface, null, 2));
    console.log("Versuche den ursprünglichen GMPL String wiederherzustellen")
    console.log(convertToGLPM(lpInterface));


    console.log("Erstelle nochmals ein Object daraus")
    console.log(JSON.stringify(lpInterface, null, 2));

    //console.log(convertToGLPM(lpObject));
}




