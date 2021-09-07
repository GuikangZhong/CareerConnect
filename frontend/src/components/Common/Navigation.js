import logo from '../../media/logo.png';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';

const Navigation = () => {
    const user = useCookies(['id', 'role'])[0];
    const authContextProvider = useContext(AuthContext);
    const handleLogout = authContextProvider.handleLogout;
    
    const signout = () => {
        handleLogout();
    }

    return (
        <Navbar bg="light">
            <Navbar.Brand href="/">
                <img src={logo} className="navbar_logo_img"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-menu" />
            <Navbar.Collapse id="navbar-menu">
                {!user.id && 
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Jobs</Nav.Link>
                    </Nav>
                }
                {(user.role === "1" && user.id) && 
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Jobs</Nav.Link>
                        <Nav.Link as={Link} to="/schedule">Schedule</Nav.Link>
                        <Nav.Link as={Link} to="/applications">Applications</Nav.Link>
                    </Nav>
                }
                {(user.role === "2" && user.id) && 
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Job Postings</Nav.Link>
                        <Nav.Link as={Link} to={"/profile/" + user.id}>Profile</Nav.Link>
                    </Nav>
                }

                {!user.id && 
                    <Nav>
                        <Link to="/signin">
                            <Button variant="outline-primary" className="mr-sm-2">Sign In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="outline-primary">Sign Up</Button>
                        </Link>
                    </Nav>
                }
                {((user.role === "1" || user.role === "2") && user.id) && 
                    <Nav>
                        <Button variant="outline-secondary" onClick={signout}>Sign Out</Button>
                    </Nav>
                }
            </Navbar.Collapse>
        </Navbar>
    );
}
  
export default Navigation;
  