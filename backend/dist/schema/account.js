"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accountSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String,
    },
    totalAmount: {
        type: mongoose_1.default.Types.Decimal128,
        get: getTotalAmount
    },
}, { toJSON: { getters: true } });
function getTotalAmount(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString()).toFixed(2);
    }
    return value;
}
;
accountSchema.index({ userId: 1, name: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Accounts', accountSchema);
//# sourceMappingURL=account.js.map