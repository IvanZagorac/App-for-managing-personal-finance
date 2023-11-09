import  bcrypt from 'bcrypt';
import  jwt from 'jsonwebtoken';
import {config} from '../config/config';
import { Router, Request, Response } from 'express';
import ApiResponse from '../config/ApiResponse';

const authRouter= function(express,User):Router
{
    const auth = express.Router();


    auth.post('/login', async function(req,res)
    {

        try
        {
            const rows = await User.find({
                email:req.body.email
            })

            if (rows.length == 0)
            {
                res.send(ApiResponse({error: true, description: 'Email doesnt exist', status: 401}));
            }
            else
            {
                const validPass = await bcrypt.compare(req.body.password, rows[0].password);
                if (rows.length > 0 && validPass)
                {
                    const token = jwt.sign({
                        email: rows[0].email,
                        _id:rows[0]._id,
                        fullName:rows[0].fullName,
                    }, config.secret, {
                        expiresIn: '6h'
                    });
                    // eslint-disable-next-line max-len
                    res.send
                    (
                        ApiResponse({
                            error: false,
                            status: 200, 
                            resData:{token,user: {email: rows[0].email,_id:rows[0]._id}}
                        })
                    )


                }
                if(!validPass)
                {
                    res.send(ApiResponse({error: true, description: 'Wrong password', status: 401}));
                }

            }

        }

        catch (e)
        {
            throw new Error('PROBLEM WITH LOGIN');
        }

    });

    auth.post('/register', async function(req,res)
    {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        if (!hashedPassword)
        {
            res.send(ApiResponse({error: true, description: 'Cannot hashed password', status: 301}));
        }
        
        const email=req.body.email;
        const fullName=req.body.fullName;

        const newUser=new User({
            email,
            fullName,
            password:hashedPassword
        })
        const user = await newUser.save();

        const token = jwt.sign({
            _id:user._id,
            email,
            fullName,
        },
        config.secret, {
            expiresIn: '6h',
        });

        if (!token)
        {
            res.send(ApiResponse({error: true, description: 'Token does not exists', status: 302}));
        }

        res.send
        (
            ApiResponse({
                error: false,
                status: 205, 
                resData:{token,user}
            })
        )

    });
    return auth;
}

export default authRouter;