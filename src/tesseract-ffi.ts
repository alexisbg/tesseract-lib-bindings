import FFI from 'ffi';
import Path from 'path';
import Ref, { Type } from 'ref';


/* eslint-disable @typescript-eslint/no-empty-interface */
export interface TessBaseApi {}
export interface TessResultIterator {}
/* eslint-enable @typescript-eslint/no-empty-interface */


/* eslint-disable @typescript-eslint/camelcase */
interface TesseractFfiFuncs {
  TessBaseAPICreate(): TessBaseApi;

  TessBaseAPIClear(api: TessBaseApi): void;

  TessBaseAPIDelete(api: TessBaseApi): void;

  TessBaseAPIEnd(api: TessBaseApi): void;

  TessBaseAPIGetIterator(api: TessBaseApi): TessResultIterator;

  TessBaseAPIGetUTF8Text(api: TessBaseApi): Buffer;

  TessBaseAPIInit3(api: TessBaseApi, datapath: Buffer, language: Buffer): number;

  // monitor is null because it has still not been implemented
  TessBaseAPIRecognize(api: TessBaseApi, monitor: null): number;

  TessBaseAPISetImage(
    api: TessBaseApi,
    imagedata: Buffer,
    width: number,
    height: number,
    bytes_per_pixel: number,
    bytes_per_line: number
  ): void;

  TessDeleteText(text: Buffer): void;

  TessPageIteratorBoundingBox(
    iterator: TessResultIterator,
    level: number,
    left: Buffer,
    top: Buffer,
    right: Buffer,
    bottom: Buffer
  ): number;

  TessResultIteratorConfidence(iterator: TessResultIterator, level: number): number;

  TessResultIteratorGetUTF8Text(iterator: TessResultIterator, level: number): Buffer;

  TessResultIteratorNext(iterator: TessResultIterator, level: number): number;
}
/* eslint-enable @typescript-eslint/camelcase */


// Get location of native library
let libPath: string | null = null;

if (process.platform === 'win32') {
  if (process.arch === 'x64') {
    libPath = '../tesseract/x64/tesseract40.dll';
  }
  else {
    libPath = '../tesseract/x86/tesseract40.dll';
  }
}
else if (process.platform === 'linux') {
  libPath = '../tesseract/lib/libtesseract.so.4.0.0';
}
// else if (process.platform === 'darwin') {
//   libPath = '../tesseract/lib/libtesseract.dylib';
// }
else {
  throw new Error('Unsupported plateform: ' + process.platform);
}

libPath = Path.resolve(__dirname, libPath);

// tessdata path
// const tessdataPath = path.resolve(__dirname, '../tesseract/tessdata') + '/'; // Has to end with /


// Types
const charPtr: Type = Ref.refType('char');
const intPtr: Type = Ref.refType('int');
const ucharPtr: Type = Ref.refType('uchar');
const voidPtr: Type = Ref.refType(Ref.types.void);

const TessBaseAPI: Type = voidPtr;
const TessBaseAPIPtr: Type = Ref.refType(TessBaseAPI);
const TessPageIterator: Type = voidPtr;
const TessPageIteratorPtr: Type = Ref.refType(TessPageIterator);
const TessResultIteratorPtr: Type = TessPageIteratorPtr;


// Bindings of useful functions
/* eslint-disable key-spacing */
export default FFI.Library(libPath, {
  TessBaseAPICreate:              [TessBaseAPIPtr, []],
  TessBaseAPIClear:               ['void', [TessBaseAPIPtr]],
  TessBaseAPIDelete:              ['void', [TessBaseAPIPtr]],
  TessBaseAPIEnd:                 ['void', [TessBaseAPIPtr]],
  TessBaseAPIGetUTF8Text:         [charPtr /* Buffer */, [TessBaseAPIPtr]],
  TessBaseAPIGetIterator:         [TessResultIteratorPtr, [TessBaseAPIPtr]],
  TessBaseAPIInit3:               ['int', [TessBaseAPIPtr, 'string', 'string']],
  TessBaseAPIRecognize:           ['int', [TessBaseAPIPtr, voidPtr]],
  TessBaseAPISetImage:            ['void', [TessBaseAPIPtr, ucharPtr /* Buffer */, 'int', 'int', 'int', 'int']],

  TessDeleteText:                 ['void', [charPtr /* Buffer */]],

  TessPageIteratorBoundingBox:    ['int', [TessPageIteratorPtr, 'int', intPtr, intPtr, intPtr, intPtr]],
  TessResultIteratorConfidence:   ['float', [TessResultIteratorPtr, 'int']],
  TessResultIteratorGetUTF8Text:  [charPtr, [TessResultIteratorPtr, 'int']],
  TessResultIteratorNext:         ['int', [TessResultIteratorPtr, 'int']],
}) as TesseractFfiFuncs;
/* eslint-enable key-spacing */
