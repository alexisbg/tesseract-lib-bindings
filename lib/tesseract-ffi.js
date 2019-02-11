"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ffi_1 = __importDefault(require("ffi"));
const path_1 = __importDefault(require("path"));
const ref_1 = __importDefault(require("ref"));
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
libPath = path_1.default.resolve(__dirname, libPath);
// tessdata path
// const tessdataPath = path.resolve(__dirname, '../tesseract/tessdata') + '/'; // Has to end with /
// Types
const charPtr = ref_1.default.refType('char');
const intPtr = ref_1.default.refType('int');
const ucharPtr = ref_1.default.refType('uchar');
const voidPtr = ref_1.default.refType(ref_1.default.types.void);
const TessBaseAPI = voidPtr;
const TessBaseAPIPtr = ref_1.default.refType(TessBaseAPI);
const TessPageIterator = voidPtr;
const TessPageIteratorPtr = ref_1.default.refType(TessPageIterator);
const TessResultIteratorPtr = TessPageIteratorPtr;
// Bindings of useful functions
/* eslint-disable key-spacing */
exports.default = ffi_1.default.Library(libPath, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzc2VyYWN0LWZmaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXNzZXJhY3QtZmZpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXNCO0FBQ3RCLGdEQUF3QjtBQUN4Qiw4Q0FBZ0M7QUFzRGhDLGdEQUFnRDtBQUdoRCxpQ0FBaUM7QUFDakMsSUFBSSxPQUFPLEdBQWtCLElBQUksQ0FBQztBQUVsQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO0lBQ2hDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDMUIsT0FBTyxHQUFHLGtDQUFrQyxDQUFDO0tBQzlDO1NBQ0k7UUFDSCxPQUFPLEdBQUcsa0NBQWtDLENBQUM7S0FDOUM7Q0FDRjtLQUNJLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7SUFDckMsT0FBTyxHQUFHLHdDQUF3QyxDQUFDO0NBQ3BEO0FBQ0QsNENBQTRDO0FBQzVDLHFEQUFxRDtBQUNyRCxJQUFJO0tBQ0M7SUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUMvRDtBQUVELE9BQU8sR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUUzQyxnQkFBZ0I7QUFDaEIsb0dBQW9HO0FBR3BHLFFBQVE7QUFDUixNQUFNLE9BQU8sR0FBUyxhQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLE1BQU0sTUFBTSxHQUFTLGFBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsTUFBTSxRQUFRLEdBQVMsYUFBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxNQUFNLE9BQU8sR0FBUyxhQUFHLENBQUMsT0FBTyxDQUFDLGFBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFbEQsTUFBTSxXQUFXLEdBQVMsT0FBTyxDQUFDO0FBQ2xDLE1BQU0sY0FBYyxHQUFTLGFBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdEQsTUFBTSxnQkFBZ0IsR0FBUyxPQUFPLENBQUM7QUFDdkMsTUFBTSxtQkFBbUIsR0FBUyxhQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDaEUsTUFBTSxxQkFBcUIsR0FBUyxtQkFBbUIsQ0FBQztBQUd4RCwrQkFBK0I7QUFDL0IsZ0NBQWdDO0FBQ2hDLGtCQUFlLGFBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO0lBQ2xDLGlCQUFpQixFQUFlLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQztJQUNwRCxnQkFBZ0IsRUFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMxRCxpQkFBaUIsRUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzFELGNBQWMsRUFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMxRCxzQkFBc0IsRUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN4RSxzQkFBc0IsRUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDekUsZ0JBQWdCLEVBQWdCLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RSxvQkFBb0IsRUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRSxtQkFBbUIsRUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTdHLGNBQWMsRUFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFaEUsMkJBQTJCLEVBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckcsNEJBQTRCLEVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RSw2QkFBNkIsRUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLHNCQUFzQixFQUFVLENBQUMsS0FBSyxFQUFFLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7Q0FDeEUsQ0FBc0IsQ0FBQztBQUN4QiwrQkFBK0IifQ==