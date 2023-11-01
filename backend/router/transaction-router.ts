import { Router, Request, Response } from 'express';

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

            res.send(transactionList);
        }
        catch (error)
        {
            res.status(500).send({ error: 'Server error' });
        }
    })

    transaction.get('/:id',async (req,res)=>
    {
        const transactionId = req.params.id;
        try
        {
            const foundAccount = await trans.findOne({_id: transactionId});

            if (foundAccount)
            {
                res.send(foundAccount);
            }
            else
            {
                res.status(404).send({ error: 'Transaction not found' });
            }
        }
        catch (error)
        {
            res.status(500).send({error: 'Server error '})
        }
    })

    transaction.post('', (req,res) =>
    {
        const transactions = new trans({
            accountId:req.body.accountId,
            categoryId:req.body.categoryId,
            time: req.body.time,
            description:req.body.description,
            transactionPrize:req.body.transactionPrize,
            isDeposit:req.body.isDeposit,
        });
    
        transactions.save().then((transactionList)=>
        {
            res.status(201).json({ transactionList });
        })
    });

    transaction.delete('/:id', (req, res) =>
    {
        trans.findOneAndRemove({_id:req.params.id}).
            then((removedList)=>
            {
                res.send(removedList);
            })
        
    });


    return transaction;
}

export default transactionRouter;