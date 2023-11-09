/* eslint-disable max-len */
import { Button, Col, Container,Row } from 'react-bootstrap'
import { Pagination } from 'react-bootstrap';
import MainMenu from '../MainMenu'
import { RefObject, useEffect, useRef, useState } from 'react';
import { togetherFunction } from '../../config/token';
import { useNavigate, useParams } from 'react-router-dom';
import DecodedToken from '../../model/Auth/token';
import TransactionModal from './TransactionModal';
import CategoryModal from './CategoryModal';
import axios from 'axios';
import { config } from '../../config/config';
import AccountById from '../../model/Account/accountById';
import moment from 'moment';
// import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import Chart from 'chart.js/auto';
import 'chart.js/auto';
import PopulatedTransaction from '../../model/Transaction/populatedTransaction';

//   interface DateRangePickerData {
//     startDate: Date | undefined;
//     endDate: Date | undefined;
//   }

function TransactionPage()
{
    
    const navigate=useNavigate();
    const {aId} = useParams();
    const[transactionModal,setTransactionModal]=useState<boolean>(false);
    // const [dateRange, setDateRange] = useState<DateRangePickerData>({
    //     startDate: undefined,
    //     endDate: undefined,
    // });
    const[transactions,setTransactions]=useState<PopulatedTransaction[]>([]);
    const[currentTransactionPrize,setCurrentTransactionPrize]=useState<number>(0);
    const[currTrans,setCurrTrans]=useState<PopulatedTransaction | null>(null);
    const[noDataMsg,setNoDataMsg] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const[totalCount,setTotalCount]=useState<number>(0);
    const[isEdit,setIsEdit] = useState<boolean>(false);
    const[account,setAccount] = useState<AccountById>({
        userId:'',
        name:'',
        totalAmount:0,
    })
    const[categoryModal,setCategoryModal]=useState<boolean>(false);
    const[decodedToken,setDecodedToken] = useState<DecodedToken>({
        value: null,
        isExpire: false,
        isExist: true,
    })
    
    const handleModal =(setModal:any,trueOrFalse:boolean,currTrans:PopulatedTransaction | null)=>
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
                params: { currentPage, aId }
            });
            if (!response.data.error)
            {
                const transactionsData = response.data.resData;
                setTransactions(transactionsData);
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

    // const lineGraph = () =>
    // {
    //     if (chartRef.current) 
    //     {
    //         const ctx = chartRef.current.getContext('2d');
      
    //         // Extract data for the graph from your transactions state
    //         const months = transactions.map((transaction) => moment(transaction.time).format('MMMM'));
    //         const totalAmounts = transactions.map((transaction) => transaction.totalAmount);
      
    //         // Create the line chart
    //         new Chart(ctx, {
    //             type: 'line',
    //             data: {
    //                 labels: months,
    //                 datasets: [
    //                     {
    //                         label: 'Total Amount',
    //                         data: totalAmounts,
    //                         borderColor: 'blue', // Color for the line
    //                         fill: false, // Don't fill the area under the line
    //                     },
    //                 ],
    //             },
    //             options: {
    //                 responsive: true,
    //                 maintainAspectRatio: false, // Set to false to control the chart size yourself
    //             },
    //         });
    //     }
    // }

    const deleteTransaction = async(trans:PopulatedTransaction | null)=>
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
        await axios.delete(config.pool+'transaction/'+ trans!._id);
        getAllTransactions();
    }

    useEffect(()=>
    {
        setDecodedToken(togetherFunction());
        getAccountById();
        getAllTransactions();

        if (!decodedToken.isExist || decodedToken.isExpire)
        {
            navigate('/');
        }
        
    },[decodedToken.isExpire, decodedToken.isExist,currentPage,isEdit,account.totalAmount])

    return(
            
        <>
            {
                // eslint-disable-next-line max-len
                <MainMenu hasToken={decodedToken.isExist} fullName={decodedToken.value?.fullName} setDecodedToken={setDecodedToken} />
            }
       
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
                <Row className="w-100" >
                    <Col lg="12" sm="12" className='acc-name'>
                        <canvas id="lineChart" width="400" height="200"></canvas>
                    </Col>
                </Row>
                <Row className="w-100" >
                    {/* <Col lg="6" sm="6" className='trans-field'>
                        <div className={transactions.length != 0 ? '' : 'd-none'}>
                            <DateRangePickerComponent placeholder="Enter Date Range"
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                                // min={minDate}
                                // max={maxDate}
                                minDays={2}
                                format="dd-MMM-yy"
                                //Uncomment below code to show month range picker. Also comment the properties min, max, mindays and maxdays
                                // start="Year"
                                // depth="Year"
                            ></DateRangePickerComponent>
                        </div>
                    </Col> */}
                    <Col lg="12" sm="12" className='trans-field'>
                        <div className={transactions.length != 0 ? '' : 'd-none'}>
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
                                            <div style={{borderBottom:'1px solid white ', display:'flex',marginBottom:'30px'}}>
                                                <Col lg="3" sm="3" className='trans-field'>
                                                    <p>{moment(trans.time).format('MMMM D, YYYY h:mm A')}</p>
                                                </Col>
                                                <Col lg="1" sm="1" className='trans-field'>
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
                                                <Col lg="3" sm="3" className='trans-field'>
                                                    <Button className='card-header-btn' variant='danger' onClick={()=>deleteTransaction(trans)}>Remove</Button>
                                                    <Button onClick={()=> handleModal(setTransactionModal,true,trans)} className='edit-trans-btn' variant='primary'>Edit Transaction</Button>
                                                </Col>
                                            </div>
                                        </>     
                                    );
                                })
                            )
                            

                        
                    }
                </Row>
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