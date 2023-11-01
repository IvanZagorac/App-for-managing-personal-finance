import { Router, Request, Response } from 'express';
import ApiResponse from '../config/ApiResponse';
import Ajv from 'ajv';

const transactionRouter = function(express,trans):Router
{
    const transaction = express.Router();

    transaction.get('',async (req,res)=>
    {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 15;

        try
        {
            const transactionList = await trans.find({})
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage);
            res.send
            (
                ApiResponse({
                    error: false,
                    status: 310, 
                    resData:transactionList
                })
            )
        }
        catch (error)
        {
            res.send
            (
                ApiResponse({
                    error: true,
                    status: 500, 
                    description:'Error getting transaction list'
                })
            )
        }
    })

    transaction.get('/:id',async (req,res)=>
    {
        const transactionId = req.params.id;
        try
        {
            const foundTransaction = await trans.findOne({_id: transactionId});

            if (foundTransaction)
            {
                res.send
                (
                    ApiResponse({
                        error: false,
                        status: 311, 
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
            res.send(ApiResponse({error: true, description: 'Server error finding one transaction', status: 500}));
        }
    })

    transaction.post('', (req,res) =>
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
                time: { 
                    type: 'date',
                },
                description: { 
                    type:'string',
                    minLength:4,
                },
                transactionPrize: { type: 'integer' },
                isDeposit: { type: 'boolean' },
              
            },
            required: ['accountId', 'categoryId', 'time', 'description', 'transactionPrize', 'isDeposit']
        };


        const transactions = new trans({
            accountId:req.body.accountId,
            categoryId:req.body.categoryId,
            time: req.body.time,
            description:req.body.description,
            transactionPrize:req.body.transactionPrize,
            isDeposit:req.body.isDeposit,
        });

        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(transactions);
        if (!valid)
        {
            const arr = [];
            for (const [key, value] of Object.entries(validate.errors))
            {
                arr.push({var:value.instancePath, message:value.message})
            }
            res.send(ApiResponse({error:true,ajvMessage:arr, status:500}))
        }
        else
        {
            (transactions as typeof trans).save().then((transList) => 
            {
                res.send(ApiResponse({ error: false, status: 200, resData: transList }));
            });
        }
    });

    transaction.delete('/:id', (req, res) =>
    {
        trans.findOneAndRemove({_id:req.params.id}).
            then((removedList)=>
            {
                res.send(ApiResponse({error: false, status:200,resData:removedList}))
            })
        
    });


    return transaction;
}

export default transactionRouter;