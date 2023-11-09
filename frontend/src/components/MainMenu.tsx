/* eslint-disable max-len */
import { Button, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MainMenu(decodedToken:any)
{
    const navigate = useNavigate();

    const setNavigate = (comp:string) =>
    {
        navigate(comp);
    }

    const doLogout=()=> 
    {
        localStorage.removeItem('token');
        navigate('/');
    }


    return (
        <Navbar className='menu' expand="lg">
            <Container>
                <Navbar.Brand className='nav-link' >{decodedToken.decodedToken.value?.fullName}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="nav-item">
                    <Nav>
                        <Nav.Item >
                            <Nav.Link className='nav-link' onClick={()=>setNavigate('/account')}>Accounts</Nav.Link>
                        </Nav.Item>
                        <Nav.Item >
                            <Nav.Link className='nav-link' onClick={()=>setNavigate('/category')}>Categories</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Nav>
                        {decodedToken.decodedToken.isExist && (
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