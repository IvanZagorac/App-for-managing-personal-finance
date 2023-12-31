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
const categoryRouter = function (express, cat, trans) {
    const category = express.Router();
    category.get('/filterDeposit', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.currentPage, 10) || 1;
            const userId = req.query.userId;
            const perPage = 10;
            const totalCount = yield cat
                .find({ isDeposit: req.query.filterIsDeposit, userId }).countDocuments();
            const allCategories = yield cat
                .find({ isDeposit: req.query.filterIsDeposit, userId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage);
            if (allCategories.length != 0) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 200,
                    resData: allCategories,
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
        catch (e) {
            throw new Error(e);
        }
    }));
    category.get('', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.query.userId;
            const allCategories = yield cat.find({ userId }).sort({ createdAt: -1 });
            if (allCategories.length != 0) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 200,
                    resData: allCategories
                }));
            }
            else {
                res.send((0, ApiResponse_1.default)({
                    error: true,
                    status: 404,
                    description: 'No data found'
                }));
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }));
    category.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const categoryId = req.params.id;
        try {
            const foundAccount = yield cat.findOne({ _id: categoryId });
            if (foundAccount) {
                res.send((0, ApiResponse_1.default)({
                    error: false,
                    status: 200,
                    resData: foundAccount
                }));
            }
            else {
                res.send((0, ApiResponse_1.default)({
                    error: true,
                    status: 404,
                    description: 'Category not found'
                }));
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }));
    category.post('', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const schema = {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        minLength: 4,
                    },
                    isDeposit: { type: 'boolean' },
                    userId: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string', pattern: '^[a-f\\d]{24}$' },
                        },
                    },
                },
                required: ['name', 'isDeposit', 'userId']
            };
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
            req.body.userId = new mongodb_1.BSON.ObjectId(req.body.userId);
            const categories = {
                name: req.body.name,
                isDeposit: req.body.isDeposit,
                userId: req.body.userId
            };
            const options = {
                new: true,
                upsert: true,
            };
            const ajv = new ajv_1.default();
            const validate = ajv.compile(schema);
            const valid = validate(categories);
            if (!valid) {
                const arr = [];
                for (const [key, value] of Object.entries(validate.errors)) {
                    arr.push({ var: value.instancePath, message: value.message });
                }
                res.send((0, ApiResponse_1.default)({ error: true, ajvMessage: arr, status: 500 }));
            }
            else {
                const catList = yield cat.updateOne(filter, { $set: categories }, options);
                res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: catList }));
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }));
    category.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const transactionList = yield trans.find({ categoryId: req.params.id });
            if (transactionList.length == 0) {
                const removedList = yield cat.findOneAndRemove({ _id: req.params.id });
                res.send((0, ApiResponse_1.default)({ error: false, status: 200, resData: removedList }));
            }
            else {
                res.send((0, ApiResponse_1.default)({ error: true, status: 409, description: 'Cannot remove category which is used for transaction' }));
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }));
    return category;
};
exports.default = categoryRouter;
//# sourceMappingURL=category-router.js.map