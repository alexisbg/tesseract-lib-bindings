import Ref from 'ref';
import TessFFI from './tesseract-ffi';
import { TessBaseApi, TessResultIterator } from './interfaces';


export function init(datapath: string, language: string): TessBaseApi {

  // datapath has to end with /
  if (!datapath.endsWith('/')) {
    datapath += '/';
  }

  let api: TessBaseApi | null = TessFFI.TessBaseAPICreate();

  let datapathBuff: Buffer | null = Ref.allocCString(datapath);
  let languageBuff: Buffer | null = Ref.allocCString(language);

  const err: number = TessFFI.TessBaseAPIInit3(api, datapathBuff, languageBuff);

  datapathBuff = null;
  languageBuff = null;

  // Error
  if (err) {
    api = null;
    throw new Error('TessBaseAPIInit3 fails');
  }

  return api;
}


export function clear(api: TessBaseApi): void {

  // Free up recognition results and any stored image data, without actually
  // freeing any recognition data that would be time-consuming to reload.
  // Afterwards, you must call SetImage or TesseractRect before doing any Recognize or Get* operation.
  TessFFI.TessBaseAPIClear(api);
}


export function close(api: TessBaseApi): void {

  // Close down tesseract and free up all memory, except TessBaseAPI handle.
  // Only TessBaseAPIInit* can be called after TessBaseAPIEnd
  TessFFI.TessBaseAPIEnd(api);

  // Delete TessBaseAPI handle
  TessFFI.TessBaseAPIDelete(api);
}


export function getResultIterator(api: TessBaseApi): TessResultIterator {

  return TessFFI.TessBaseAPIGetIterator(api);
}


export async function getUtf8TextAsync(api: TessBaseApi): Promise<string> {

  return new Promise((resolve, reject) => {

    try {
      const textPtr: Buffer = TessFFI.TessBaseAPIGetUTF8Text(api);

      // There is no need to create a new Buffer because toString copies it
      resolve(Ref.reinterpretUntilZeros(textPtr, 1, 0).toString());

      TessFFI.TessDeleteText(textPtr);
    }
    catch (error) {
      reject(error);
    }
  });
}


export async function reconizeAsync(api: TessBaseApi): Promise<void> {

  return new Promise((resolve, reject) => {

    const err: number = TessFFI.TessBaseAPIRecognize(api, null);

    if (err) {
      reject(new Error('TessBaseAPIRecognize failed'));
    }
    else {
      resolve();
    }
  });
}


export async function setImageAsync(
  api: TessBaseApi,
  imageData: Buffer,
  width: number,
  height: number,
  bytesPerPixel: number,
  bytesPerLine: number
): Promise<void> {

  // imageData has to be raw image data
  TessFFI.TessBaseAPISetImage(api, imageData, width, height, bytesPerPixel, bytesPerLine);

  return new Promise((resolve, reject) => {

    try {
      // imageData has to be raw image data
      TessFFI.TessBaseAPISetImage(api, imageData, width, height, bytesPerPixel, bytesPerLine);

      resolve();
    }
    catch (error) {
      reject(error);
    }
  });
}
