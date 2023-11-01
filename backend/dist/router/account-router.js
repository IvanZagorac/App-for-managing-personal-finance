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
const accountRouter = function (express, acc) {
    const account = express.Router();
    account.get('', (req, res) => {
        acc.find({})
            .sort({ createdAt: -1 })
            .limit(2)
            .then(accountList => {
            res.send((0, ApiResponse_1.default)({
                error: false,
                status: 303,
                resData: accountList
            }));
        });
    });
    account.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const accountId = req.params.id;
        try {
            const foundAccount = yield acc.findOne({ _id: accountId });
            if (foundAccount) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 304,
                    resData: foundAccount
                }));
            }
            else {
                res.send((0, ApiResponse_1.default)({ error: true, description: 'Account not found', status: 404 }));
            }
        }
        catch (error) {
            res.send((0, ApiResponse_1.default)({ error: true, description: 'Server error founding account', status: 500 }));
        }
    }));
    account.post('', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                totalAmount: { type: 'integer' },
            },
            required: ['name', 'userId', 'totalAmount',],
        };
        const accounts = new acc({
            userId: req.body.userId,
            name: req.body.name,
            totalAmount: req.body.totalAmount,
        });
        const ajv = new ajv_1.default();
        const validate = ajv.compile(schema);
        const valid = validate(accounts);
        if (!valid) {
            const arr = [];
            for (const [key, value] of Object.entries(validate.errors)) {
                arr.push({ var: value.instancePath, message: value.message });
            }
            res.send((0, ApiResponse_1.default)({ error: true, ajvMessage: arr, status: 500 }));
        }
        else {
            accounts.save().then((accList) => {
                res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: accList }));
            });
        }
    }));
    account.delete('/:id', (req, res) => {
        acc.findOneAndRemove({ _id: req.params.id }).
            then((removedList) => {
            res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: removedList }));
        });
    });
    return account;
};
exports.default = accountRouter;
//# sourceMappingURL=account-router.js.map