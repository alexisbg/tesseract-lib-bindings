import Ref from 'ref';
import TessFFI from './tesseract-ffi';
import { BoundingBox, TessResultIterator } from './interfaces';


// Levels
export const RIL_BLOCK = 0;
export const RIL_PARA = 1;
export const RIL_TEXTLINE = 2;
export const RIL_WORD = 3;
export const RIL_SYMBOL = 4;


export function getBoundingBox(iterator: TessResultIterator, level: number): BoundingBox | null {

  let leftBuff: Buffer | null = Ref.alloc('int');
  let topBuff: Buffer | null = Ref.alloc('int');
  let rightBuff: Buffer | null = Ref.alloc('int');
  let bottomBuff: Buffer | null = Ref.alloc('int');

  const ret = TessFFI.TessPageIteratorBoundingBox(iterator, level, leftBuff, topBuff, rightBuff, bottomBuff);

  if (ret) {
    const out: BoundingBox = {
      left: Ref.deref(leftBuff),
      top: Ref.deref(topBuff),
      right: Ref.deref(rightBuff),
      bottom: Ref.deref(bottomBuff),
    };

    leftBuff = null;
    topBuff = null;
    rightBuff = null;
    bottomBuff = null;

    return out;
  }
  else {
    return null;
  }
}


export function getConfidence(iterator: TessResultIterator, level: number): number {

  return TessFFI.TessResultIteratorConfidence(iterator, level);
}


export function getUtf8Text(iterator: TessResultIterator, level: number): string {

  const textPtr: Buffer = TessFFI.TessResultIteratorGetUTF8Text(iterator, level);

  const str: string = Ref.reinterpretUntilZeros(textPtr, 1, 0).toString();

  TessFFI.TessDeleteText(textPtr);

  return str;
}


export function next(iterator: TessResultIterator, level: number): boolean {

  return TessFFI.TessResultIteratorNext(iterator, level) ? true : false;
}
