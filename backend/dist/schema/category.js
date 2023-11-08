"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: String,
    isDeposit: Boolean,
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: {
        type: Date,
        default: Date.now // Set the default value to the current date and time
    }
});
exports.default = mongoose_1.default.model('Categories', categorySchema);
//# sourceMappingURL=category.js.map