import { BoundingBox, TessResultIterator } from './interfaces';
export declare const RIL_BLOCK = 0;
export declare const RIL_PARA = 1;
export declare const RIL_TEXTLINE = 2;
export declare const RIL_WORD = 3;
export declare const RIL_SYMBOL = 4;
export declare function getBoundingBox(iterator: TessResultIterator, level: number): BoundingBox | null;
export declare function getConfidence(iterator: TessResultIterator, level: number): number;
export declare function getUtf8Text(iterator: TessResultIterator, level: number): string;
export declare function next(iterator: TessResultIterator, level: number): boolean;
