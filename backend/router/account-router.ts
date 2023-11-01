import Ajv from 'ajv';
import { Router, Request, Response } from 'express';
import ApiResponse from '../config/ApiResponse';

interface Account {
    userId: string;
    name: string;
    totalAmount:Number;
}

const accountRouter = function(express,acc):Router
{
    const account = express.Router();

    account.get('',(req,res)=>
    {
        acc.find({})
            .sort({ createdAt: -1 })
            .limit(2)
            .then(accountList=>
            {
                res.send
                (
                    ApiResponse({
                        error: false,
                        status: 303, 
                        resData:accountList
                    })
                )
            })
    })

    account.get('/:id',async (req,res)=>
    {
        const accountId = req.params.id;
        try
        {
            const foundAccount = await acc.findOne({_id: accountId});

            if (foundAccount)
            {
                res.send
                (
                    ApiResponse({
                        error: false,
                        status: 304, 
                        resData:foundAccount
                    })
                )
            }
            else
            {
                res.send(ApiResponse({error: true, description: 'Account not found', status: 404}));
            }
        }
        catch (error)
        {
            res.send(ApiResponse({error: true, description: 'Server error founding account', status: 500}));
        }
       
    })

    account.post('', async (req,res) =>
    {
        const schema = {
            type: 'object',
            properties: {
                name: { 
                    type: 'string',
                    minLength:4,
                },
                userId: {
                    type: 'object',
                    properties: {
                        userId: {type: 'string', pattern: '^[a-f\\d]{24}$'},
                    },
                },
                totalAmount: { type: 'integer' },
              
            },
            required: ['name', 'userId', 'totalAmount',],
        };
        const accounts = new acc({
            userId :req.body.userId,
            name :req.body.name,
            totalAmount :req.body.totalAmount,
        })
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(accounts);
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
            (accounts as typeof acc).save().then((accList) => 
            {
                res.send(ApiResponse({ error: false, status: 200, resData: accList }));
            });
        }

    });

    account.delete('/:id', (req, res) =>
    {
        acc.findOneAndRemove({_id:req.params.id}).
            then((removedList)=>
            {
                res.send(ApiResponse({error: false, status:200,resData:removedList}))
            })
        
    });

    return account;
}

export default accountRouter;