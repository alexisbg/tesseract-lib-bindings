export interface TessBaseApi {
}
export interface TessResultIterator {
}
interface TesseractFfiFuncs {
    TessBaseAPICreate(): TessBaseApi;
    TessBaseAPIClear(api: TessBaseApi): void;
    TessBaseAPIDelete(api: TessBaseApi): void;
    TessBaseAPIEnd(api: TessBaseApi): void;
    TessBaseAPIGetIterator(api: TessBaseApi): TessResultIterator;
    TessBaseAPIGetUTF8Text(api: TessBaseApi): Buffer;
    TessBaseAPIInit3(api: TessBaseApi, datapath: Buffer, language: Buffer): number;
    TessBaseAPIRecognize(api: TessBaseApi, monitor: null): number;
    TessBaseAPISetImage(api: TessBaseApi, imagedata: Buffer, width: number, height: number, bytes_per_pixel: number, bytes_per_line: number): void;
    TessDeleteText(text: Buffer): void;
    TessPageIteratorBoundingBox(iterator: TessResultIterator, level: number, left: Buffer, top: Buffer, right: Buffer, bottom: Buffer): number;
    TessResultIteratorConfidence(iterator: TessResultIterator, level: number): number;
    TessResultIteratorGetUTF8Text(iterator: TessResultIterator, level: number): Buffer;
    TessResultIteratorNext(iterator: TessResultIterator, level: number): number;
}
declare const _default: TesseractFfiFuncs;
export default _default;
