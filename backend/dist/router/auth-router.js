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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const ApiResponse_1 = __importDefault(require("../config/ApiResponse"));
const authRouter = function (express, User) {
    const auth = express.Router();
    auth.post('/login', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield User.find({
                    email: req.body.email
                });
                if (rows.length == 0) {
                    res.send((0, ApiResponse_1.default)({ error: true, description: 'Email doesnt exist', status: 401 }));
                }
                else {
                    const validPass = yield bcrypt_1.default.compare(req.body.password, rows[0].password);
                    if (rows.length > 0 && validPass) {
                        const token = jsonwebtoken_1.default.sign({
                            email: rows[0].email,
                            _id: rows[0]._id,
                            fullName: rows[0].fullName,
                        }, config_1.config.secret, {
                            expiresIn: '6h'
                        });
                        // eslint-disable-next-line max-len
                        res.send((0, ApiResponse_1.default)({
                            error: false,
                            status: 200,
                            resData: { token, user: { email: rows[0].email, _id: rows[0]._id } }
                        }));
                    }
                    if (!validPass) {
                        res.send((0, ApiResponse_1.default)({ error: true, description: 'Wrong password', status: 401 }));
                    }
                }
            }
            catch (e) {
                res.send((0, ApiResponse_1.default)({ error: true, description: 'PROBLEM WITH LOGIN', status: 401 }));
            }
        });
    });
    auth.post('/register', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
            if (!hashedPassword) {
                res.send((0, ApiResponse_1.default)({ error: true, description: 'Cannot hashed password', status: 301 }));
            }
            const email = req.body.email;
            const fullName = req.body.fullName;
            const token = jsonwebtoken_1.default.sign({
                email,
                fullName,
            }, config_1.config.secret, {
                expiresIn: '6h',
            });
            if (!token) {
                res.send((0, ApiResponse_1.default)({ error: true, description: 'Token does not exists', status: 302 }));
            }
            const newUser = new User({
                email,
                fullName,
                password: hashedPassword
            });
            newUser.save().then(users => {
                res.send((0, ApiResponse_1.default)({ error: false, status: 205 }), { token, user: users });
            });
        });
    });
    return auth;
};
exports.default = authRouter;
//# sourceMappingURL=auth-router.js.map