import { useState } from 'react'
import { Alert, Button, Col, Form, Modal } from 'react-bootstrap'
import axios from 'axios';
import { config } from '../../config/config';
import AddCategory from '../../model/Category/addCategory';
import ajvMess from '../../model/Auth/ajv';

function CategoryModal({ categoryModal, setCategoryModal }:any)
{

    const[errorMessage,setErrorMessage] =useState<ajvMess[]>([]);
    const[category,setCategory]=useState<AddCategory>({
        name:'',
        isDeposit: false,
        userId:'',
    })

    const addCategory = async()=>
    {
        try
        {
            const response = await axios.post(config.pool + 'category', {
                name:category.name,
                isDeposit:category.isDeposit,
                userId:category.userId,
            });
            if (response.data.error)
            {
                setErrorMessage(response.data.ajvMessage);
            }
            else
            {
                setCategory(response.data.resData);
                setCategoryModal(false);
                setCategory({ 
                    ...category, 
                    name: '',
                    isDeposit:false,
                    userId:''});
                setErrorMessage([]);
                // getAllTransaction();
            }
        }
        catch(e)
        {
            console.warn(e);
        }
        
    }

    const handleInputChange = (e:any) => 
    {
        const { id, value } = e.target;
        setCategory((prevUser: any) => ({
            ...prevUser,
            [id]: value
        }));
    };

    return(
        <Modal
            centered
            show={categoryModal}
            onHide={() => setCategoryModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="form">
                    <Col className="cat-name" lg="12" md="12" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="name">Name:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                id="name"
                                value={category.name}
                                onChange={event=> handleInputChange(event)}
                            />
                        </Form.Group>
                    </Col>

                    <Form.Check
                        type="checkbox"
                        label='isDeposit'
                        checked={category.isDeposit}
                        onChange={() => setCategory({ 
                            ...category, 
                            name: '',
                            isDeposit:!category.isDeposit,})}
                        className="custom-checkbox"
                    />

                    <Form.Group className='btn-group'>
                        <Button className="transBtn" onClick={()=>addCategory()} variant="primary">Add Category</Button>
                    </Form.Group>
                    
                    <Form.Group>
                        {
                            errorMessage.map((mess)=>
                            {
                                return(
                                // eslint-disable-next-line max-len
                                    <Alert variant="danger" className={mess ? '' : 'd-none'}>{mess.var + ' ' + mess.message}</Alert>
                                )
                            })
                        }
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal> 
    )
    
}

export default CategoryModal;