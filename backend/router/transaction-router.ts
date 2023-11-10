import { Router, Request, Response } from 'express';
import ApiResponse from '../config/ApiResponse';
import Ajv from 'ajv';
import { BSON } from 'mongodb';

type QueryObject = {
    accountId: Object;
    time?: {
        $gte?: Date;
        $lte?: Date;
    };
};

const transactionRouter = function(express,trans):Router
{
    const transaction = express.Router();

    transaction.get('',async (req,res)=>
    {
    
        try
        {
            const page = parseInt(req.query.currentPage,10) || 1; 
            const accountId = req.query.aId;
            const aId = new BSON.ObjectId(accountId);
            const perPage = 10;
            const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
            const query:QueryObject = {
                accountId: aId,
            }
    
            if (startDate) 
            {
                query.time={}
                query.time.$gte = startDate;
            }
            if (endDate) 
            {
                endDate.setHours(23, 59, 59, 999);
                query.time.$lte = endDate;
            }
            const allTransactions = await trans.find(query)
                .populate('categoryId');
            const totalCount = allTransactions.length;
            const transactionList = await trans.find(query)
                .sort({ time: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate('categoryId')
                .populate('accountId')

            if (transactionList.length != 0)
            {
                res.send
                (
                    ApiResponse({
                        error: false,
                        status: 200, 
                        resData:{transactionList, allTransactions},
                        totalCount
                    })
                )
            }
            else
            {
                res.send
                (
                    ApiResponse({
                        error: true,
                        status: 404, 
                        description:'Data not found'
                    })
                )
                   
            }

        }
        catch (error)
        {
            console.error('Error fetching transactions:', error);
            res.status(500).send(ApiResponse({
                error: true,
                status: 500,
                description: 'Internal Server Error',
            }));
        }
    })


    transaction.get('/:id',async (req,res)=>
    {
        const transactionId = req.params.id;
        try
        {
            const foundTransaction = await trans.findOne({_id: transactionId})
                .populate('categories');

            if (foundTransaction)
            {
                res.send
                (
                    ApiResponse({
                        error: false,
                        status: 200, 
                        resData:foundTransaction
                    })
                )
            }
            else
            {
                res.send(ApiResponse({error: true, description: 'Transaction not found', status: 404}));
            }
        }
        catch (error)
        {
            console.error('Error fetching transactions by id:', error);
            res.status(500).send(ApiResponse({
                error: true,
                status: 500,
                description: 'Internal Server Error',
            }));
        }
    })

    transaction.post('', async(req,res) =>
    {

        try
        {
            const schema = {
                type: 'object',
                properties: {
                    accountId: {
                        type: 'object',
                        properties: {
                            accountId: {type: 'string', pattern: '^[a-f\\d]{24}$'},
                        },
                    },
                    categoryId: {
                        type: 'object',
                        properties: {
                            categoryId: {type: 'string', pattern: '^[a-f\\d]{24}$'},
                        },
                    },
                    description: { 
                        type:'string',
                        minLength:4,
                    },
                    transactionPrize: { type: 'integer' },
                    isDeposit: { type: 'boolean' },
                  
                },
                required: ['accountId', 'categoryId', 'description', 'transactionPrize', 'isDeposit']
            };
    
            req.body.accountId = new BSON.ObjectId(req.body.accountId);
            req.body.transactionPrize = parseInt(req.body.transactionPrize,10);
            let isTrPrizePositive = false;
    
            if (req.body.transactionPrize > 0)
            {
                isTrPrizePositive = true;
            }
    
            let filter={};
            if (req.body._id)
            {
                filter = {
                    _id:req.body._id,
                };
            }
            else
            {
                filter = {
                    _id:new BSON.ObjectId(),
                };
                
            }
    
            const transactions = {
                accountId:req.body.accountId,
                categoryId:req.body.categoryId ? new BSON.ObjectId(req.body.categoryId) : req.body.categoryId,
                time: req.body.time ? req.body.time : Date.now().toString(),
                description:req.body.description,
                transactionPrize:req.body.transactionPrize,
                isDeposit:req.body.isDeposit,
            };
            const options = {
                new: true,
                upsert: true,
            };
    
            const ajv = new Ajv();
            const validate = ajv.compile(schema);
            const valid = validate(transactions);
            const arr = [];
            if (isTrPrizePositive)
            {
                if (!valid)
                {
                    
                    for (const [key, value] of Object.entries(validate.errors))
                    {
                        arr.push({var:value.instancePath, message:value.message})
                    }
                    res.send(ApiResponse({error:true,ajvMessage:arr, status:500}))
                }
                else
                {
                    const transList = await trans.updateOne(filter,{$set:transactions},options);
                    res.send(ApiResponse({ error: false, status: 200, resData: transList }));
        
                }
            }
            else
            {
                arr.push({var:'Transaction prize', message:'must NOT be zero or negative number'})
                res.send(ApiResponse({error:true,ajvMessage:arr, status:500}))
            }
        }
        catch(e)
        {
            console.error('Error posting transactions:', e);
            res.status(500).send(ApiResponse({
                error: true,
                status: 500,
                description: 'Internal Server Error',
            }));
        }
        
       
    });

    transaction.delete('/:id', async(req, res) =>
    {
        try
        {
            const removedList = await trans.findOneAndRemove({_id:req.params.id});
            res.send(ApiResponse({error: false, status:200,resData:removedList}));
        }
        catch(e)
        {
            console.error('Error deleting transactions:', e);
            res.status(500).send(ApiResponse({
                error: true,
                status: 500,
                description: 'Internal Server Error',
            }));
        }
       
        
    });


    return transaction;
}

export default transactionRouter;