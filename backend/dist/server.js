"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.set('debug', true);
const express_2 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const transaction_1 = __importDefault(require("./schema/transaction"));
const user_1 = __importDefault(require("./schema/user"));
const category_1 = __importDefault(require("./schema/category"));
const account_1 = __importDefault(require("./schema/account"));
const auth_router_1 = __importDefault(require("./router/auth-router"));
const account_router_1 = __importDefault(require("./router/account-router"));
const transaction_router_1 = __importDefault(require("./router/transaction-router"));
const category_router_1 = __importDefault(require("./router/category-router"));
const mongooseUrl = process.env.MONGO_URI || config_1.config.pool;
const init = () => {
    try {
        const a = config_1.config;
        mongoose_1.default.connect(mongooseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
        }).then(() => {
            console.log('Connected to MongoDB');
        }).catch((err) => {
            console.error('Problem connecting to MongoDB', err);
        });
        initServer();
    }
    catch (e) {
        console.log(e);
        console.error('Problem connecting to database');
    }
};
const initServer = () => {
    app.use(express_2.default.urlencoded({ extended: true }));
    app.use(express_2.default.json());
    app.use(express_1.default.static(path_1.default.join(__dirname + './frontend/build')));
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST,DELETE,PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
        next();
    });
    app.use((0, morgan_1.default)('dev'));
    app.use('/auth', (0, auth_router_1.default)(express_1.default, user_1.default));
    app.use('/account', (0, account_router_1.default)(express_1.default, account_1.default));
    app.use('/transaction', (0, transaction_router_1.default)(express_1.default, transaction_1.default));
    app.use('/category', (0, category_router_1.default)(express_1.default, category_1.default));
    app.listen(config_1.config.port);
    console.log('Running on port ' + config_1.config.port);
};
init();
//# sourceMappingURL=server.js.map