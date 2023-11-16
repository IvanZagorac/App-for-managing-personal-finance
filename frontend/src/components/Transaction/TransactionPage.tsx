/* eslint-disable max-len */
import { Button, Col, Container,Row } from 'react-bootstrap'
import { Pagination } from 'react-bootstrap';
import MainMenu from '../MainMenu'
import { useEffect, useState } from 'react';
import { togetherFunction } from '../../config/token';
import { useNavigate, useParams } from 'react-router-dom';
import TransactionModal from './TransactionModal';
import CategoryModal from './CategoryModal';
import axios from 'axios';
import { config } from '../../config/config';
import AccountById from '../../model/Account/accountById';
import moment from 'moment';
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TransactionAccount from '../../model/Transaction/transactionAccount';
import LineChart from './LineChart';
import ComponentPieChart from './ComponentPieChart';
import DeleteModal from '../DeleteModal';


function TransactionPage()
{
    
    const navigate=useNavigate();
    const {aId} = useParams();
    const[transactionModal,setTransactionModal]=useState<boolean>(false);
    const[transactions,setTransactions]=useState<TransactionAccount[]>([]);
    const[allTransactions,setAllTransactions]=useState<TransactionAccount[]>([]);
    const[currentTransactionPrize,setCurrentTransactionPrize]=useState<number>(0);
    const[currTrans,setCurrTrans]=useState<TransactionAccount | null>(null);
    const[currDelTrans,setCurrDelTrans] = useState<TransactionAccount | null>(null);
    const[deleteErrorMessage,setDeleteErrorMessage] = useState<string>('');
    const[deleteModal,setDeleteModal] = useState<boolean>(false);
    const[noDataMsg,setNoDataMsg] = useState<string>('');
    const[startDate,setStartDate]= useState<Date | null>(null);
    const[endDate,setEndDate]= useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const[totalCount,setTotalCount]=useState<number>(0);
    const[isEdit,setIsEdit] = useState<boolean>(false);
    const[account,setAccount] = useState<AccountById>({
        userId:'',
        name:'',
        totalAmount:0,
    })
    const[categoryModal,setCategoryModal]=useState<boolean>(false);
    const token = togetherFunction();
    
    const handleModal =(setModal:any,trueOrFalse:boolean,currTrans:TransactionAccount | null)=>
    {
        setModal(true);
        setIsEdit(trueOrFalse);
        if (currTrans)
        {
            setCurrentTransactionPrize(currTrans!.transactionPrize);
        }
        setCurrTrans(currTrans);
    }

    const getAccountById = async()=>
    {
        const response = await axios.get(config.pool + 'account/' + aId);

        if (!response.data.error)
        {
            setAccount(response.data.resData);
        }
        else
        {
            console.log(response.data.description);
        }
    }

    const getAllTransactions = async() =>
    {
        try
        {
            const response = await axios.get(config.pool + 'transaction', {
                params: { currentPage, aId, startDate, endDate}
            });
            if (!response.data.error)
            {
                
                const transactionsData = response.data.resData.transactionList;
                const allTrans = response.data.resData.allTransactions;
                setTransactions(transactionsData);
                setAllTransactions(allTrans);
                setTotalCount(response.data.totalCount);
                setNoDataMsg('');
            } 
            else
            {
                setNoDataMsg('NO DATA');
            }
        } 
        catch (error)
        {
            console.error('Error fetching transactions:', error);
        }
    }

    const handeDelete=(trans:TransactionAccount | null)=>
    {
        setDeleteModal(true);
        setCurrDelTrans(trans);

    }

    const handlePageChange = (page: number) => 
    {
        setCurrentPage(page);
        
    };

    const updateAccountTotalAmount = async(totalAm:number) =>
    {
        await axios.patch(config.pool+'account/'+ aId,{
            totalAm,
        });
    }

    const deleteTransaction = async(trans:TransactionAccount | null)=>
    {
        let total = account.totalAmount;
        if (trans!.isDeposit)
        {
            total -= trans!.transactionPrize;
        }
        else
        {
            total += trans!.transactionPrize;
        }
        updateAccountTotalAmount(total);
        setAccount({ ...account, totalAmount: total })
        setDeleteModal(false);
        await axios.delete(config.pool+'transaction/'+ trans!._id);
        getAllTransactions();
    }

    useEffect(()=>
    {
        getAccountById();
        getAllTransactions();

        if (!token.isExist || token.isExpire)
        {
            navigate('/');
        }
        
    },[currentPage,isEdit,account.totalAmount,startDate,endDate])

    return(
            
        <>
            
            <MainMenu decodedToken={token} />
       
            <Container className="cont">
                <Row className="w-100">
                    <Col lg="4" sm="4" className='first-col'>
                        <h2 className='acc-header'>Transactions</h2>
                    </Col>
                    <Col lg="8" sm="8" className='second-col'>
                        <Button onClick={()=> handleModal(setCategoryModal,false,null)} className='add-cat-btn' variant='primary'>Add new Category</Button>
                        <Button onClick={()=> handleModal(setTransactionModal,false, null)} className='acc-add-btn' variant='primary'>Add new Transaction</Button>
                    </Col>
                </Row>
                <Row className="w-100" id="acc-row">
                    <Col lg="6" sm="6" className='acc-name'>
                        <h3>{account.name}</h3>
                    </Col>
                    <Col lg="6" sm="6" className='acc-total-amount'>
                        <p>{`${account.totalAmount} EUR`}</p>
                    </Col>
                </Row>
                <Row className="line-graph" >
                    <Col lg="12" sm="12" className='col-line-graph'>
                        {
                            !noDataMsg && noDataMsg.length == 0 ?
                                <LineChart transactions={transactions} />
                                : <h2 className='no-data'>No data to display graf</h2> 
                        }
                       
                    </Col>
                </Row>
                <Row className="w-100" >
                    <Col lg="6" sm="12" className='trans-field'>
                        <>
                            <DatePicker 
                                maxDate={endDate ? endDate : new Date()} value={ startDate ? startDate.toLocaleDateString() : 'Start date'} 
                                className='date-picker' 
                                selected={startDate} 
                                onChange={(date) => setStartDate(date)}/>
                            <DatePicker 
                                maxDate={new Date()} 
                                value={ endDate ? endDate.toLocaleDateString() : 'End date'}
                                className='date-picker'
                                selected={endDate} 
                                onChange={(date) => setEndDate(date)} />
                        </>
   
                    </Col>
                   
                    <Col lg="6" sm="12" className='pag-col'>
                        <div className={!noDataMsg && noDataMsg.length == 0 ? '' : 'd-none'}>
                            <Pagination className='custom-pagination'>
                                <Pagination.First 
                                    onClick={() => handlePageChange(1)}  
                                    disabled={currentPage === 1} />
                                <Pagination.Prev 
                                    onClick={() => handlePageChange(currentPage - 1)}  
                                    disabled={currentPage === 1} />

                                {
                                    Array.from({ length: Math.ceil(totalCount / 10) }, (_, index) =>
                                        (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={index + 1 === currentPage}
                                                onClick={() => handlePageChange(index + 1)}>
                                                {index + 1}
                                            </Pagination.Item>
                                        )
                                    )}

                                <Pagination.Ellipsis />
                                <Pagination.Next 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === Math.ceil(totalCount / 10)} />
                                <Pagination.Last 
                                    onClick={() => handlePageChange(Math.ceil(totalCount / 10))} 
                                    disabled={currentPage === Math.ceil(totalCount / 10)}/>
                            </Pagination>
                        </div>
                    </Col>
                    
                </Row>
                <Row className='transactions'>
                    {
                        noDataMsg && noDataMsg.length != 0 ?
                            (
                                <>
                                    <h2 className='no-data'>NO DATA</h2>
                                </>
                            )
                            :(
                                transactions.map((trans) => 
                                {
                                    return (
                                        <>
                                            <div className='trans-div' >
                                                <Col lg="3" sm="3" className='trans-field'>
                                                    <p>{moment(trans.time).format('MMMM D, YYYY h:mm A')}</p>
                                                </Col>
                                                <Col lg="1" sm="2" className='trans-field'>
                                                    <p>{trans.categoryId.name}</p>
                                                </Col>
                                                <Col lg="3" sm="3" className='trans-field'>
                                                    <p>{trans.description}</p>
                                                </Col>
                                                <Col lg="2" sm="2" className='trans-prize'>
                                                    {
                                                        trans.isDeposit 
                                                            ? 
                                                            <p className='trans-prize-dep'>{`+${trans.transactionPrize} EUR`}</p>
                                                            :
                                                            <p className='trans-prize-not'>{`-${trans.transactionPrize} EUR`}</p>
                                                    }
                                                </Col>
                                                <Col lg="3" sm="2" className='trans-field'>
                                                    <Button className='remove-trans-btn' variant='danger' onClick={()=>handeDelete(trans)}>Remove</Button>
                                                    <Button onClick={()=> handleModal(setTransactionModal,true,trans)} className='edit-trans-btn' variant='primary'>Edit</Button>
                                                </Col>
                                            </div>
                                        </>     
                                    );
                                })
                            )
                    }
                </Row>
                <Row className="pie-charts" >
                    {
                        !noDataMsg && noDataMsg.length == 0 ?
                            <>
                                <Col lg="6" sm="6" className='acc-name'>
                                    <ComponentPieChart transactions={allTransactions} isDeposit={true} title='Share of deposit categories in transactions'/>
                                </Col>
                                <Col lg="6" sm="6" className='acc-name'>
                                    <ComponentPieChart transactions={allTransactions} isDeposit={false} title='Share of widrawal categories in transactions'/>
                                </Col>
                            </>
                            :
                            <h2 className='no-data'>No data to display graf</h2> 
                    }

                </Row>
                {
                    currDelTrans 
                        ?
                        <DeleteModal 
                            deleteModal={deleteModal}
                            setDeleteModal={setDeleteModal}
                            deleteErrorMessage={deleteErrorMessage}
                            setDeleteErrorMessage={setDeleteErrorMessage}
                            title={`Are you sure want delete transaction ${currDelTrans!.description}?`}
                            deleteMethod={() => deleteTransaction(currDelTrans)}
                        />
                        :
                        <></>
                }
                <TransactionModal 
                    transactionModal={transactionModal} 
                    setTransactionModal={setTransactionModal} 
                    currTransaction={currTrans} 
                    isEdit={isEdit}
                    setCurrTransaction={setCurrTrans}
                    fetchAllTransactions={getAllTransactions}
                    currTransPrize={currentTransactionPrize}
                    account={account}
                    setAccount={setAccount}
                />
                <CategoryModal
                    categoryModal={categoryModal}
                    setCategoryModal={setCategoryModal} 
                />
            </Container>
            
        </>
        
                
    )
}

export default TransactionPage