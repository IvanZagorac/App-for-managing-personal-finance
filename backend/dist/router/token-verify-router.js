"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const tokenVerifyRouter = (express) => {
    const tokenVerify = express.Router();
    tokenVerify.get('', (req, res) => {
        const token = req.body.token || req.params.token || req.headers['x-access-token'] || req.body.query;
        if (token) {
            jsonwebtoken_1.default.verify(token, config_1.config.secret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Wrong token'
                    });
                }
                else {
                    res.send({
                        succes: true,
                        decodedToken: decoded,
                    });
                    // req.decoded=decoded;
                }
            });
        }
        else {
            return res.status(403).send({
                success: false,
                message: 'Token does not exist'
            });
        }
    });
    return tokenVerify;
};
exports.default = tokenVerifyRouter;
//# sourceMappingURL=token-verify-router.js.map