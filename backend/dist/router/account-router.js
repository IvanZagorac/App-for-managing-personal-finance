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
            .then(accountList => {
            res.send(accountList);
        });
    });
    account.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const accountId = req.params.id;
        try {
            const foundAccount = yield acc.findOne({ _id: accountId });
            if (foundAccount) {
                res.send(foundAccount);
            }
            else {
                res.status(404).send({ error: 'Account not found' });
            }
        }
        catch (error) {
            res.status(500).send({ error: 'Server error ' });
        }
    }));
    account.post('', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                userId: { type: 'string' },
                totalAmount: { type: 'integer' },
            },
            required: ['name', 'userId', 'totalAmount',],
        };
        let data = yield acc.findOne({});
        // const userId = req.body.userId;
        // const name = req.body.name;
        // const totalAmount = req.body.totalAmount;
        // const accounts = new acc({
        //     userId,
        //     name,
        //     totalAmount
        // });
        data = {
            userId: req.body.userId,
            name: req.body.name,
            ctotalAmount: req.body.totalAmount,
        };
        const ajv = new ajv_1.default();
        const validate = ajv.compile(schema);
        const valid = validate(data);
        if (!valid) {
            res.send((0, ApiResponse_1.default)({ error: true, description: `Validation error ${validate.errors}`, status: 500 }));
        }
        yield acc.findOneAndUpdate({ $set: data }).
            then(accList => {
            res.send((0, ApiResponse_1.default)({ error: false, description: 'OK', status: 200 })).json({ accList });
        });
        // accounts.save().then((accountList)=>
        // {
        //     res.status(201).json({ accountList });
        // })
    }));
    account.delete('/:id', (req, res) => {
        acc.findOneAndRemove({ _id: req.params.id }).
            then((removedList) => {
            res.send(removedList);
        });
    });
    return account;
};
exports.default = accountRouter;
//# sourceMappingURL=account-router.js.map