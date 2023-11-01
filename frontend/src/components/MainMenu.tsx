import { Button, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DecodedToken from '../model/token';


// eslint-disable-next-line max-len
function MainMenu({ hasToken, fullName, setDecodedToken }: { hasToken: boolean; fullName:string | undefined; setDecodedToken: React.Dispatch<React.SetStateAction<DecodedToken>> })
{
    const navigate = useNavigate();

    const setNavigate = (comp:string) =>
    {
        navigate(comp);
    }

    const doLogout=()=> 
    {
        localStorage.removeItem('token');
        setDecodedToken(prev => ({
            ...prev,value:null, isExpire:true, isExist:false
        }));
    }


    return (
        <Navbar className='menu' expand="lg">
            <Container>
                <Navbar.Brand className='nav-link' >{fullName}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="nav-item">
                    <Nav>
                        <Nav.Item >
                            <Nav.Link className='nav-link' onClick={()=>setNavigate('account')}>Account</Nav.Link>
                        </Nav.Item>
                        <Nav.Item >
                            <Nav.Link className='nav-link' onClick={()=>setNavigate('')}>Home</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Nav>
                        {hasToken && (
                            <Nav.Item className='nav-btn'>
                                <Button className='btn-logout' variant="danger" onClick={doLogout}>Logout</Button>
                            </Nav.Item>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MainMenu ;