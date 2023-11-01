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
    totalAmount: Number
});
exports.default = mongoose_1.default.model('Accounts', accountSchema);
//# sourceMappingURL=account.js.map