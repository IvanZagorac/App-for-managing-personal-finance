import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import MainMenu from '../MainMenu'
import { useEffect, useState } from 'react';
import { togetherFunction } from '../../config/token';
import { useNavigate, useParams } from 'react-router-dom';
import DecodedToken from '../../model/token';
import Transaction from '../../model/transaction';
import TransactionModal from './NewTransactionModal';

function TransactionPage()
{
    const navigate=useNavigate();
    const[transactionModal,setTransactionModal]=useState<boolean>(false);
    const[decodedToken,setDecodedToken] = useState<DecodedToken>({
        value: null,
        isExpire: false,
        isExist: true,
    })
    
    const handleTransactionModal =()=>
    {
        setTransactionModal(true);
    }

    useEffect(()=>
    {
        setDecodedToken(togetherFunction());

        if (!decodedToken.isExist || decodedToken.isExpire)
        {
            navigate('/');
        }
        
    },[decodedToken.isExpire, decodedToken.isExist])

    return(
            
        <>
            {
                // eslint-disable-next-line max-len
                <MainMenu hasToken={decodedToken.isExist} fullName={decodedToken.value?.fullName} setDecodedToken={setDecodedToken} />
            }
       
            <Container className="cont">
                <Row className="w-100">
                    <Col lg="6" sm="12" className='first-col'>
                        <h2 className='acc-header'>Transactions</h2>
                    </Col>
                    <Col lg="6" sm="12" className='second-col'>
                        {
                            // eslint-disable-next-line max-len
                            <Button onClick={()=> handleTransactionModal()} className='acc-add-btn' variant='primary'>Add new Transaction</Button>
                        }   
                    </Col>
                </Row>
                <TransactionModal transactionModal={transactionModal} setTransactionModal={setTransactionModal} />
            </Container>
            
        </>
        
                
    )
}

export default TransactionPage