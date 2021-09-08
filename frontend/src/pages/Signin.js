import logo from '../media/logo.png';
import { Navbar, Tabs, Tab } from 'react-bootstrap';
import { useState } from 'react';
import UserSigninForm from '../components/SigninForm/UserSigninForm';
import CompanySigninForm from '../components/SigninForm/CompanySigninForm';
import Message from '../components/Common/Message';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Signin = () => {
    const [userOption, setUserOption] = useState('user');
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const user = useCookies(['id', 'role'])[0];
    const history = useHistory();

    const closeErrorMessage = () => {
        setOpenErrorMessage(false);
        setErrorMessage("");
    }

    const signin = (e) => {
        e.preventDefault();
        const email = document.querySelector("#signin_email_" + userOption).value;
        const password = document.querySelector("#signin_password_" + userOption).value;
        document.querySelector("#signin_form_" + userOption).reset();
        const requestBody = {
            query: userOption === 'user' ? `
                query Signin($email: String!, $password: String!) {
                    signin(email: $email, password: $password) {
                        username
                        email
                        role
                    }
                }
            `:
            `
                query SigninCompany($email: String!, $password: String!) {
                    signinCompany(email: $email, password: $password) {
                        username
                        email
                        role
                    }
                }              
            `
            ,
            variables: {
                email: email,
                password: password
            }
        };
        
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            return res.json();
        })
        .then(body => {
            if (body.errors) {
                throw new Error(body.errors[0].message);
            } else {              
                history.push("/");
            }
        })
        .catch(err => {
            console.log(err);
            setOpenErrorMessage(true);
            setErrorMessage(err.message);
        });
    };

    return (
        (user.id ? 
            <Redirect to="/"/> 
            :
            <div>
                <Navbar bg="light">
                    <Navbar.Brand as={Link} to="/">
                        <img src={logo} className="navbar_logo_img"/>
                    </Navbar.Brand>
                </Navbar>

                <div className="text-center mt-3">
                    <h2 className="mt-4 mb-5">Sign In</h2>
                </div>

                <Tabs transition={false} activeKey={userOption} onSelect={(k) => setUserOption(k)} className="justify-content-center align-items-center">
                    <Tab eventKey="user" title="User">
                        <UserSigninForm signin={signin}/>
                    </Tab>
                    <Tab eventKey="company" title="Company">
                        <CompanySigninForm signin={signin}/>
                    </Tab>
                </Tabs>


                <Message 
                    open={openErrorMessage} 
                    message={errorMessage} 
                    handleClose={closeErrorMessage}
                    type="error"
                />
            </div>
        )
    );
}

export default Signin;