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
const categoryRouter = function (express, cat) {
    const category = express.Router();
    category.get('', (req, res) => {
        cat.find({})
            .sort({ createdAt: -1 })
            .then(categoryList => {
            res.send(categoryList);
        });
    });
    category.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const categoryId = req.params.id;
        try {
            const foundAccount = yield cat.findOne({ _id: categoryId });
            if (foundAccount) {
                res.send(foundAccount);
            }
            else {
                res.status(404).send({ error: 'Catgory not found' });
            }
        }
        catch (error) {
            res.status(500).send({ error: 'Server error ' });
        }
    }));
    category.post('', (req, res) => {
        const categories = new cat({
            name: req.body.name,
            isDeposit: req.body.isDeposit,
        });
        categories.save().then((categoryList) => {
            res.status(201).json({ categoryList });
        });
    });
    category.delete('/:id', (req, res) => {
        cat.findOneAndRemove({ _id: req.params.id }).
            then((removedList) => {
            res.send(removedList);
        });
    });
    return category;
};
exports.default = categoryRouter;
//# sourceMappingURL=category-router.js.map