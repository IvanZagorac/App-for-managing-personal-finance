import { Router, Request, Response } from 'express';
import ApiResponse from '../config/ApiResponse';
import Ajv from 'ajv';
import { BSON } from 'mongodb';

const categoryRouter = function(express,cat):Router
{
    const category = express.Router();

    category.get('/filterDeposit',async(req,res)=>
    {
        try
        {
            const page = parseInt(req.query.currentPage,10) || 1; 
            const userId = req.query.userId;
            const perPage = 10;

            const totalCount =  await cat
                .find({isDeposit:req.query.filterIsDeposit,userId}).countDocuments();
            const allCategories = await cat
                .find({isDeposit:req.query.filterIsDeposit,userId})
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage);

            if (allCategories.length != 0)
            {
                res.send
                (
                    ApiResponse({
                        error: false,
                        status: 200, 
                        resData:allCategories,
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
        catch(e)
        {
            res.send
            (
                ApiResponse({
                    error: true,
                    status: 500, 
                    description:'Error fetching categories'
                })
            )
        }
        
    })

    category.get('',async(req,res)=>
    {
        const userId = req.query.userId;
        const allCategories = await  cat.find({userId}).sort({ createdAt: -1 });
        if (allCategories.length != 0)
        {
            res.send
            (
                ApiResponse({
                    error: false,
                    status: 200, 
                    resData:allCategories
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
                    description:'No data found'
                })
            )
        }
        
    })

    category.get('/:id',async (req,res)=>
    {
        const categoryId = req.params.id;
        try
        {
            const foundAccount = await cat.findOne({_id: categoryId});

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
                res.send
                (
                    ApiResponse({
                        error: true,
                        status: 404, 
                        description:'Category not found'
                    })
                )
            }
        }
        catch (error)
        {
            res.status(500).send({error: 'Server error '})
        }
    })

    category.post('', async(req,res) =>
    {

        const schema = {
            type: 'object',
            properties: {
                name: { 
                    type:'string',
                    minLength:4,
                },
                isDeposit: { type: 'boolean' },
                userId: {
                    type: 'object',
                    properties: {
                        userId: {type: 'string', pattern: '^[a-f\\d]{24}$'},
                    },
                },
              
            },
            required: ['name', 'isDeposit','userId']
        };

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
        req.body.userId = new BSON.ObjectId(req.body.userId);

        const categories = {
            name:req.body.name,
            isDeposit:req.body.isDeposit,
            userId:req.body.userId
        };
        const options = {
            new: true,
            upsert: true,
        };

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
            const catList = await cat.updateOne(filter,{$set:categories},options);
            res.send(ApiResponse({ error: false, status: 200, resData: catList }));
        }

    });

    category.delete('/:id', async(req, res) =>
    {
        const removedList = await cat.findOneAndRemove({_id:req.params.id})
        res.send(ApiResponse({ error: false, status: 200, resData: removedList }));
    });


    return category;
}

export default categoryRouter;