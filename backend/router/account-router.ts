import Ajv from 'ajv';
import { Router, Request, Response } from 'express';
import ApiResponse from '../config/ApiResponse';

const accountRouter = function(express,acc):Router
{
    const account = express.Router();

    account.get('',(req,res)=>
    {
        acc.find({})
            .sort({ createdAt: -1 })
            .then(accountList=>
            {
                res.send(accountList);
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
                res.send(foundAccount);
            }
            else
            {
                res.status(404).send({ error: 'Account not found' });
            }
        }
        catch (error)
        {
            res.status(500).send({error: 'Server error '})
        }
       
    })

    account.post('', async (req,res) =>
    {
        const schema = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                userId: { type: 'string' },
                totalAmount: { type: 'integer' },
              
            },
            required: ['name', 'userId', 'totalAmount',],
        };

        let data = await acc.findOne({}) as any;

        // const userId = req.body.userId;
        // const name = req.body.name;
        // const totalAmount = req.body.totalAmount;
        // const accounts = new acc({
        //     userId,
        //     name,
        //     totalAmount
        // });

        data = {
            userId :req.body.userId,
            name :req.body.name,
            ctotalAmount :req.body.totalAmount,
        }
        
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(data);
        if (!valid)
        {
            res.send(ApiResponse({error:true,description:`Validation error ${validate.errors}`, status:500}))
        }

        await acc.findOneAndUpdate({$set:data}).
            then(accList=>
            {
                res.send(ApiResponse({error: false, description:'OK', status:200})).json({accList})
            })

        // accounts.save().then((accountList)=>
        // {
        //     res.status(201).json({ accountList });
        // })

    });

    account.delete('/:id', (req, res) =>
    {
        acc.findOneAndRemove({_id:req.params.id}).
            then((removedList)=>
            {
                res.send(removedList);
            })
        
    });

    return account;
}

export default accountRouter;