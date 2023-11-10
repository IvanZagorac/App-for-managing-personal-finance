import  express from 'express';
import morgan from 'morgan';
import  mongoose, {ConnectOptions}  from 'mongoose';
import  { config } from './config/config';
mongoose.set('strictQuery', true);
mongoose.set('debug', true);
import  bodyParser from 'express';
import path from 'path';

const app = express();
import transaction from './schema/transaction';
import user from './schema/user';
import category from './schema/category';
import account from './schema/account';

import authRouter from './router/auth-router';
import accountRouter from './router/account-router';
import  transactionRouter from './router/transaction-router';
import categoryRouter from './router/category-router';
const mongooseUrl = process.env.MONGO_URI || config.pool;


const init = () =>
{

    try
    {
        const a = config;
        mongoose.connect(mongooseUrl,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
        } as ConnectOptions).then(() =>
        {
            console.log('Connected to MongoDB');
        }).catch((err) =>
        {
            console.error('Problem connecting to MongoDB', err);
        });

        initServer();
    }
    catch (e)
    {
        console.log(e)
        console.error('Problem connecting to database');
    }


};

const initServer = () =>
{

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.static(__dirname + '/public'));

    app.use(function (req, res, next)
    {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST,DELETE,PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
        next();
    });

    app.use(morgan('dev'));

    app.use('/auth', authRouter(express, user));
    app.use('/account', accountRouter(express, account));
    app.use('/transaction', transactionRouter(express, transaction));
    app.use('/category', categoryRouter(express, category));

    app.get('*', function (req, res)
    {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    });

    app.listen(config.port);

    console.log('Running on port ' + config.port);
};

init()