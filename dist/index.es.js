import Ref from 'ref';
import FFI from 'ffi';
import Path from 'path';

/* eslint-enable @typescript-eslint/camelcase */
// Get location of native library
let libPath = null;
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
// Types
const charPtr = Ref.refType('char');
const intPtr = Ref.refType('int');
const ucharPtr = Ref.refType('uchar');
const voidPtr = Ref.refType(Ref.types.void);
const TessBaseAPI = voidPtr;
const TessBaseAPIPtr = Ref.refType(TessBaseAPI);
const TessPageIterator = voidPtr;
const TessPageIteratorPtr = Ref.refType(TessPageIterator);
const TessResultIteratorPtr = TessPageIteratorPtr;
// Bindings of useful functions
/* eslint-disable key-spacing */
var TessFFI = FFI.Library(Path.resolve(__dirname, libPath), {
    TessBaseAPICreate: [TessBaseAPIPtr, []],
    TessBaseAPIClear: ['void', [TessBaseAPIPtr]],
    TessBaseAPIDelete: ['void', [TessBaseAPIPtr]],
    TessBaseAPIEnd: ['void', [TessBaseAPIPtr]],
    TessBaseAPIGetUTF8Text: [charPtr /* Buffer */, [TessBaseAPIPtr]],
    TessBaseAPIGetIterator: [TessResultIteratorPtr, [TessBaseAPIPtr]],
    TessBaseAPIInit3: ['int', [TessBaseAPIPtr, 'string', 'string']],
    TessBaseAPIRecognize: ['int', [TessBaseAPIPtr, voidPtr]],
    TessBaseAPISetImage: ['void', [TessBaseAPIPtr, ucharPtr /* Buffer */, 'int', 'int', 'int', 'int']],
    TessDeleteText: ['void', [charPtr /* Buffer */]],
    TessPageIteratorBoundingBox: ['int', [TessPageIteratorPtr, 'int', intPtr, intPtr, intPtr, intPtr]],
    TessResultIteratorConfidence: ['float', [TessResultIteratorPtr, 'int']],
    TessResultIteratorGetUTF8Text: [charPtr, [TessResultIteratorPtr, 'int']],
    TessResultIteratorNext: ['int', [TessResultIteratorPtr, 'int']],
});
/* eslint-enable key-spacing */

// Levels
const RIL_BLOCK = 0;
const RIL_PARA = 1;
const RIL_TEXTLINE = 2;
const RIL_WORD = 3;
const RIL_SYMBOL = 4;
function getBoundingBox(iterator, level) {
    let leftBuff = Ref.alloc('int');
    let topBuff = Ref.alloc('int');
    let rightBuff = Ref.alloc('int');
    let bottomBuff = Ref.alloc('int');
    const ret = TessFFI.TessPageIteratorBoundingBox(iterator, level, leftBuff, topBuff, rightBuff, bottomBuff);
    if (ret) {
        const out = {
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
function getConfidence(iterator, level) {
    return TessFFI.TessResultIteratorConfidence(iterator, level);
}
function getUtf8Text(iterator, level) {
    const textPtr = TessFFI.TessResultIteratorGetUTF8Text(iterator, level);
    const str = Ref.reinterpretUntilZeros(textPtr, 1, 0).toString();
    TessFFI.TessDeleteText(textPtr);
    return str;
}
function next(iterator, level) {
    return TessFFI.TessResultIteratorNext(iterator, level) ? true : false;
}

var resultIterator = /*#__PURE__*/Object.freeze({
  RIL_BLOCK: RIL_BLOCK,
  RIL_PARA: RIL_PARA,
  RIL_TEXTLINE: RIL_TEXTLINE,
  RIL_WORD: RIL_WORD,
  RIL_SYMBOL: RIL_SYMBOL,
  getBoundingBox: getBoundingBox,
  getConfidence: getConfidence,
  getUtf8Text: getUtf8Text,
  next: next
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function init(datapath, language) {
    // datapath has to end with /
    if (!datapath.endsWith('/')) {
        datapath += '/';
    }
    let api = TessFFI.TessBaseAPICreate();
    let datapathBuff = Ref.allocCString(datapath);
    let languageBuff = Ref.allocCString(language);
    const err = TessFFI.TessBaseAPIInit3(api, datapathBuff, languageBuff);
    datapathBuff = null;
    languageBuff = null;
    // Error
    if (err) {
        api = null;
        throw new Error('TessBaseAPIInit3 fails');
    }
    return api;
}
function clear(api) {
    // Free up recognition results and any stored image data, without actually
    // freeing any recognition data that would be time-consuming to reload.
    // Afterwards, you must call SetImage or TesseractRect before doing any Recognize or Get* operation.
    TessFFI.TessBaseAPIClear(api);
}
function close(api) {
    // Close down tesseract and free up all memory, except TessBaseAPI handle.
    // Only TessBaseAPIInit* can be called after TessBaseAPIEnd
    TessFFI.TessBaseAPIEnd(api);
    // Delete TessBaseAPI handle
    TessFFI.TessBaseAPIDelete(api);
}
function getResultIterator(api) {
    return TessFFI.TessBaseAPIGetIterator(api);
}
function getUtf8TextAsync(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const textPtr = TessFFI.TessBaseAPIGetUTF8Text(api);
        // There is no need to create a new Buffer because toString copies it
        const str = Ref.reinterpretUntilZeros(textPtr, 1, 0).toString();
        TessFFI.TessDeleteText(textPtr);
        return str;
    });
}
function reconizeAsync(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const err = TessFFI.TessBaseAPIRecognize(api, null);
        if (err) {
            throw new Error('TessBaseAPIRecognize failed');
        }
    });
}
function setImageAsync(api, imageData, width, height, bytesPerPixel, bytesPerLine) {
    return __awaiter(this, void 0, void 0, function* () {
        // imageData has to be raw image data
        TessFFI.TessBaseAPISetImage(api, imageData, width, height, bytesPerPixel, bytesPerLine);
    });
}

var tesseract = /*#__PURE__*/Object.freeze({
  init: init,
  clear: clear,
  close: close,
  getResultIterator: getResultIterator,
  getUtf8TextAsync: getUtf8TextAsync,
  reconizeAsync: reconizeAsync,
  setImageAsync: setImageAsync
});

export { resultIterator as ResultIterator, tesseract as Tesseract };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXNzZXJhY3QtZmZpLnRzIiwiLi4vc3JjL3Jlc3VsdC1pdGVyYXRvci50cyIsIi4uL3NyYy90ZXNzZXJhY3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEZGSSBmcm9tICdmZmknO1xuaW1wb3J0IFBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgUmVmLCB7IFR5cGUgfSBmcm9tICdyZWYnO1xuaW1wb3J0IHsgVGVzc0Jhc2VBcGksIFRlc3NSZXN1bHRJdGVyYXRvciB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2NhbWVsY2FzZSAqL1xuaW50ZXJmYWNlIFRlc3NlcmFjdEZmaUZ1bmNzIHtcbiAgVGVzc0Jhc2VBUElDcmVhdGUoKTogVGVzc0Jhc2VBcGk7XG5cbiAgVGVzc0Jhc2VBUElDbGVhcihhcGk6IFRlc3NCYXNlQXBpKTogdm9pZDtcblxuICBUZXNzQmFzZUFQSURlbGV0ZShhcGk6IFRlc3NCYXNlQXBpKTogdm9pZDtcblxuICBUZXNzQmFzZUFQSUVuZChhcGk6IFRlc3NCYXNlQXBpKTogdm9pZDtcblxuICBUZXNzQmFzZUFQSUdldEl0ZXJhdG9yKGFwaTogVGVzc0Jhc2VBcGkpOiBUZXNzUmVzdWx0SXRlcmF0b3I7XG5cbiAgVGVzc0Jhc2VBUElHZXRVVEY4VGV4dChhcGk6IFRlc3NCYXNlQXBpKTogQnVmZmVyO1xuXG4gIFRlc3NCYXNlQVBJSW5pdDMoYXBpOiBUZXNzQmFzZUFwaSwgZGF0YXBhdGg6IEJ1ZmZlciwgbGFuZ3VhZ2U6IEJ1ZmZlcik6IG51bWJlcjtcblxuICAvLyBtb25pdG9yIGlzIG51bGwgYmVjYXVzZSBpdCBoYXMgc3RpbGwgbm90IGJlZW4gaW1wbGVtZW50ZWRcbiAgVGVzc0Jhc2VBUElSZWNvZ25pemUoYXBpOiBUZXNzQmFzZUFwaSwgbW9uaXRvcjogbnVsbCk6IG51bWJlcjtcblxuICBUZXNzQmFzZUFQSVNldEltYWdlKFxuICAgIGFwaTogVGVzc0Jhc2VBcGksXG4gICAgaW1hZ2VkYXRhOiBCdWZmZXIsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICBieXRlc19wZXJfcGl4ZWw6IG51bWJlcixcbiAgICBieXRlc19wZXJfbGluZTogbnVtYmVyXG4gICk6IHZvaWQ7XG5cbiAgVGVzc0RlbGV0ZVRleHQodGV4dDogQnVmZmVyKTogdm9pZDtcblxuICBUZXNzUGFnZUl0ZXJhdG9yQm91bmRpbmdCb3goXG4gICAgaXRlcmF0b3I6IFRlc3NSZXN1bHRJdGVyYXRvcixcbiAgICBsZXZlbDogbnVtYmVyLFxuICAgIGxlZnQ6IEJ1ZmZlcixcbiAgICB0b3A6IEJ1ZmZlcixcbiAgICByaWdodDogQnVmZmVyLFxuICAgIGJvdHRvbTogQnVmZmVyXG4gICk6IG51bWJlcjtcblxuICBUZXNzUmVzdWx0SXRlcmF0b3JDb25maWRlbmNlKGl0ZXJhdG9yOiBUZXNzUmVzdWx0SXRlcmF0b3IsIGxldmVsOiBudW1iZXIpOiBudW1iZXI7XG5cbiAgVGVzc1Jlc3VsdEl0ZXJhdG9yR2V0VVRGOFRleHQoaXRlcmF0b3I6IFRlc3NSZXN1bHRJdGVyYXRvciwgbGV2ZWw6IG51bWJlcik6IEJ1ZmZlcjtcblxuICBUZXNzUmVzdWx0SXRlcmF0b3JOZXh0KGl0ZXJhdG9yOiBUZXNzUmVzdWx0SXRlcmF0b3IsIGxldmVsOiBudW1iZXIpOiBudW1iZXI7XG59XG4vKiBlc2xpbnQtZW5hYmxlIEB0eXBlc2NyaXB0LWVzbGludC9jYW1lbGNhc2UgKi9cblxuXG4vLyBHZXQgbG9jYXRpb24gb2YgbmF0aXZlIGxpYnJhcnlcbmxldCBsaWJQYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgaWYgKHByb2Nlc3MuYXJjaCA9PT0gJ3g2NCcpIHtcbiAgICBsaWJQYXRoID0gJy4uL3Rlc3NlcmFjdC94NjQvdGVzc2VyYWN0NDAuZGxsJztcbiAgfVxuICBlbHNlIHtcbiAgICBsaWJQYXRoID0gJy4uL3Rlc3NlcmFjdC94ODYvdGVzc2VyYWN0NDAuZGxsJztcbiAgfVxufVxuZWxzZSBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuICBsaWJQYXRoID0gJy4uL3Rlc3NlcmFjdC9saWIvbGlidGVzc2VyYWN0LnNvLjQuMC4wJztcbn1cbi8vIGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4vLyAgIGxpYlBhdGggPSAnLi4vdGVzc2VyYWN0L2xpYi9saWJ0ZXNzZXJhY3QuZHlsaWInO1xuLy8gfVxuZWxzZSB7XG4gIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgcGxhdGVmb3JtOiAnICsgcHJvY2Vzcy5wbGF0Zm9ybSk7XG59XG5cblxuLy8gVHlwZXNcbmNvbnN0IGNoYXJQdHI6IFR5cGUgPSBSZWYucmVmVHlwZSgnY2hhcicpO1xuY29uc3QgaW50UHRyOiBUeXBlID0gUmVmLnJlZlR5cGUoJ2ludCcpO1xuY29uc3QgdWNoYXJQdHI6IFR5cGUgPSBSZWYucmVmVHlwZSgndWNoYXInKTtcbmNvbnN0IHZvaWRQdHI6IFR5cGUgPSBSZWYucmVmVHlwZShSZWYudHlwZXMudm9pZCk7XG5cbmNvbnN0IFRlc3NCYXNlQVBJOiBUeXBlID0gdm9pZFB0cjtcbmNvbnN0IFRlc3NCYXNlQVBJUHRyOiBUeXBlID0gUmVmLnJlZlR5cGUoVGVzc0Jhc2VBUEkpO1xuY29uc3QgVGVzc1BhZ2VJdGVyYXRvcjogVHlwZSA9IHZvaWRQdHI7XG5jb25zdCBUZXNzUGFnZUl0ZXJhdG9yUHRyOiBUeXBlID0gUmVmLnJlZlR5cGUoVGVzc1BhZ2VJdGVyYXRvcik7XG5jb25zdCBUZXNzUmVzdWx0SXRlcmF0b3JQdHI6IFR5cGUgPSBUZXNzUGFnZUl0ZXJhdG9yUHRyO1xuXG5cbi8vIEJpbmRpbmdzIG9mIHVzZWZ1bCBmdW5jdGlvbnNcbi8qIGVzbGludC1kaXNhYmxlIGtleS1zcGFjaW5nICovXG5leHBvcnQgZGVmYXVsdCBGRkkuTGlicmFyeShQYXRoLnJlc29sdmUoX19kaXJuYW1lLCBsaWJQYXRoKSwge1xuICBUZXNzQmFzZUFQSUNyZWF0ZTogICAgICAgICAgICAgIFtUZXNzQmFzZUFQSVB0ciwgW11dLFxuICBUZXNzQmFzZUFQSUNsZWFyOiAgICAgICAgICAgICAgIFsndm9pZCcsIFtUZXNzQmFzZUFQSVB0cl1dLFxuICBUZXNzQmFzZUFQSURlbGV0ZTogICAgICAgICAgICAgIFsndm9pZCcsIFtUZXNzQmFzZUFQSVB0cl1dLFxuICBUZXNzQmFzZUFQSUVuZDogICAgICAgICAgICAgICAgIFsndm9pZCcsIFtUZXNzQmFzZUFQSVB0cl1dLFxuICBUZXNzQmFzZUFQSUdldFVURjhUZXh0OiAgICAgICAgIFtjaGFyUHRyIC8qIEJ1ZmZlciAqLywgW1Rlc3NCYXNlQVBJUHRyXV0sXG4gIFRlc3NCYXNlQVBJR2V0SXRlcmF0b3I6ICAgICAgICAgW1Rlc3NSZXN1bHRJdGVyYXRvclB0ciwgW1Rlc3NCYXNlQVBJUHRyXV0sXG4gIFRlc3NCYXNlQVBJSW5pdDM6ICAgICAgICAgICAgICAgWydpbnQnLCBbVGVzc0Jhc2VBUElQdHIsICdzdHJpbmcnLCAnc3RyaW5nJ11dLFxuICBUZXNzQmFzZUFQSVJlY29nbml6ZTogICAgICAgICAgIFsnaW50JywgW1Rlc3NCYXNlQVBJUHRyLCB2b2lkUHRyXV0sXG4gIFRlc3NCYXNlQVBJU2V0SW1hZ2U6ICAgICAgICAgICAgWyd2b2lkJywgW1Rlc3NCYXNlQVBJUHRyLCB1Y2hhclB0ciAvKiBCdWZmZXIgKi8sICdpbnQnLCAnaW50JywgJ2ludCcsICdpbnQnXV0sXG5cbiAgVGVzc0RlbGV0ZVRleHQ6ICAgICAgICAgICAgICAgICBbJ3ZvaWQnLCBbY2hhclB0ciAvKiBCdWZmZXIgKi9dXSxcblxuICBUZXNzUGFnZUl0ZXJhdG9yQm91bmRpbmdCb3g6ICAgIFsnaW50JywgW1Rlc3NQYWdlSXRlcmF0b3JQdHIsICdpbnQnLCBpbnRQdHIsIGludFB0ciwgaW50UHRyLCBpbnRQdHJdXSxcbiAgVGVzc1Jlc3VsdEl0ZXJhdG9yQ29uZmlkZW5jZTogICBbJ2Zsb2F0JywgW1Rlc3NSZXN1bHRJdGVyYXRvclB0ciwgJ2ludCddXSxcbiAgVGVzc1Jlc3VsdEl0ZXJhdG9yR2V0VVRGOFRleHQ6ICBbY2hhclB0ciwgW1Rlc3NSZXN1bHRJdGVyYXRvclB0ciwgJ2ludCddXSxcbiAgVGVzc1Jlc3VsdEl0ZXJhdG9yTmV4dDogICAgICAgICBbJ2ludCcsIFtUZXNzUmVzdWx0SXRlcmF0b3JQdHIsICdpbnQnXV0sXG59KSBhcyBUZXNzZXJhY3RGZmlGdW5jcztcbi8qIGVzbGludC1lbmFibGUga2V5LXNwYWNpbmcgKi9cbiIsImltcG9ydCBSZWYgZnJvbSAncmVmJztcbmltcG9ydCBUZXNzRkZJIGZyb20gJy4vdGVzc2VyYWN0LWZmaSc7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCwgVGVzc1Jlc3VsdEl0ZXJhdG9yIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuXG4vLyBMZXZlbHNcbmV4cG9ydCBjb25zdCBSSUxfQkxPQ0sgPSAwO1xuZXhwb3J0IGNvbnN0IFJJTF9QQVJBID0gMTtcbmV4cG9ydCBjb25zdCBSSUxfVEVYVExJTkUgPSAyO1xuZXhwb3J0IGNvbnN0IFJJTF9XT1JEID0gMztcbmV4cG9ydCBjb25zdCBSSUxfU1lNQk9MID0gNDtcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm91bmRpbmdCb3goaXRlcmF0b3I6IFRlc3NSZXN1bHRJdGVyYXRvciwgbGV2ZWw6IG51bWJlcik6IEJvdW5kaW5nQm94IHwgbnVsbCB7XG5cbiAgbGV0IGxlZnRCdWZmOiBCdWZmZXIgfCBudWxsID0gUmVmLmFsbG9jKCdpbnQnKTtcbiAgbGV0IHRvcEJ1ZmY6IEJ1ZmZlciB8IG51bGwgPSBSZWYuYWxsb2MoJ2ludCcpO1xuICBsZXQgcmlnaHRCdWZmOiBCdWZmZXIgfCBudWxsID0gUmVmLmFsbG9jKCdpbnQnKTtcbiAgbGV0IGJvdHRvbUJ1ZmY6IEJ1ZmZlciB8IG51bGwgPSBSZWYuYWxsb2MoJ2ludCcpO1xuXG4gIGNvbnN0IHJldCA9IFRlc3NGRkkuVGVzc1BhZ2VJdGVyYXRvckJvdW5kaW5nQm94KGl0ZXJhdG9yLCBsZXZlbCwgbGVmdEJ1ZmYsIHRvcEJ1ZmYsIHJpZ2h0QnVmZiwgYm90dG9tQnVmZik7XG5cbiAgaWYgKHJldCkge1xuICAgIGNvbnN0IG91dDogQm91bmRpbmdCb3ggPSB7XG4gICAgICBsZWZ0OiBSZWYuZGVyZWYobGVmdEJ1ZmYpLFxuICAgICAgdG9wOiBSZWYuZGVyZWYodG9wQnVmZiksXG4gICAgICByaWdodDogUmVmLmRlcmVmKHJpZ2h0QnVmZiksXG4gICAgICBib3R0b206IFJlZi5kZXJlZihib3R0b21CdWZmKSxcbiAgICB9O1xuXG4gICAgbGVmdEJ1ZmYgPSBudWxsO1xuICAgIHRvcEJ1ZmYgPSBudWxsO1xuICAgIHJpZ2h0QnVmZiA9IG51bGw7XG4gICAgYm90dG9tQnVmZiA9IG51bGw7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZGVuY2UoaXRlcmF0b3I6IFRlc3NSZXN1bHRJdGVyYXRvciwgbGV2ZWw6IG51bWJlcik6IG51bWJlciB7XG5cbiAgcmV0dXJuIFRlc3NGRkkuVGVzc1Jlc3VsdEl0ZXJhdG9yQ29uZmlkZW5jZShpdGVyYXRvciwgbGV2ZWwpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVdGY4VGV4dChpdGVyYXRvcjogVGVzc1Jlc3VsdEl0ZXJhdG9yLCBsZXZlbDogbnVtYmVyKTogc3RyaW5nIHtcblxuICBjb25zdCB0ZXh0UHRyOiBCdWZmZXIgPSBUZXNzRkZJLlRlc3NSZXN1bHRJdGVyYXRvckdldFVURjhUZXh0KGl0ZXJhdG9yLCBsZXZlbCk7XG5cbiAgY29uc3Qgc3RyOiBzdHJpbmcgPSBSZWYucmVpbnRlcnByZXRVbnRpbFplcm9zKHRleHRQdHIsIDEsIDApLnRvU3RyaW5nKCk7XG5cbiAgVGVzc0ZGSS5UZXNzRGVsZXRlVGV4dCh0ZXh0UHRyKTtcblxuICByZXR1cm4gc3RyO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBuZXh0KGl0ZXJhdG9yOiBUZXNzUmVzdWx0SXRlcmF0b3IsIGxldmVsOiBudW1iZXIpOiBib29sZWFuIHtcblxuICByZXR1cm4gVGVzc0ZGSS5UZXNzUmVzdWx0SXRlcmF0b3JOZXh0KGl0ZXJhdG9yLCBsZXZlbCkgPyB0cnVlIDogZmFsc2U7XG59XG4iLCJpbXBvcnQgUmVmIGZyb20gJ3JlZic7XG5pbXBvcnQgVGVzc0ZGSSBmcm9tICcuL3Rlc3NlcmFjdC1mZmknO1xuaW1wb3J0IHsgVGVzc0Jhc2VBcGksIFRlc3NSZXN1bHRJdGVyYXRvciB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoZGF0YXBhdGg6IHN0cmluZywgbGFuZ3VhZ2U6IHN0cmluZyk6IFRlc3NCYXNlQXBpIHtcblxuICAvLyBkYXRhcGF0aCBoYXMgdG8gZW5kIHdpdGggL1xuICBpZiAoIWRhdGFwYXRoLmVuZHNXaXRoKCcvJykpIHtcbiAgICBkYXRhcGF0aCArPSAnLyc7XG4gIH1cblxuICBsZXQgYXBpOiBUZXNzQmFzZUFwaSB8IG51bGwgPSBUZXNzRkZJLlRlc3NCYXNlQVBJQ3JlYXRlKCk7XG5cbiAgbGV0IGRhdGFwYXRoQnVmZjogQnVmZmVyIHwgbnVsbCA9IFJlZi5hbGxvY0NTdHJpbmcoZGF0YXBhdGgpO1xuICBsZXQgbGFuZ3VhZ2VCdWZmOiBCdWZmZXIgfCBudWxsID0gUmVmLmFsbG9jQ1N0cmluZyhsYW5ndWFnZSk7XG5cbiAgY29uc3QgZXJyOiBudW1iZXIgPSBUZXNzRkZJLlRlc3NCYXNlQVBJSW5pdDMoYXBpLCBkYXRhcGF0aEJ1ZmYsIGxhbmd1YWdlQnVmZik7XG5cbiAgZGF0YXBhdGhCdWZmID0gbnVsbDtcbiAgbGFuZ3VhZ2VCdWZmID0gbnVsbDtcblxuICAvLyBFcnJvclxuICBpZiAoZXJyKSB7XG4gICAgYXBpID0gbnVsbDtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Rlc3NCYXNlQVBJSW5pdDMgZmFpbHMnKTtcbiAgfVxuXG4gIHJldHVybiBhcGk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyKGFwaTogVGVzc0Jhc2VBcGkpOiB2b2lkIHtcblxuICAvLyBGcmVlIHVwIHJlY29nbml0aW9uIHJlc3VsdHMgYW5kIGFueSBzdG9yZWQgaW1hZ2UgZGF0YSwgd2l0aG91dCBhY3R1YWxseVxuICAvLyBmcmVlaW5nIGFueSByZWNvZ25pdGlvbiBkYXRhIHRoYXQgd291bGQgYmUgdGltZS1jb25zdW1pbmcgdG8gcmVsb2FkLlxuICAvLyBBZnRlcndhcmRzLCB5b3UgbXVzdCBjYWxsIFNldEltYWdlIG9yIFRlc3NlcmFjdFJlY3QgYmVmb3JlIGRvaW5nIGFueSBSZWNvZ25pemUgb3IgR2V0KiBvcGVyYXRpb24uXG4gIFRlc3NGRkkuVGVzc0Jhc2VBUElDbGVhcihhcGkpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZShhcGk6IFRlc3NCYXNlQXBpKTogdm9pZCB7XG5cbiAgLy8gQ2xvc2UgZG93biB0ZXNzZXJhY3QgYW5kIGZyZWUgdXAgYWxsIG1lbW9yeSwgZXhjZXB0IFRlc3NCYXNlQVBJIGhhbmRsZS5cbiAgLy8gT25seSBUZXNzQmFzZUFQSUluaXQqIGNhbiBiZSBjYWxsZWQgYWZ0ZXIgVGVzc0Jhc2VBUElFbmRcbiAgVGVzc0ZGSS5UZXNzQmFzZUFQSUVuZChhcGkpO1xuXG4gIC8vIERlbGV0ZSBUZXNzQmFzZUFQSSBoYW5kbGVcbiAgVGVzc0ZGSS5UZXNzQmFzZUFQSURlbGV0ZShhcGkpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXN1bHRJdGVyYXRvcihhcGk6IFRlc3NCYXNlQXBpKTogVGVzc1Jlc3VsdEl0ZXJhdG9yIHtcblxuICByZXR1cm4gVGVzc0ZGSS5UZXNzQmFzZUFQSUdldEl0ZXJhdG9yKGFwaSk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFV0ZjhUZXh0QXN5bmMoYXBpOiBUZXNzQmFzZUFwaSk6IFByb21pc2U8c3RyaW5nPiB7XG5cbiAgY29uc3QgdGV4dFB0cjogQnVmZmVyID0gVGVzc0ZGSS5UZXNzQmFzZUFQSUdldFVURjhUZXh0KGFwaSk7XG5cbiAgLy8gVGhlcmUgaXMgbm8gbmVlZCB0byBjcmVhdGUgYSBuZXcgQnVmZmVyIGJlY2F1c2UgdG9TdHJpbmcgY29waWVzIGl0XG4gIGNvbnN0IHN0ciA9IFJlZi5yZWludGVycHJldFVudGlsWmVyb3ModGV4dFB0ciwgMSwgMCkudG9TdHJpbmcoKTtcblxuICBUZXNzRkZJLlRlc3NEZWxldGVUZXh0KHRleHRQdHIpO1xuXG4gIHJldHVybiBzdHI7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlY29uaXplQXN5bmMoYXBpOiBUZXNzQmFzZUFwaSk6IFByb21pc2U8dm9pZD4ge1xuXG4gIGNvbnN0IGVycjogbnVtYmVyID0gVGVzc0ZGSS5UZXNzQmFzZUFQSVJlY29nbml6ZShhcGksIG51bGwpO1xuXG4gIGlmIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Rlc3NCYXNlQVBJUmVjb2duaXplIGZhaWxlZCcpO1xuICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEltYWdlQXN5bmMoXG4gIGFwaTogVGVzc0Jhc2VBcGksXG4gIGltYWdlRGF0YTogQnVmZmVyLFxuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlcixcbiAgYnl0ZXNQZXJQaXhlbDogbnVtYmVyLFxuICBieXRlc1BlckxpbmU6IG51bWJlclxuKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgLy8gaW1hZ2VEYXRhIGhhcyB0byBiZSByYXcgaW1hZ2UgZGF0YVxuICBUZXNzRkZJLlRlc3NCYXNlQVBJU2V0SW1hZ2UoYXBpLCBpbWFnZURhdGEsIHdpZHRoLCBoZWlnaHQsIGJ5dGVzUGVyUGl4ZWwsIGJ5dGVzUGVyTGluZSk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQW1EQTs7QUFJQSxJQUFJLE9BQU8sR0FBa0IsSUFBSSxDQUFDO0FBRWxDLElBQUks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
