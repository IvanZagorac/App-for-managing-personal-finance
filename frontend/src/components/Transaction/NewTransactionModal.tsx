import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import Transaction from '../../model/transaction';
import CategoryDropdown from './AddCategoryDropdown';
import axios from 'axios';
import { config } from '../../config/config';
import Category from '../../model/category';
import ajvMess from '../../model/ajv';

function TransactionModal({ transactionModal, setTransactionModal }:any)
{

    const[errorMessage,setErrorMessage] =useState<ajvMess[]>([]);
    const navigate=useNavigate();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [categories,setCategories]=useState<Category[]>([]);
    const { tId }=useParams();
    const[transaction,setTransaction]=useState<Transaction>({
        accountId: '',
        categoryId: '',
        time: '',
        description:'',
        transactionPrize:0,
        isDeposit:false,
    })

    const getAllCategories=async()=>
    {
        await axios.get(config.pool+'category')
            .then((res)=>
            {
                setCategories(res.data.resData);
            })
    }

    const addTransaction = async()=>
    {
        try
        {
            const response = await axios.post(config.pool + 'transaction', {
                accountId:tId,
                categoryId:selectedCategoryId,
                description:transaction.description,
                time:new Date().toDateString(),
                transactionPrize:transaction.transactionPrize,
                isDeposit:transaction.isDeposit,
            });
            if (response.data.error)
            {
                setErrorMessage(response.data.ajvMessage);
            }
            else
            {
                setTransaction(response.data.resData);
                setTransactionModal(false);
                setTransaction({ ...transaction, accountId: '',
                    categoryId: '',
                    time: '',
                    description:'',
                    transactionPrize:0,
                    isDeposit:false,});
                setErrorMessage([]);
                // getAllTransaction();
            }
        }
        catch(e)
        {
            console.warn(e);
        }
        
    }

    const handleCategorySelect = (categoryId:string) => 
    {
        setSelectedCategoryId(categoryId);
    };

    const handleInputChange = (e:any) => 
    {
        const { id, value } = e.target;
        setTransaction((prevUser: any) => ({
            ...prevUser,
            [id]: value
        }));
    };

    const setTransactionIsDeposit=()=>
    {
        setTransaction({ ...transaction, isDeposit: !transaction.isDeposit })
    }

    useEffect(()=>
    {
        getAllCategories();
        
    },[])

    return(
        <Modal
            centered
            show={transactionModal}
            onHide={() => setTransactionModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="form">
                    <Col className="formColumn" lg="12" md="12" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="name">Description:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Description"
                                id="Description"
                                value={transaction.description}
                                onChange={event=> handleInputChange(event)}
                            />
                        </Form.Group>
                    </Col>

                    <Col className="formColumn" lg="12" md="12" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="totalAmount">Transaction Prize:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Transaction Prize"
                                id="transactionPrize"
                                value={transaction.transactionPrize}
                                onChange={event=> handleInputChange(event)}

                            />
                        </Form.Group>
                    </Col>

                    <Col className="formColumn" lg="12" md="12" sm="12">
                        {
                            // eslint-disable-next-line max-len
                            <CategoryDropdown categories={categories} isDeposit={transaction.isDeposit} onCategorySelect={handleCategorySelect} setIsDeposit={setTransactionIsDeposit}/>
                        }
                    </Col>

                    <Form.Group>
                        <Button className="accBtn" onClick={()=>addTransaction()} variant="primary">Add</Button>
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

export default TransactionModal;