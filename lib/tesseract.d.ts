import { TessBaseApi, TessResultIterator } from './tesseract-ffi';
export declare function init(datapath: string, language: string): TessBaseApi;
export declare function clear(api: TessBaseApi): void;
export declare function close(api: TessBaseApi): void;
export declare function getResultIterator(api: TessBaseApi): TessResultIterator;
export declare function getUtf8Text(api: TessBaseApi): Promise<string>;
export declare function reconize(api: TessBaseApi): Promise<void>;
export declare function setImage(api: TessBaseApi, imageData: Buffer, width: number, height: number, bytesPerPixel: number, bytesPerLine: number): Promise<void>;
