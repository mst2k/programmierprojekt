// Utility to convert ArrayBuffer to Base64

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

// Utility to convert Base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

// Function to compress and encode the URL parameter
export const compressUrlParam = async (
    str: string,
    encoding = 'gzip' as CompressionFormat
): Promise<string> => {
    const byteArray = new TextEncoder().encode(str);
    const cs = new CompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    const compressedArrayBuffer = await new Response(cs.readable).arrayBuffer();

    // Convert compressed ArrayBuffer to Base64 string for URL-safe use
    return arrayBufferToBase64(compressedArrayBuffer);
};

// Function to decompress the URL parameter
export const decompressUrlParam = async (
    compressedBase64: string,
    encoding = 'gzip' as CompressionFormat
): Promise<string> => {
    // Convert the Base64 string back to ArrayBuffer
    const compressedArrayBuffer = base64ToArrayBuffer(compressedBase64);

    const cs = new DecompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(new Uint8Array(compressedArrayBuffer));
    writer.close();

    const decompressedArrayBuffer = await new Response(cs.readable).arrayBuffer();
    const text = new TextDecoder().decode(decompressedArrayBuffer)
    return text;
};

// Funktion zum Erstellen des URL-Parameters
export async function buildUrlParameter(params: Record<string, string>): Promise<string> {
    const urlString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    const comUrlString = await compressUrlParam(urlString)
    return `param=${encodeURIComponent(comUrlString)}`
}

// Funktion zum Parsen des URL-Parameters
export async function parseUrlParameter(compUrlParameter: string): Promise<Record<string, string>> {
    const param = decodeURIComponent(new URLSearchParams(compUrlParameter).get("param") || "");
    const urlParameter = await decompressUrlParam(param)
    const result: Record<string, string> = {};

    urlParameter.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
            result[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    });

    return result;
}
export function clearUrlParams() {
    // Remove URL parameters without refreshing the page
    if (window.location.hash) {
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname+ window.location.hash.split("?")[0];
        window.history.replaceState({ path: newUrl }, "", newUrl);
    }
}



// Beispielverwendung
const parameters = {
    currentSolver: "solver1asldkfjasödlkfjsaöldkfjslödkjfasdlökfjaslödfjklsadökjafklö nerasddfkjsdlöfjasalkj asddlfuaseeklhjr saddlökafjkl ösaakls ö",
    currentLpFormat: "format1",
    currentProblem: "problem1sadkjladfklsh nilasuadsz fhlkasdhfl asdjhawieufhr dlskjajkls heweaköfj dnskjfh alshföaewioefh dskjfap iough askldjhaew oeöe sadöadklsögn apwuhewö fjklasödkfh "
};

export async function testURLParser() {
    // URL-Parameter erstellen
    const urlParam = await buildUrlParameter(parameters);
    console.log("URL-Parameter:", urlParam);

    // URL-Parameter parsen
    const parsedParams = await parseUrlParameter(urlParam);
    console.log("Geparste Parameter:", parsedParams);
    testCompression();
}

// Funktion zur Berechnung der Länge des URL-Parameters
async function calculateUrlLength(params: { key1: string; key2: string } | {
    key1: string;
    key2: string;
    key3: string
} | { key1: string }): Promise<{ original: number; compressed: number }> {
    const originalUrl = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    const compressedUrl = await buildUrlParameter(params);

    return {
        original: originalUrl.length,
        compressed: compressedUrl.length
    };
}

// Test mit verschiedenen Datensätzen
async function testCompression() {
    const testCases = [
        {
            name: "Kleiner Datensatz",
            data: {
                key1: "short",
                key2: "value"
            }
        },
        {
            name: "Großer Datensatz",
            data: {
                key1: "a".repeat(1000),
                key2: "b".repeat(1000),
                key3: "c".repeat(1000)
            }
        },
        {
            name: "TransportProblem",
            data: {
                key1: ` A TRANSPORTATION PROBLEM
#
# This problem finds a least cost shipping schedule that meets
# requirements at markets and supplies at factories.
#
#  References:
#              Dantzig G B, "Linear Programming and Extensions."
#              Princeton University Press, Princeton, New Jersey, 1963,
#              Chapter 3-3.

set I;
/* canning plants */

set J;
/* markets */

param a{i in I};
/* capacity of plant i in cases */

param b{j in J};
/* demand at market j in cases */

param d{i in I, j in J};
/* distance in thousands of miles */

param f;
/* freight in dollars per case per thousand miles */

param c{i in I, j in J} := f * d[i,j] / 1000;
/* transport cost in thousands of dollars per case */

var x{i in I, j in J} >= 0;
/* shipment quantities in cases */

minimize cost: sum{i in I, j in J} c[i,j] * x[i,j];
/* total transportation costs in thousands of dollars */

s.t. supply{i in I}: sum{j in J} x[i,j] <= a[i];
/* observe supply limit at plant i */

s.t. demand{j in J}: sum{i in I} x[i,j] >= b[j];
/* satisfy demand at market j */



solve;

# Report / Result Section (Optional)
printf '#################################\\n';
printf 'Transportation Problem / LP Model Result\\n';
printf '\\n';
printf 'Minimum Cost = %.2f\\n', cost;
printf '\\n';

printf '\\n';
printf 'Variables  (i.e. shipment quantities in cases ) \\n';

printf 'Shipment quantities in cases\\n';
printf 'Canning Plants  Markets   Solution (Cases) \\n';
printf{i in I, j in J}:'%14s %10s %11s\\n',i,j, x[i,j];
printf '\\n';

printf 'Constraints\\n';
printf '\\n';
printf 'Observe supply limit at plant i\\n';
printf 'Canning Plants Solution Sign  Required\\n';
for {i in I} {
 printf '%14s %10.2f <= %.3f\\n', i, sum {j in J} x[i,j], a[i];
   }

printf '\\n';
printf 'Satisfy demand at market j\\n';
printf 'Market Solution Sign  Required\\n';
for {j in J} {
 printf '%5s %10.2f >= %.3f\\n', j, sum {i in I} x[i,j], b[j];
   }



data;

set I := Seattle San-Diego;

set J := New-York Chicago Topeka;

param a := Seattle     350
           San-Diego   600;

param b := New-York    325
           Chicago     300
           Topeka      275;

param d :              New-York   Chicago   Topeka :=
           Seattle     2.5        1.7       1.8
           San-Diego   2.5        1.8       1.4  ;

param f := 90;

end;`
            }
        }
    ];

    for (const testCase of testCases) {
        const lengths = await calculateUrlLength(testCase.data);
        console.log(`${testCase.name}:`);
        console.log(`  Original: ${lengths.original} Zeichen`);
        console.log(`  Komprimiert: ${lengths.compressed} Zeichen`);
        console.log(`  Kompressionsrate: ${((1 - lengths.compressed / lengths.original) * 100).toFixed(2)}%`);
        console.log();
    }
}