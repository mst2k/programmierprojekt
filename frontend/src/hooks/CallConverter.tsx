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
import {gmplString, mpsString, lpString} from "@/interfaces/TestData.tsx"
import {LP} from "@/interfaces/LP.tsx";
import {convertToLP, parseLP} from "@/hooks/LPConverter.tsx";
import {convertToMPS, parseMPS} from "@/hooks/MPSConverter.tsx";

export function test(){
    testMPSConverter()
    testLPConverter()
    testGMPLConverter()
}

function testGMPLConverter(){
    console.log("Teste die GMPL Converter Funktionen")
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
}

function testMPSConverter(){
    console.log("Teste die MPS Converter Funktionen")
    console.log("__________________________________________________________________")
    console.log("Mit diesem MPS string wird getetst")
    console.log(mpsString)
    console.log("Erstelle Object aus MPS String")
    console
    let lpInterface:LP = parseMPS(mpsString);
    console.log(JSON.stringify(lpInterface, null, 2));
    console.log("Versuche den ursprünglichen MPS String wiederherzustellen")
    console.log(convertToMPS(lpInterface));
    console.log("Erstelle nochmals ein Object daraus")
    console.log(JSON.stringify(lpInterface, null, 2));
}

function testLPConverter(){
    console.log("Teste die LP Converter Funktionen")
    console.log("__________________________________________________________________")
    console.log("Mit diesem LP string wird getetst")
    console.log(lpString)
    console.log("Erstelle Object aus LP String")
    console
    let lpInterface:LP = parseLP(lpString);
    console.log(JSON.stringify(lpInterface, null, 2));
    console.log("Versuche den ursprünglichen LP String wiederherzustellen")
    console.log(convertToLP(lpInterface));
    console.log("Erstelle nochmals ein Object daraus")
    console.log(JSON.stringify(lpInterface, null, 2));
}



