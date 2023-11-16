"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Accounts'
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    time: { type: Date, default: Date.now },
    description: String,
    transactionPrize: {
        type: mongoose_1.default.Types.Decimal128,
        get: getTrPrize
    },
    isDeposit: Boolean,
}, { toJSON: { getters: true } });
function getTrPrize(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString()).toFixed(2);
    }
    return value;
}
;
exports.default = mongoose_1.default.model('Transactions', transactionSchema);
//# sourceMappingURL=transaction.js.map