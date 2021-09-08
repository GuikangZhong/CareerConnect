import logo from '../media/logo.png';
import { Navbar, Tabs, Tab } from 'react-bootstrap';
import { useState } from 'react';
import UserSignupForm from '../components/SignupForm/UserSignupForm';
import CompanySignupForm from '../components/SignupForm/CompanySignupForm';
import Message from '../components/Common/Message';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Signup = () => {
    const [userOption, setUserOption] = useState('user');
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState("");
    const history = useHistory();
    const user = useCookies(['id', 'role'])[0];

    const closeMessage = () => {
        setOpenMessage(false);
        setMessage("");
        setMessageType("");
    }
    
    const signup = (e) => {
        e.preventDefault();
        const email = document.querySelector("#signup_email_" + userOption).value;
        const username = document.querySelector("#signup_name_" + userOption).value;
        const password = document.querySelector("#signup_password_" + userOption).value;
        document.querySelector("#signup_form_" + userOption).reset();

        const requestBody = {
            query: userOption === 'user' ? `
                mutation Signup($email: String!, $username: String!, $password: String!){
                    signup(userInput: {email: $email, username: $username, password: $password}) {
                        _id
                        email
                    }
                }
            ` : 
            `
                mutation CreateCompany($email: String!, $username: String!, $password: String!){
                    createCompany(companyInput: {email: $email, companyName: $username, password: $password}) {
                        _id
                        email
                    }
                }
            `,
            variables: {
                email: email,
                username: username,
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
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Signup failed');
            }
            return res.json();
        })
        .then(body => {             
            if (body.errors) {
                throw new Error(body.errors[0].message);
            } else {              
                setOpenMessage(true);
                setMessage("Please check you email to verify your account");
                setMessageType("success");
            }
        })
        .catch(err => {
            console.log(err);
            setOpenMessage(true);
            setMessage(err.message);
            setMessageType("error");
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
                    <h2 className="mt-4 mb-5">Sign Up</h2>
                </div>

                <Tabs transition={false} activeKey={userOption} onSelect={(k) => setUserOption(k)} className="justify-content-center align-items-center">
                    <Tab eventKey="user" title="User">
                        <UserSignupForm signup={signup} />
                    </Tab>
                    <Tab eventKey="company" title="Company">
                        <CompanySignupForm signup={signup} />
                    </Tab>
                </Tabs>

                <Message 
                    open={openMessage} 
                    message={message} 
                    handleClose={closeMessage}
                    type={messageType}
                />
            </div>
        )
    );
}

export default Signup;