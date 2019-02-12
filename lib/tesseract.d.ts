import { TessBaseApi, TessResultIterator } from './interfaces';
export declare function init(datapath: string, language: string): TessBaseApi;
export declare function clear(api: TessBaseApi): void;
export declare function close(api: TessBaseApi): void;
export declare function getResultIterator(api: TessBaseApi): TessResultIterator;
export declare function getUtf8TextAsync(api: TessBaseApi): Promise<string>;
export declare function reconizeAsync(api: TessBaseApi): Promise<void>;
export declare function setImageAsync(api: TessBaseApi, imageData: Buffer, width: number, height: number, bytesPerPixel: number, bytesPerLine: number): Promise<void>;
