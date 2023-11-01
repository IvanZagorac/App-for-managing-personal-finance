import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MainMenu from '../MainMenu';
import Account from '../../model/account';
import { config } from '../../config/config';
import axios from 'axios';
import DecodedToken from '../../model/token';
import { togetherFunction } from '../../config/token';

function AccountPage()
{

    const[decodedToken,setDecodedToken] = useState<DecodedToken>({
        value: null,
        isExpire: false,
        isExist: true,
    })
    const[allAccounts,setAllAccounts] = useState<Account[]>([])
    const[accountModal,setAccountModal] = useState<boolean>(false);
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
            let response:any;
            if (decodedToken.value != null)
            {
                userId = decodedToken.value._id;
            }

            if (allAccounts.length >= 2)
            {
                setErrorMessage([{var: 'User', message: 'must NOT have more than 2 accounts'}])
            }
            else
            {
                response = await axios.post(config.pool + 'account', {
                    userId,
                    name:account.name,
                    totalAmount:account.totalAmount,
                });
            }
            
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

    const getAllAccounts=async()=>
    {
        await axios.get(config.pool+'account')
            .then((res)=>
            {
                setAllAccounts(res.data.resData);
            })
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
                    <Col lg="6" sm="12" className='first-col'>
                        <h2 className='acc-header'>Accounts</h2>
                    </Col>
                    <Col lg="6" sm="12" className='second-col'>
                        {
                            // eslint-disable-next-line max-len
                            <Button onClick={()=> setAccountModal(true)} className='acc-add-btn' variant='primary'>Add new account</Button>
                        }   
                    </Col>
                    {
                        allAccounts.map((acc) => 
                        {
                            if (decodedToken.value && acc.userId === decodedToken.value._id ) 
                            {
                                return (
                                    <>
                                        <Link to={`/account/${acc._id}`}>
                                            <Card className='acc-card'>
                                                <Card.Header className='acc-card-header'>
                                                    {acc.name}
                                                    {
                                                        // eslint-disable-next-line max-len
                                                        <Button className='card-header-btn' variant='danger' onClick={()=>deleteAccount(acc._id)}>Remove</Button>
                                                    }

                                                </Card.Header>
                                                <Card.Body className='acc-card-header'>
                                                    {`${acc.totalAmount} EUR`}
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </>
                                           
                                );
                            }
                            else 
                            {
                                return <h2 className='no-data'>NO DATA</h2>;
                            }
                        })
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