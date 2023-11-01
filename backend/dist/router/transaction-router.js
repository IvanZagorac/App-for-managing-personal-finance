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
const ApiResponse_1 = __importDefault(require("../config/ApiResponse"));
const ajv_1 = __importDefault(require("ajv"));
const transactionRouter = function (express, trans) {
    const transaction = express.Router();
    transaction.get('', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const page = parseInt(req.query.page) || 1;
        const perPage = 15;
        try {
            const transactionList = yield trans.find({})
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage);
            res.send((0, ApiResponse_1.default)({
                error: false,
                status: 310,
                resData: transactionList
            }));
        }
        catch (error) {
            res.send((0, ApiResponse_1.default)({
                error: true,
                status: 500,
                description: 'Error getting transaction list'
            }));
        }
    }));
    transaction.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const transactionId = req.params.id;
        try {
            const foundTransaction = yield trans.findOne({ _id: transactionId });
            if (foundTransaction) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 311,
                    resData: foundTransaction
                }));
            }
            else {
                res.send((0, ApiResponse_1.default)({ error: true, description: 'Transaction not found', status: 404 }));
            }
        }
        catch (error) {
            res.send((0, ApiResponse_1.default)({ error: true, description: 'Server error finding one transaction', status: 500 }));
        }
    }));
    transaction.post('', (req, res) => {
        const schema = {
            type: 'object',
            properties: {
                accountId: {
                    type: 'object',
                    properties: {
                        accountId: { type: 'string', pattern: '^[a-f\\d]{24}$' },
                    },
                },
                categoryId: {
                    type: 'object',
                    properties: {
                        categoryId: { type: 'string', pattern: '^[a-f\\d]{24}$' },
                    },
                },
                time: {
                    type: 'date',
                },
                description: {
                    type: 'string',
                    minLength: 4,
                },
                transactionPrize: { type: 'integer' },
                isDeposit: { type: 'boolean' },
            },
            required: ['accountId', 'categoryId', 'time', 'description', 'transactionPrize', 'isDeposit']
        };
        const transactions = new trans({
            accountId: req.body.accountId,
            categoryId: req.body.categoryId,
            time: req.body.time,
            description: req.body.description,
            transactionPrize: req.body.transactionPrize,
            isDeposit: req.body.isDeposit,
        });
        const ajv = new ajv_1.default();
        const validate = ajv.compile(schema);
        const valid = validate(transactions);
        if (!valid) {
            const arr = [];
            for (const [key, value] of Object.entries(validate.errors)) {
                arr.push({ var: value.instancePath, message: value.message });
            }
            res.send((0, ApiResponse_1.default)({ error: true, ajvMessage: arr, status: 500 }));
        }
        else {
            transactions.save().then((transList) => {
                res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: transList }));
            });
        }
    });
    transaction.delete('/:id', (req, res) => {
        trans.findOneAndRemove({ _id: req.params.id }).
            then((removedList) => {
            res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: removedList }));
        });
    });
    return transaction;
};
exports.default = transactionRouter;
//# sourceMappingURL=transaction-router.js.map