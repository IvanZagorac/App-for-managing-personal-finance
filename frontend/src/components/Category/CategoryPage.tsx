/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Modal, Pagination, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MainMenu from '../MainMenu';
import Account from '../../model/Account/account';
import { config } from '../../config/config';
import axios from 'axios';
import DecodedToken from '../../model/Auth/token';
import { togetherFunction } from '../../config/token';
import ajvMess from '../../model/Auth/ajv';
import Category from '../../model/Category/category';

function CategoryPage()
{

    // const[decodedToken,setDecodedToken] = useState<DecodedToken>({
    //     value: null,
    //     isExpire: false,
    //     isExist: true,
    // })
    const[allCategories,setAllCategories] = useState<Category[]>([])
    const[category,setCateogry]=useState<Category>({
        _id:'',
        name:'',
        isDeposit:false,
        userId:''
    })
    const[currCategory,setCurrCategory] = useState<Category | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const[filterIsDeposit,setFilterIsDeposit]=useState<boolean>(false);
    const[isEdit,setIsEdit] = useState<boolean>(false);
    const[totalCount,setTotalCount]=useState<number>(0);
    const[categoryModal,setCategoryModal] = useState<boolean>(false);
    const[noDataMsg,setNoDataMsg] = useState<string>('');
    const[errorMessage,setErrorMessage] =useState<ajvMess[]>([]);
    const navigate = useNavigate();

    const token = togetherFunction();
    const upsertCategory = async()=>
    {
        try
        {
            let responseBody:any;
            if (isEdit)
            {
                responseBody = {
                    _id:currCategory?._id,
                    name:currCategory?.name,
                    isDeposit:currCategory?.isDeposit,
                    userId:currCategory?.userId
                }
            }
            else
            {
                responseBody = {
                    name:category.name,
                    isDeposit:category.isDeposit,
                    userId:token.value?._id
                }
                
            }
            const response = await axios.post(config.pool + 'category', responseBody);
            
            if (response.data.error)
            {
                setErrorMessage(response.data.ajvMessage);
            }
            else
            {
                setCateogry(response.data.resData);
                setCategoryModal(false);
                setCateogry({ ...category,_id:'', name: '' , isDeposit:false, userId:''});
                setErrorMessage([]);
                await getAllCategories();
            }
        }
        catch(e)
        {
            console.warn(e);
        }
        
    }

    const getAllCategories=async ()=>
    {
        const userId = token.value?._id;
        const response = await axios.get(config.pool+'category/filterDeposit',{
            params: { filterIsDeposit, userId, currentPage }
        })
        if (response.data.error)
        {
            setNoDataMsg('NO DATA');
        }
        else
        {
            setAllCategories(response.data.resData);
            setTotalCount(response.data.totalCount);
            setNoDataMsg('');
        }
       
    }

    const handlePageChange = (page: number) => 
    {
        setCurrentPage(page);
        
    };

    const handleInputChange = (e:any) => 
    {
        const { id, value } = e.target;
        if (isEdit)
        {
            setCurrCategory((prevUser: any) => 
            {
                return ({
                    ...prevUser,
                    [id]: value
                });
            }
            );
        }
        else
        {
            setCateogry((prevUser: any) => ({
                ...prevUser,
                [id]: value
            }));
        }
    };

    // const deleteCategory = async(id:string)=>
    // {
    //     await axios.delete(config.pool+'category/'+id);
    //     getAllCategories();
    // }

    const handleModal =(setModal:any,trueOrFalse:boolean,currCat:Category | null)=>
    {
        setModal(true);
        setIsEdit(trueOrFalse);
        setCurrCategory(currCat);
    }

    const handleOnHide=()=>
    {
        setCategoryModal(false);
        setCateogry({
            _id:'',
            name: '',
            isDeposit:false,
            userId:''
        });

    }

    const setUpsertIsDeposit = () =>
    {
        if (isEdit && currCategory != null)
        {
            setCurrCategory({ ...currCategory, isDeposit: !currCategory.isDeposit })
        }
        else
        {
            setCateogry({ ...category, isDeposit: !category.isDeposit })
        }
    }

    
    useEffect(()=>
    {
        getAllCategories();

        if (!token.isExist || token.isExpire)
        {
            navigate('/');
        } 
        
    },[filterIsDeposit,isEdit,currentPage])

    return(
        <>
            {
                <MainMenu decodedToken={token}/>
            }
           
            <Container className="cont">
                <Row className="header-cat">
                    <Col lg="4" sm="4" className='first-col'>
                        <h2 className='acc-header'>Categories</h2>
                        <Form.Check
                            type="checkbox"
                            label='isDeposit'
                            checked={filterIsDeposit}
                            onChange={() => setFilterIsDeposit(!filterIsDeposit)}
                            className="custom-checkbox-cat"
                            id="isDepositCheckbox"
                        />
                    </Col>
                    
                    <Col lg="8" sm="8" className='second-col'>
                        <Button onClick={()=> handleModal(setCategoryModal,false,null)} className='add-cat-btn' variant='primary'>Add Category</Button>
                    </Col>
                </Row>
                <Row className="w-100">
                    <Col lg="12" sm="12" className='trans-field'>
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
                    {
                        
                        noDataMsg && noDataMsg.length != 0 ?
                            (
                                <>
                                    <h2 className='no-data'>NO DATA</h2>
                                </>
                            )
                            :
                            (
                                allCategories.map((cat) => 
                                {
                                    if (token.value && cat.userId === token.value._id ) 
                                    {
                                        return (
                                            <>
                                                <div style={{borderBottom:'1px solid white ', display:'flex',marginBottom:'30px'}}>
                                                    <Col lg="6" sm="6" className='trans-field'>
                                                        <p>{cat.name}</p>
                                                    </Col>
                                                    <Col lg="6" sm="6" className='trans-field'>
                                                        {
                                                        // <Button className='card-header-btn' variant='danger' onClick={()=>deleteCategory(cat._id)}>Remove</Button>
                                                        }
                                                        <Button onClick={()=> handleModal(setCategoryModal,true,cat)} className='acc-add-btn' variant='primary'>Edit Category</Button>
                                                    </Col>
                                                </div>
                                  
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
                show={categoryModal}
                onHide={() => handleOnHide()}>
                <Modal.Header closeButton>
                    <Modal.Title>{ currCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
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
                                    value={isEdit ? currCategory?.name : category.name}
                                    onChange={event=> handleInputChange(event)}
                                />
                            </Form.Group>
                        </Col>

                        <Col className="formColumn" lg="12" md="12" sm="12">
                            <Form.Check
                                type="checkbox"
                                label='isDeposit'
                                checked={isEdit ? currCategory?.isDeposit : category.isDeposit}
                                onChange={() => setUpsertIsDeposit()}
                                className="custom-checkbox"
                                id="isDepositCheckbox"
                            />
                        </Col>

                        <Form.Group className='btn-group'>
                            <Button className="transBtn" onClick={()=>upsertCategory()} variant="primary">{ currCategory ? 'Edit Category' : 'Add Category'}</Button>
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
        </>
    )
}

export default CategoryPage ;