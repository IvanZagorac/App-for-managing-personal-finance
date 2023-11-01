import { Router, Request, Response } from 'express';

const categoryRouter = function(express,cat):Router
{
    const category = express.Router();

    category.get('',(req,res)=>
    {
        cat.find({})
            .sort({ createdAt: -1 })
            .then(categoryList=>
            {
                res.send(categoryList);
            })
    })

    category.get('/:id',async (req,res)=>
    {
        const categoryId = req.params.id;
        try
        {
            const foundAccount = await cat.findOne({_id: categoryId});

            if (foundAccount)
            {
                res.send(foundAccount);
            }
            else
            {
                res.status(404).send({ error: 'Catgory not found' });
            }
        }
        catch (error)
        {
            res.status(500).send({error: 'Server error '})
        }
    })

    category.post('', (req,res) =>
    {

        const categories = new cat({
            name:req.body.name,
            isDeposit:req.body.isDeposit,
        });
    
        categories.save().then((categoryList)=>
        {
            res.status(201).json({ categoryList });
        })
    });

    category.delete('/:id', (req, res) =>
    {
        cat.findOneAndRemove({_id:req.params.id}).
            then((removedList)=>
            {
                res.send(removedList);
            })
        
    });


    return category;
}

export default categoryRouter;