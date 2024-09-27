// Utility to convert ArrayBuffer to Base64

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

// Utility to convert Base64 to ArrayBuffer
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
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