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
Object.defineProperty(exports, "__esModule", { value: true });
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
            res.send(transactionList);
        }
        catch (error) {
            res.status(500).send({ error: 'Server error' });
        }
    }));
    transaction.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const transactionId = req.params.id;
        try {
            const foundAccount = yield trans.findOne({ _id: transactionId });
            if (foundAccount) {
                res.send(foundAccount);
            }
            else {
                res.status(404).send({ error: 'Transaction not found' });
            }
        }
        catch (error) {
            res.status(500).send({ error: 'Server error ' });
        }
    }));
    transaction.post('', (req, res) => {
        const transactions = new trans({
            accountId: req.body.accountId,
            categoryId: req.body.categoryId,
            time: req.body.time,
            description: req.body.description,
            transactionPrize: req.body.transactionPrize,
            isDeposit: req.body.isDeposit,
        });
        transactions.save().then((transactionList) => {
            res.status(201).json({ transactionList });
        });
    });
    transaction.delete('/:id', (req, res) => {
        trans.findOneAndRemove({ _id: req.params.id }).
            then((removedList) => {
            res.send(removedList);
        });
    });
    return transaction;
};
exports.default = transactionRouter;
//# sourceMappingURL=transaction-router.js.map