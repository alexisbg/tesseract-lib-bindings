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
    return new Promise((resolve, reject) => {
        try {
            const textPtr = tesseract_ffi_1.default.TessBaseAPIGetUTF8Text(api);
            // There is no need to create a new Buffer because toString copies it
            resolve(ref_1.default.reinterpretUntilZeros(textPtr, 1, 0).toString());
            tesseract_ffi_1.default.TessDeleteText(textPtr);
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getUtf8TextAsync = getUtf8TextAsync;
async function reconizeAsync(api) {
    return new Promise((resolve, reject) => {
        const err = tesseract_ffi_1.default.TessBaseAPIRecognize(api, null);
        if (err) {
            reject(new Error('TessBaseAPIRecognize failed'));
        }
        else {
            resolve();
        }
    });
}
exports.reconizeAsync = reconizeAsync;
async function setImageAsync(api, imageData, width, height, bytesPerPixel, bytesPerLine) {
    // imageData has to be raw image data
    tesseract_ffi_1.default.TessBaseAPISetImage(api, imageData, width, height, bytesPerPixel, bytesPerLine);
    return new Promise((resolve, reject) => {
        try {
            // imageData has to be raw image data
            tesseract_ffi_1.default.TessBaseAPISetImage(api, imageData, width, height, bytesPerPixel, bytesPerLine);
            resolve();
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.setImageAsync = setImageAsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzc2VyYWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Rlc3NlcmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUFzQjtBQUN0QixvRUFBc0M7QUFJdEMsU0FBZ0IsSUFBSSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7SUFFckQsNkJBQTZCO0lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzNCLFFBQVEsSUFBSSxHQUFHLENBQUM7S0FDakI7SUFFRCxJQUFJLEdBQUcsR0FBdUIsdUJBQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBRTFELElBQUksWUFBWSxHQUFrQixhQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdELElBQUksWUFBWSxHQUFrQixhQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTdELE1BQU0sR0FBRyxHQUFXLHVCQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUU5RSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLFlBQVksR0FBRyxJQUFJLENBQUM7SUFFcEIsUUFBUTtJQUNSLElBQUksR0FBRyxFQUFFO1FBQ1AsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUMzQztJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQXhCRCxvQkF3QkM7QUFHRCxTQUFnQixLQUFLLENBQUMsR0FBZ0I7SUFFcEMsMEVBQTBFO0lBQzFFLHVFQUF1RTtJQUN2RSxvR0FBb0c7SUFDcEcsdUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBTkQsc0JBTUM7QUFHRCxTQUFnQixLQUFLLENBQUMsR0FBZ0I7SUFFcEMsMEVBQTBFO0lBQzFFLDJEQUEyRDtJQUMzRCx1QkFBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU1Qiw0QkFBNEI7SUFDNUIsdUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBUkQsc0JBUUM7QUFHRCxTQUFnQixpQkFBaUIsQ0FBQyxHQUFnQjtJQUVoRCxPQUFPLHVCQUFPLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUhELDhDQUdDO0FBR00sS0FBSyxVQUFVLGdCQUFnQixDQUFDLEdBQWdCO0lBRXJELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFckMsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFXLHVCQUFPLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFNUQscUVBQXFFO1lBQ3JFLE9BQU8sQ0FBQyxhQUFHLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRTdELHVCQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFDWixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDZjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWhCRCw0Q0FnQkM7QUFHTSxLQUFLLFVBQVUsYUFBYSxDQUFDLEdBQWdCO0lBRWxELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFckMsTUFBTSxHQUFHLEdBQVcsdUJBQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFNUQsSUFBSSxHQUFHLEVBQUU7WUFDUCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO2FBQ0k7WUFDSCxPQUFPLEVBQUUsQ0FBQztTQUNYO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBYkQsc0NBYUM7QUFHTSxLQUFLLFVBQVUsYUFBYSxDQUNqQyxHQUFnQixFQUNoQixTQUFpQixFQUNqQixLQUFhLEVBQ2IsTUFBYyxFQUNkLGFBQXFCLEVBQ3JCLFlBQW9CO0lBR3BCLHFDQUFxQztJQUNyQyx1QkFBTyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFeEYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUVyQyxJQUFJO1lBQ0YscUNBQXFDO1lBQ3JDLHVCQUFPLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUV4RixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFDWixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDZjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXhCRCxzQ0F3QkMifQ==