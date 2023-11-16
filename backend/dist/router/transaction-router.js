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
const mongodb_1 = require("mongodb");
const transactionRouter = function (express, trans) {
    const transaction = express.Router();
    transaction.get('', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.currentPage, 10) || 1;
            const accountId = req.query.aId;
            const aId = new mongodb_1.BSON.ObjectId(accountId);
            const perPage = 10;
            const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
            const query = {
                accountId: aId,
            };
            if (startDate) {
                query.time = {};
                query.time.$gte = startDate;
            }
            if (endDate) {
                endDate.setHours(23, 59, 59, 999);
                query.time.$lte = endDate;
            }
            const allTransactions = yield trans.find(query)
                .populate('categoryId');
            const totalCount = allTransactions.length;
            const transactionList = yield trans.find(query)
                .sort({ time: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate('categoryId')
                .populate('accountId');
            if (transactionList.length != 0) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 200,
                    resData: { transactionList, allTransactions },
                    totalCount
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
        catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).send((0, ApiResponse_1.default)({
                error: true,
                status: 500,
                description: 'Internal Server Error',
            }));
        }
    }));
    transaction.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const transactionId = req.params.id;
        try {
            const foundTransaction = yield trans.findOne({ _id: transactionId })
                .populate('categoryId');
            if (foundTransaction) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 200,
                    resData: foundTransaction
                }));
            }
            else {
                res.send((0, ApiResponse_1.default)({ error: true, description: 'Transaction not found', status: 404 }));
            }
        }
        catch (error) {
            console.error('Error fetching transactions by id:', error);
            res.status(500).send((0, ApiResponse_1.default)({
                error: true,
                status: 500,
                description: 'Internal Server Error',
            }));
        }
    }));
    transaction.post('', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
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
                    description: {
                        type: 'string',
                        minLength: 4,
                    },
                    transactionPrize: { type: 'number' },
                    isDeposit: { type: 'boolean' },
                },
                required: ['accountId', 'categoryId', 'description', 'transactionPrize', 'isDeposit']
            };
            req.body.accountId = new mongodb_1.BSON.ObjectId(req.body.accountId);
            req.body.transactionPrize = parseFloat(req.body.transactionPrize);
            let isTrPrizePositive = false;
            if (req.body.transactionPrize > 0) {
                isTrPrizePositive = true;
            }
            let filter = {};
            if (req.body._id) {
                filter = {
                    _id: req.body._id,
                };
            }
            else {
                filter = {
                    _id: new mongodb_1.BSON.ObjectId(),
                };
            }
            const transactions = {
                accountId: req.body.accountId,
                categoryId: req.body.categoryId ? new mongodb_1.BSON.ObjectId(req.body.categoryId) : req.body.categoryId,
                time: req.body.time ? req.body.time : Date.now().toString(),
                description: req.body.description,
                transactionPrize: req.body.transactionPrize,
                isDeposit: req.body.isDeposit,
            };
            const options = {
                new: true,
                upsert: true,
            };
            const ajv = new ajv_1.default();
            const validate = ajv.compile(schema);
            const valid = validate(transactions);
            const arr = [];
            if (isTrPrizePositive) {
                if (!valid) {
                    for (const [key, value] of Object.entries(validate.errors)) {
                        arr.push({ var: value.instancePath, message: value.message });
                    }
                    res.send((0, ApiResponse_1.default)({ error: true, ajvMessage: arr, status: 500 }));
                }
                else {
                    const transList = yield trans.updateOne(filter, { $set: transactions }, options);
                    res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: transList }));
                }
            }
            else {
                arr.push({ var: 'Transaction prize', message: 'must NOT be zero or negative number' });
                res.send((0, ApiResponse_1.default)({ error: true, ajvMessage: arr, status: 500 }));
            }
        }
        catch (e) {
            console.error('Error posting transactions:', e);
            res.status(500).send((0, ApiResponse_1.default)({
                error: true,
                status: 500,
                description: 'Internal Server Error',
            }));
        }
    }));
    transaction.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const removedList = yield trans.findOneAndRemove({ _id: req.params.id });
            res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: removedList }));
        }
        catch (e) {
            console.error('Error deleting transactions:', e);
            res.status(500).send((0, ApiResponse_1.default)({
                error: true,
                status: 500,
                description: 'Internal Server Error',
            }));
        }
    }));
    return transaction;
};
exports.default = transactionRouter;
//# sourceMappingURL=transaction-router.js.map