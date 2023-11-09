import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import MainMenu from '../MainMenu';
import Account from '../../model/Account/account';
import { config } from '../../config/config';
import axios from 'axios';
import DecodedToken from '../../model/Auth/token';
import { togetherFunction } from '../../config/token';
import ajvMess from '../../model/Auth/ajv';

function AccountPage()
{

    const[decodedToken,setDecodedToken] = useState<DecodedToken>({
        value: null,
        isExpire: false,
        isExist: true,
    })
    const[allAccounts,setAllAccounts] = useState<Account[]>([])
    const[accountModal,setAccountModal] = useState<boolean>(false);
    const[noDataMsg,setNoDataMsg] = useState<string>('');
    const[errorMessage,setErrorMessage] =useState<ajvMess[]>([]);
    const[account,setAccount] = useState<Account>({
        _id:'',
        userId:'',
        name:'',
        totalAmount:0,
    })
    const navigate = useNavigate();

    const addAccount = async()=>
    {
        try
        {
            let userId:string | null = null;
            console.log(decodedToken.value?._id);
            if (decodedToken.value != null)
            {
                userId = decodedToken.value._id;
            }
            const response = await axios.post(config.pool + 'account', {
                userId,
                name:account.name,
                totalAmount:account.totalAmount,
            });
            
            if (response.data.error)
            {
                setErrorMessage(response.data.ajvMessage);
            }
            else
            {
                setAccount(response.data.resData);
                setAccountModal(false);
                setAccount({ ...account, userId: '', name: '' , totalAmount:0});
                setErrorMessage([]);
                getAllAccounts();
            }
        }
        catch(e)
        {
            console.warn(e);
        }
        
    }

    const getAllAccounts=async ()=>
    {
        const userId = decodedToken.value?._id;
        const response = await axios.get(config.pool+'account',{
            params: { userId}
        })
        if (response.data.error)
        {
            setNoDataMsg('NO DATA');
        }
        else
        {
            setAllAccounts(response.data.resData);
            setNoDataMsg('');
        }
       
    }

    const handleInputChange = (e:any) => 
    {
        const { id, value } = e.target;
        setAccount((prevUser: any) => ({
            ...prevUser,
            [id]: value
        }));
    };

    const deleteAccount = async(id:string)=>
    {
        await axios.delete(config.pool+'account/'+id);
        getAllAccounts();
    }

    const handleRemove = async(event:any,accId:string) =>
    {
        event.preventDefault();

        await deleteAccount(accId);
    }

    useEffect(()=>
    {
        getAllAccounts();
        setDecodedToken(togetherFunction());

        if (!decodedToken.isExist || decodedToken.isExpire)
        {
            navigate('/');
        }
        
    },[decodedToken.isExpire, decodedToken.isExist])

    //hasToken={isLogin} setIsLogin={setIsLogin}

    return(
        <>
            {
                // eslint-disable-next-line max-len
                <MainMenu hasToken={decodedToken.isExist} fullName={decodedToken.value?.fullName} setDecodedToken={setDecodedToken} />
            }
            <Container className="cont">
                <Row className="w-100">
                    <Col lg="6" sm="6" className='first-col'>
                        <h2 className='acc-header'>Accounts</h2>
                    </Col>
                    <Col lg="6" sm="6" className='second-col'>
                        {
                            // eslint-disable-next-line max-len
                            <Button onClick={()=> setAccountModal(true)} className='acc-add-btn' variant='primary'>Add new account</Button>
                        }   
                    </Col>
                    {
                        noDataMsg && noDataMsg.length != 0 ?
                            (
                                <>
                                    <h2 className='no-data'>NO DATA</h2>
                                </>
                            )
                            :
                            (
                                allAccounts.map((acc) => 
                                {
                                    if (decodedToken.value && acc.userId === decodedToken.value._id ) 
                                    {
                                        return (
                                            <>
                                                <Card className='acc-card'>
                                                    <Link to={`/account/${acc._id}`} className='acc-link'>
                                                        <Card.Header className='acc-card-header'>
                                                            <div className='acc-values'>
                                                                <p>{acc.name}</p>
                                                            </div>
                                                            <div className='btn-div'>
                                                                {
                                                                // eslint-disable-next-line max-len
                                                                    <Button className='card-header-btn' variant='danger' onClick={(event)=>handleRemove(event, acc._id)}>Remove</Button>
                                                                }
                                                            </div>
                                               
                                                        </Card.Header>
                                            
                                                        <Card.Body className='acc-card-header'>
                                                            <p className='acc-values'> {`${acc.totalAmount} EUR`}</p>
                                                        </Card.Body>
                                                    </Link>
                                                </Card>
                                            </>
                                       
                                        );
                                    }
                                })
                            )
                        
                        
                    }
                </Row>
            </Container>
            <Modal
                centered
                show={accountModal}
                onHide={() => setAccountModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="form">
                        <Col className="formColumn" lg="12" md="12" sm="12">
                            <Form.Group>
                                <Form.Label htmlFor="name">Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    id="name"
                                    value={account.name}
                                    onChange={event=> handleInputChange(event)}
                                />
                            </Form.Group>
                        </Col>

                        <Col className="formColumn" lg="12" md="12" sm="12">
                            <Form.Group>
                                <Form.Label htmlFor="totalAmount">Total amount:</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Total amount"
                                    id="totalAmount"
                                    value={account.totalAmount}
                                    onChange={event=> handleInputChange(event)}

                                />
                            </Form.Group>
                        </Col>

                        <Form.Group>
                            <Button className="accBtn" onClick={()=>addAccount()} variant="primary">Add</Button>
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
        </>
    )
}

export default AccountPage ;