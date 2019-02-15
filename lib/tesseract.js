"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = __importDefault(require("ref"));
const tesseract_ffi_1 = __importDefault(require("./tesseract-ffi"));
function init(datapath, language) {
    // datapath has to end with /
    if (!datapath.endsWith('/')) {
        datapath += '/';
    }
    let api = tesseract_ffi_1.default.TessBaseAPICreate();
    let datapathBuff = ref_1.default.allocCString(datapath);
    let languageBuff = ref_1.default.allocCString(language);
    const err = tesseract_ffi_1.default.TessBaseAPIInit3(api, datapathBuff, languageBuff);
    datapathBuff = null;
    languageBuff = null;
    // Error
    if (err) {
        api = null;
        throw new Error('TessBaseAPIInit3 fails');
    }
    return api;
}
exports.init = init;
function clear(api) {
    // Free up recognition results and any stored image data, without actually
    // freeing any recognition data that would be time-consuming to reload.
    // Afterwards, you must call SetImage or TesseractRect before doing any Recognize or Get* operation.
    tesseract_ffi_1.default.TessBaseAPIClear(api);
}
exports.clear = clear;
function close(api) {
    // Close down tesseract and free up all memory, except TessBaseAPI handle.
    // Only TessBaseAPIInit* can be called after TessBaseAPIEnd
    tesseract_ffi_1.default.TessBaseAPIEnd(api);
    // Delete TessBaseAPI handle
    tesseract_ffi_1.default.TessBaseAPIDelete(api);
}
exports.close = close;
function getResultIterator(api) {
    return tesseract_ffi_1.default.TessBaseAPIGetIterator(api);
}
exports.getResultIterator = getResultIterator;
async function getUtf8TextAsync(api) {
    const textPtr = tesseract_ffi_1.default.TessBaseAPIGetUTF8Text(api);
    // There is no need to create a new Buffer because toString copies it
    const str = ref_1.default.reinterpretUntilZeros(textPtr, 1, 0).toString();
    tesseract_ffi_1.default.TessDeleteText(textPtr);
    return str;
}
exports.getUtf8TextAsync = getUtf8TextAsync;
async function reconizeAsync(api) {
    const err = tesseract_ffi_1.default.TessBaseAPIRecognize(api, null);
    if (err) {
        throw new Error('TessBaseAPIRecognize failed');
    }
}
exports.reconizeAsync = reconizeAsync;
async function setImageAsync(api, imageData, width, height, bytesPerPixel, bytesPerLine) {
    // imageData has to be raw image data
    tesseract_ffi_1.default.TessBaseAPISetImage(api, imageData, width, height, bytesPerPixel, bytesPerLine);
}
exports.setImageAsync = setImageAsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzc2VyYWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Rlc3NlcmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUFzQjtBQUN0QixvRUFBc0M7QUFJdEMsU0FBZ0IsSUFBSSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7SUFFckQsNkJBQTZCO0lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzNCLFFBQVEsSUFBSSxHQUFHLENBQUM7S0FDakI7SUFFRCxJQUFJLEdBQUcsR0FBdUIsdUJBQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBRTFELElBQUksWUFBWSxHQUFrQixhQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdELElBQUksWUFBWSxHQUFrQixhQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTdELE1BQU0sR0FBRyxHQUFXLHVCQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUU5RSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLFlBQVksR0FBRyxJQUFJLENBQUM7SUFFcEIsUUFBUTtJQUNSLElBQUksR0FBRyxFQUFFO1FBQ1AsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUMzQztJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQXhCRCxvQkF3QkM7QUFHRCxTQUFnQixLQUFLLENBQUMsR0FBZ0I7SUFFcEMsMEVBQTBFO0lBQzFFLHVFQUF1RTtJQUN2RSxvR0FBb0c7SUFDcEcsdUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBTkQsc0JBTUM7QUFHRCxTQUFnQixLQUFLLENBQUMsR0FBZ0I7SUFFcEMsMEVBQTBFO0lBQzFFLDJEQUEyRDtJQUMzRCx1QkFBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU1Qiw0QkFBNEI7SUFDNUIsdUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBUkQsc0JBUUM7QUFHRCxTQUFnQixpQkFBaUIsQ0FBQyxHQUFnQjtJQUVoRCxPQUFPLHVCQUFPLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUhELDhDQUdDO0FBR00sS0FBSyxVQUFVLGdCQUFnQixDQUFDLEdBQWdCO0lBRXJELE1BQU0sT0FBTyxHQUFXLHVCQUFPLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFNUQscUVBQXFFO0lBQ3JFLE1BQU0sR0FBRyxHQUFHLGFBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRWhFLHVCQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWhDLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVZELDRDQVVDO0FBR00sS0FBSyxVQUFVLGFBQWEsQ0FBQyxHQUFnQjtJQUVsRCxNQUFNLEdBQUcsR0FBVyx1QkFBTyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUU1RCxJQUFJLEdBQUcsRUFBRTtRQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNoRDtBQUNILENBQUM7QUFQRCxzQ0FPQztBQUdNLEtBQUssVUFBVSxhQUFhLENBQ2pDLEdBQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLEtBQWEsRUFDYixNQUFjLEVBQ2QsYUFBcUIsRUFDckIsWUFBb0I7SUFHcEIscUNBQXFDO0lBQ3JDLHVCQUFPLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMxRixDQUFDO0FBWEQsc0NBV0MifQ==