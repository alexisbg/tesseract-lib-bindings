"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = __importDefault(require("ref"));
const tesseract_ffi_1 = __importDefault(require("./tesseract-ffi"));
// Levels
exports.RIL_BLOCK = 0;
exports.RIL_PARA = 1;
exports.RIL_TEXTLINE = 2;
exports.RIL_WORD = 3;
exports.RIL_SYMBOL = 4;
function getBoundingBox(iterator, level) {
    let leftBuff = ref_1.default.alloc('int');
    let topBuff = ref_1.default.alloc('int');
    let rightBuff = ref_1.default.alloc('int');
    let bottomBuff = ref_1.default.alloc('int');
    const ret = tesseract_ffi_1.default.TessPageIteratorBoundingBox(iterator, level, leftBuff, topBuff, rightBuff, bottomBuff);
    if (ret) {
        const out = {
            left: ref_1.default.deref(leftBuff),
            top: ref_1.default.deref(topBuff),
            right: ref_1.default.deref(rightBuff),
            bottom: ref_1.default.deref(bottomBuff),
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
exports.getBoundingBox = getBoundingBox;
function getConfidence(iterator, level) {
    return tesseract_ffi_1.default.TessResultIteratorConfidence(iterator, level);
}
exports.getConfidence = getConfidence;
function getUtf8Text(iterator, level) {
    const textPtr = tesseract_ffi_1.default.TessResultIteratorGetUTF8Text(iterator, level);
    const str = ref_1.default.reinterpretUntilZeros(textPtr, 1, 0).toString();
    tesseract_ffi_1.default.TessDeleteText(textPtr);
    return str;
}
exports.getUtf8Text = getUtf8Text;
function next(iterator, level) {
    return tesseract_ffi_1.default.TessResultIteratorNext(iterator, level) ? true : false;
}
exports.next = next;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdWx0LWl0ZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Jlc3VsdC1pdGVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUFzQjtBQUV0QixvRUFBOEQ7QUFXOUQsU0FBUztBQUNJLFFBQUEsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNkLFFBQUEsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNiLFFBQUEsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFBLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDYixRQUFBLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFJNUIsU0FBZ0IsY0FBYyxDQUFDLFFBQTRCLEVBQUUsS0FBYTtJQUV4RSxJQUFJLFFBQVEsR0FBa0IsYUFBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxJQUFJLE9BQU8sR0FBa0IsYUFBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxJQUFJLFNBQVMsR0FBa0IsYUFBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxJQUFJLFVBQVUsR0FBa0IsYUFBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqRCxNQUFNLEdBQUcsR0FBRyx1QkFBTyxDQUFDLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFM0csSUFBSSxHQUFHLEVBQUU7UUFDUCxNQUFNLEdBQUcsR0FBZ0I7WUFDdkIsSUFBSSxFQUFFLGFBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1lBQ3pCLEdBQUcsRUFBRSxhQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUN2QixLQUFLLEVBQUUsYUFBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDM0IsTUFBTSxFQUFFLGFBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1NBQzlCLENBQUM7UUFFRixRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDZixTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFbEIsT0FBTyxHQUFHLENBQUM7S0FDWjtTQUNJO1FBQ0gsT0FBTyxJQUFJLENBQUM7S0FDYjtBQUNILENBQUM7QUEzQkQsd0NBMkJDO0FBR0QsU0FBZ0IsYUFBYSxDQUFDLFFBQTRCLEVBQUUsS0FBYTtJQUV2RSxPQUFPLHVCQUFPLENBQUMsNEJBQTRCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFIRCxzQ0FHQztBQUdELFNBQWdCLFdBQVcsQ0FBQyxRQUE0QixFQUFFLEtBQWE7SUFFckUsTUFBTSxPQUFPLEdBQVcsdUJBQU8sQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFL0UsTUFBTSxHQUFHLEdBQVcsYUFBRyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFeEUsdUJBQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFaEMsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBVEQsa0NBU0M7QUFHRCxTQUFnQixJQUFJLENBQUMsUUFBNEIsRUFBRSxLQUFhO0lBRTlELE9BQU8sdUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3hFLENBQUM7QUFIRCxvQkFHQyJ9