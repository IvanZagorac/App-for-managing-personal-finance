import Ajv from 'ajv';
import { Router, Request, Response } from 'express';
import ApiResponse from '../config/ApiResponse';
import { BSON } from 'mongodb';


const accountRouter = function(express,acc):Router
{
    const account = express.Router();


    account.get('',async(req,res)=>
    {
        try
        {
            const userId = req.query.userId;
            const accounts = await acc.find({userId}).sort({ createdAt: -1 });

            if (accounts.length != 0)
            {
                res.send
                (
                    ApiResponse({
                        error: false,
                        status: 200, 
                        resData:accounts
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
        catch(e)
        {
            throw new Error(e);
        }
       
    })
    account.patch('/:id',async(req,res)=>
    {

        try
        {
            const accountId = req.params.id;
        
            const accounts = await acc.findOneAndUpdate({_id:accountId},{$set: {totalAmount:req.body.totalAm }});
    
            res.send
            (
                ApiResponse({
                    error: false,
                    status: 200, 
                    resData:accounts
                })
            )
        }
        catch(e)
        {
            throw new Error(e);
        }
       
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
                        status: 200, 
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
            throw new Error(error);
        }
       
    })

    account.post('', async (req,res) =>
    {
        try
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
    
            const nid = new BSON.ObjectId(req.body.userId);
            const findByUserId = await acc.find({userId: nid})
            const arr = [];
            let existsTwoAcc = false;
            if (Object.keys(findByUserId).length >= 2)
            {
                arr.push({var:'An account', message:'must NOT have more than 2 accounts'})
                existsTwoAcc = true;
            }
            if (existsTwoAcc)
            {
                res.send(ApiResponse({error:true,ajvMessage:arr, status:500}))
            }
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
                const existAcc = await acc.findOne({ userId: req.body.userId, name: req.body.name })
                if (existAcc)
                {
                    // eslint-disable-next-line max-len
                    res.send(ApiResponse({error:true,description:'An account with the same name and user already exists.', status:500}))
                }
                else
                {
                    // No existing account found, save the new account
                    const accs = await (accounts as typeof acc).save();
                    res.send(ApiResponse({ error: false, status: 200, resData: accs }));
                }
            }
        }
        catch(e)
        {
            throw new Error(e);
        }
        

    });

    account.delete('/:id', async (req, res) =>
    {
        try
        {
            const removedList = await  acc.findOneAndRemove({_id:req.params.id});
            res.send(ApiResponse({error: false, status:200,resData:removedList}));
        }
        catch(e)
        {
            throw new Error(e);
        }
       
        
    });

    return account;
}

export default accountRouter;