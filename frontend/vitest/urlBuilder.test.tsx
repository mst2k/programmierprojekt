import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
    arrayBufferToBase64,
    base64ToArrayBuffer,
} from '@/hooks/urlBuilder'

describe('URL Parameter Utilities', () => {
    describe('ArrayBuffer and Base64 conversion', () => {
        it('should convert ArrayBuffer to Base64 and back', () => {
            const original = new Uint8Array([1, 2, 3, 4]);
            const base64 = arrayBufferToBase64(original.buffer);
            const result = base64ToArrayBuffer(base64);
            expect(new Uint8Array(result)).toEqual(original);
        });
    });
});