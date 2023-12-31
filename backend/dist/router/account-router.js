"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ApiResponse_1 = __importDefault(require("../config/ApiResponse"));
const mongodb_1 = require("mongodb");
const accountRouter = function (express, acc) {
    const account = express.Router();
    account.get('', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.query.userId;
            const accounts = yield acc.find({ userId }).sort({ createdAt: -1 });
            if (accounts.length != 0) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 200,
                    resData: accounts
                }));
            }
            else {
                res.send((0, ApiResponse_1.default)({
                    error: true,
                    status: 404,
                    description: 'Data not found'
                }));
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }));
    account.patch('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const accountId = req.params.id;
            const accounts = yield acc.findOneAndUpdate({ _id: accountId }, { $set: { totalAmount: req.body.totalAm } });
            res.send((0, ApiResponse_1.default)({
                error: false,
                status: 200,
                resData: accounts
            }));
        }
        catch (e) {
            throw new Error(e);
        }
    }));
    account.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const accountId = req.params.id;
        try {
            const foundAccount = yield acc.findOne({ _id: accountId });
            if (foundAccount) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 200,
                    resData: foundAccount
                }));
            }
            else {
                res.send((0, ApiResponse_1.default)({ error: true, description: 'Account not found', status: 404 }));
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }));
    account.post('', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const schema = {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        minLength: 4,
                    },
                    userId: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string', pattern: '^[a-f\\d]{24}$' },
                        },
                    },
                    totalAmount: { type: 'number' },
                },
                required: ['name', 'userId', 'totalAmount',],
            };
            req.body.userId = new mongodb_1.BSON.ObjectId(req.body.userId);
            req.body.totalAmount = parseFloat(req.body.totalAmount);
            const accounts = {
                userId: req.body.userId,
                name: req.body.name,
                totalAmount: req.body.totalAmount,
            };
            const ajv = new ajv_1.default();
            const validate = ajv.compile(schema);
            const valid = validate(accounts);
            const nid = new mongodb_1.BSON.ObjectId(req.body.userId);
            const findByUserId = yield acc.find({ userId: nid });
            const arr = [];
            let existsTwoAcc = false;
            if (Object.keys(findByUserId).length >= 2) {
                arr.push({ var: 'An account', message: 'must NOT have more than 2 accounts' });
                existsTwoAcc = true;
            }
            if (existsTwoAcc) {
                res.send((0, ApiResponse_1.default)({ error: true, ajvMessage: arr, status: 500 }));
                return;
            }
            if (!valid) {
                for (const [key, value] of Object.entries(validate.errors)) {
                    arr.push({ var: value.instancePath, message: value.message });
                }
                res.send((0, ApiResponse_1.default)({ error: true, ajvMessage: arr, status: 500 }));
            }
            else {
                const existAcc = yield acc.findOne({ userId: req.body.userId, name: req.body.name });
                if (existAcc) {
                    // eslint-disable-next-line max-len
                    res.send((0, ApiResponse_1.default)({ error: true, description: 'An account with the same name and user already exists.', status: 500 }));
                }
                else {
                    // No existing account found, save the new account
                    const accs = yield acc.create(accounts);
                    res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: accs }));
                }
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }));
    account.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const removedList = yield acc.findOneAndRemove({ _id: req.params.id });
            res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: removedList }));
        }
        catch (e) {
            throw new Error(e);
        }
    }));
    return account;
};
exports.default = accountRouter;
//# sourceMappingURL=account-router.js.map