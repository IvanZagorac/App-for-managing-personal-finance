/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import CategoryDropdown from './AddCategoryDropdown';
import axios from 'axios';
import { config } from '../../config/config';
import Category from '../../model/Category/category';
import ajvMess from '../../model/Auth/ajv';
import PopulatedTransaction from '../../model/Transaction/populatedTransaction';
import AccountById from '../../model/Account/accountById';
import { togetherFunction } from '../../config/token';
import TransactionAccount from '../../model/Transaction/transactionAccount';

function TransactionModal({ transactionModal, setTransactionModal, currTransaction, isEdit,setCurrTransaction, fetchAllTransactions,currTransPrize,account,setAccount}: 
    { 
        transactionModal:any,
         setTransactionModal:any, 
         currTransaction:TransactionAccount | null, 
         isEdit:boolean,
        setCurrTransaction:React.Dispatch<React.SetStateAction<TransactionAccount | null>> 
        fetchAllTransactions:any,
        currTransPrize:number,
        account:AccountById,
        setAccount:React.Dispatch<React.SetStateAction<AccountById>> 

    })
{
    const[errorMessage,setErrorMessage] =useState<ajvMess[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [categories,setCategories]=useState<Category[]>([]);
    const { aId }=useParams();
    const[transaction,setTransaction]=useState<PopulatedTransaction>({
        _id:'',
        accountId: '',
        categoryId: {
            _id:'',
            name:'',
            isDeposit: false,
            userId:''
        },
        time: '',
        description:'',
        transactionPrize:0,
        isDeposit:false,
    })
    const token = togetherFunction();

    const getAllCategories=async()=>
    {
        const userId = token.value?._id;
        const response = await axios.get(config.pool+'category',{
            params: { userId }
        })
        setCategories(response.data.resData);
    }

    const updateAccountTotalAmount = async(totalAm:number) =>
    {
        await axios.patch(config.pool+'account/'+ aId,{
            totalAm,
        });
    }

    const addTransaction = async()=>
    {
        try
        {
            let responseBody:any;
            if (isEdit)
            {
                responseBody = {
                    _id:currTransaction?._id,
                    accountId:aId,
                    categoryId:selectedCategoryId == '' ? currTransaction?.categoryId._id : selectedCategoryId,
                    description:currTransaction?.description,
                    time:currTransaction?.time,
                    transactionPrize:currTransaction?.transactionPrize,
                    isDeposit:currTransaction?.isDeposit,
                }
            }
            else
            {
                responseBody = {
                    accountId:aId,
                    categoryId:selectedCategoryId,
                    description:transaction.description,
                    transactionPrize:transaction.transactionPrize,
                    isDeposit:transaction.isDeposit,
                }
                
            }
            const response = await axios.post(config.pool + 'transaction', responseBody);
            if (response.data.error)
            {
                setErrorMessage(response.data.ajvMessage);
            }
            else
            {
                let total = account.totalAmount;
                
                if (isEdit)
                {
                    const totalOnEdit = currTransPrize - parseInt(responseBody.transactionPrize,10);
                    if (responseBody.isDeposit)
                    {
                        total = total - (totalOnEdit);
                    }
                    else
                    {
                        total = total + (totalOnEdit);
                    }
                    
                    updateAccountTotalAmount(total);
                    setAccount({ ...account, totalAmount: total })
                    setCurrTransaction(response.data.resData);
                    setTransactionModal(false);
                    setCurrTransaction({ ...currTransaction,
                        _id:'',
                        accountId: {
                            _id:'',
                            userId:'',
                            name:'',
                            totalAmount:0,
                        },
                        categoryId: {
                            _id:'',
                            name:'',
                            isDeposit: false,
                            userId:''
                        },
                        time: '',
                        description:'',
                        transactionPrize:0,
                        isDeposit:false,});
                    setErrorMessage([]);
                }
                else
                {
                    if (responseBody.isDeposit)
                    {
                        total += parseInt(responseBody.transactionPrize,10);
                    }
                    else
                    {
                        total -= parseInt(responseBody.transactionPrize,10);
                    }
                    updateAccountTotalAmount(total);
                    setAccount({ ...account, totalAmount: total })
                    setTransaction(response.data.resData);
                    setTransactionModal(false);
                    setTransaction({ ...transaction, accountId: '',
                        categoryId: {
                            _id:'',
                            name:'',
                            isDeposit: false,
                            userId:''
                        },
                        time: '',
                        description:'',
                        transactionPrize:0,
                        isDeposit:false,});
                    setErrorMessage([]);
                }
                fetchAllTransactions();
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
        if (isEdit)
        {
            setCurrTransaction((prevUser: any) => ({
                ...prevUser,
                [id]: value
            }));
        }
        else
        {
            setTransaction((prevUser: any) => ({
                ...prevUser,
                [id]: value
            }));
        }
        
    };

    const setTransactionIsDeposit=()=>
    {
        if (isEdit && currTransaction != null)
        {
            setCurrTransaction({ ...currTransaction, isDeposit: !currTransaction.isDeposit })
        }
        else
        {
            setTransaction({ ...transaction, isDeposit: !transaction.isDeposit })
        }
        
    }

    const handleOnHide=()=>
    {
        setTransactionModal(false);
        setTransaction({
            _id:'',
            accountId: '',
            categoryId: {
                _id:'',
                name:'',
                isDeposit: false,
                userId:''
            },
            time: '',
            description:'',
            transactionPrize:0,
            isDeposit:false,
        });

    }

    useEffect(()=>
    {
        getAllCategories();
        
    },[])

    return(
        <Modal
            centered
            show={transactionModal}
            onHide={() => handleOnHide()}>
            <Modal.Header closeButton>
                <Modal.Title>{ currTransaction ? 'Edit transaction' : 'Add Transaction'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="form">
                    <Col className="formColumn" lg="12" md="12" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="description">Description:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Description"
                                id="description"
                                value={isEdit ? currTransaction?.description : transaction.description}
                                onChange={event=> handleInputChange(event)}
                            />
                        </Form.Group>
                    </Col>

                    <Col className="formColumn" lg="12" md="12" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="transactionPrize">Transaction Prize:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Transaction Prize"
                                id="transactionPrize"
                                value={isEdit ? currTransaction?.transactionPrize : transaction.transactionPrize}
                                onChange={event=> handleInputChange(event)}

                            />
                        </Form.Group>
                    </Col>

                    <Col className="formColumn" lg="12" md="12" sm="12">
                        {
                            // eslint-disable-next-line max-len
                            <CategoryDropdown 
                                categories={categories} 
                                isDeposit={isEdit ? currTransaction?.isDeposit : transaction.isDeposit} 
                                onCategorySelect={handleCategorySelect}
                                setIsDeposit={setTransactionIsDeposit} 
                                currentTrans={currTransaction}
                            />
                        }
                    </Col>

                    <Form.Group className='btn-group'>
                        <Button className="transBtn" onClick={()=>addTransaction()} variant="primary">{ currTransaction ? 'Edit transaction' : 'Add Transaction'}</Button>
                    </Form.Group>
                    <Form.Group>
                        {
                            errorMessage.map((mess)=>
                            {
                                return(
                                // eslint-disable-next-line max-len
                                    <Alert id="alert-trans" variant="danger" className={mess ? '' : 'd-none'}>{mess.var + ' ' + mess.message}</Alert>
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