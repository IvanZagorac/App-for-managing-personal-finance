import { Router, Request, Response } from 'express';
import ApiResponse from '../config/ApiResponse';
import Ajv from 'ajv';

const categoryRouter = function(express,cat):Router
{
    const category = express.Router();

    category.get('',(req,res)=>
    {
        cat.find({})
            .sort({ createdAt: -1 })
            .then(categoryList=>
            {
                res.send
                (
                    ApiResponse({
                        error: false,
                        status: 320, 
                        resData:categoryList
                    })
                )
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

        const schema = {
            type: 'object',
            properties: {
                name: { 
                    type:'string',
                    minLength:4,
                },
                isDeposit: { type: 'boolean' },
              
            },
            required: ['name', 'isDeposit']
        };

        const categories = new cat({
            name:req.body.name,
            isDeposit:req.body.isDeposit,
        });

        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(categories);
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
            (categories as typeof cat).save().then((catList) => 
            {
                res.send(ApiResponse({ error: false, status: 200, resData: catList }));
            });
        }
    
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