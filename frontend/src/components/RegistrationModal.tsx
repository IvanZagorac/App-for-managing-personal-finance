import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import axios from 'axios';
import { config } from '../config/config';

function RegistrationModal({ registerModal, setRegisterModal }:any)
{

    type FormData={
        email:string;
        password:string;
        repeatPassword:string;
        fullName:string;
    }

    const[userRegistration, setUserRegistration]=useState<FormData>({
        email: '',
        password: '',
        repeatPassword: '',
        fullName: '',
    })
    const[message,setMessage]=useState<string>('');
    const navigate=useNavigate();
    const schema:ZodType<FormData>=z.object({
        email:z.string().email(),
        password:z.string().min(4).max(20),
        repeatPassword:z.string().min(4).max(20),
        fullName:z.string().min(6).max(30).refine((value) => value.split(' ').length > 1, {
            message: 'Full name must contain forename and surname',
        }),

    }).refine((data)=>
        data.password===data.repeatPassword,{
        message:'Passwords do not match',
        path:['repeatPassword']
    })
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver:zodResolver(schema),
    });

    const doRegistration :SubmitHandler<FormData> =async (data)=>
    {
        const response = await axios.post(config.pool+'auth/register',{
            email:data.email,
            password:data.password,
            fullName:data.fullName,
        });
        const token = response.data.resData.token;
        localStorage.setItem('token', token);
        navigate('account');
        setUserRegistration({ ...userRegistration, password: '', email: '' ,fullName: ''});
        setMessage('');
        setRegisterModal(false)

    }

    const handleInputChange = (e:any) => 
    {
        const { id, value } = e.target;
        setUserRegistration((prevUser: any) => ({
            ...prevUser,
            [id]: value
        }));
    };

    return (
        <Modal
            centered
            show={registerModal}
            onHide={() => setRegisterModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>User Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(doRegistration)}>
                    <Col lg="8" md="8" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="email"> E-mail:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                id="email"
                                {...register('email', {
                                })}
                                value={userRegistration.email}
                                onChange={event=> handleInputChange(event)}
                                
                            />
                            {errors.email && (
                                <span className="error">{errors.email.message}</span>
                            )}
                        </Form.Group>
                    </Col>

                    <Col lg="8" md="8" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <Form.Control
                                id="password"
                                {...register('password', {
                                })}
                                type="password"
                                placeholder="Password"
                                value={userRegistration.password}
                                onChange={event=> handleInputChange(event)}

                            />
                            {errors.password && (
                                <span className="error">{errors.password.message}</span>
                            )}
                        </Form.Group>
                    </Col>

                    <Col lg="8" md="8" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="repeatPassword">Repeat password</Form.Label>
                            <Form.Control
                                id="repeatPassword"
                                {...register('repeatPassword', {
                                    required: true,
                                    pattern: /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{8,}$/
                                })}
                                type="password"
                                placeholder="Password"
                                value={userRegistration.repeatPassword}
                                onChange={event=> handleInputChange(event)}

                            />
                            {errors.repeatPassword && (
                                <span className="error">{errors.repeatPassword.message}</span>
                            )}

                        </Form.Group>
                    </Col>


                    <Col md="8">
                        <Form.Group>
                            <Form.Label htmlFor="fullName">Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                id="fullName"
                                {...register('fullName', {
                                    required: true,
                                    pattern: /^[a-zA-Z]+ [a-zA-Z]+$/
                                })}
                                value={userRegistration.fullName}
                                onChange={event=> handleInputChange(event)}

                            />
                            {errors.fullName && (
                                <span className="error">{errors.fullName.message}</span>
                            )}

                        </Form.Group>
                    </Col>
                    <Col md="6" className='mt-3'>
                        <Form.Group>
                            <Button 
                                className="submitBtn"
                                value = 'Submit'
                                type="submit"   
                                onClick={handleSubmit(doRegistration)}>Submit</Button> 
                        </Form.Group>
                    </Col>

                </Form>
            </Modal.Body>
        </Modal> 
    )
}

export default RegistrationModal;