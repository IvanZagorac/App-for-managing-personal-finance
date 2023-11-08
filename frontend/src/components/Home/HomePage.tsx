import { useEffect, useState } from 'react';
import { config } from '../../config/config';
import User from '../../model/Auth/user';
import { Alert,Button, Col,Container,Form} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegistrationModal from './RegistrationModal';
import DecodedToken from '../../model/Auth/token';
import { togetherFunction } from '../../config/token';


function HomePage()
{

    const navigate=useNavigate();
    const[user,setUser]=useState<User>({
        password:'',
        fullName:'',
        email:''
    });
    const[registerModal,setRegisterModal]=useState<boolean>(false);
    const[decodedToken,setDecodedToken] = useState<DecodedToken>({
        value: null,
        isExpire: false,
        isExist: false,
    });
    const [message,setMessage]= useState<string>('');


    const doLogin=async()=>
    {
        const response = await axios.post(config.pool + 'auth/login', {
            email: user.email,
            password: user.password
        });
        if (response.data.error && response.data.description)
        {
            setMessage(response.data.description);
        }
        else
        {
            const { token, user: userData } = response.data.resData;
            localStorage.setItem('token', token);
            setDecodedToken({ ...decodedToken,value: null, isExpire:false, isExist: true});
            navigate('account');
            setUser({ ...user, password: '', email: '' });
            setMessage('');
        }
    }

    const handleInputChange = (e:any) => 
    {
        const { id, value } = e.target;
        setUser((prevUser: any) => ({
            ...prevUser,
            [id]: value
        }));
    };

    const handleRegistrationModal =()=>
    {
        setRegisterModal(true);
    }
   

    useEffect(() => 
    {
        setDecodedToken(togetherFunction());

        if (decodedToken.isExist)
        {
            navigate('account')
        }
        
    }, [decodedToken.isExist]); 

    return(
        <Container className="cont">
            <div className="formWrapper">
                <h2 className="loginHeader">LOGIN</h2>
                <Form className="form">
                    <Col className="formColumn" lg="12" md="12" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="email">Email:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                id="email"
                                value={user.email}
                                onChange={event=> handleInputChange(event)}
                            />
                        </Form.Group>
                    </Col>

                    <Col className="formColumn" lg="12" md="12" sm="12">
                        <Form.Group>
                            <Form.Label htmlFor="password">Password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                id="password"
                                value={user.password}
                                onChange={event=> handleInputChange(event)}

                            />
                        </Form.Group>
                    </Col>

                    <Form.Group>
                        <Button className="loginBtn" onClick={()=>doLogin()} variant="primary">Login</Button>
                    </Form.Group>

                </Form>
                <Alert variant="danger" className={message ? '' : 'd-none'}>{message}</Alert>
            </div>
            <div className='registrationPart'>
                <h3 className='registerHeader'>Don't have an account ?</h3>
                {
                    // eslint-disable-next-line max-len
                    <Button className="registerBtn" onClick={()=>handleRegistrationModal()} variant="primary">Register</Button>
                }
               
            </div>
            <RegistrationModal registerModal={registerModal}
                setRegisterModal={setRegisterModal}/>
                
        </Container>
    )
}
export default HomePage