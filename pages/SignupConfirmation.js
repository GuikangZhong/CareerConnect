import logo from '../media/logo.png';
import { Navbar, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { faCheck} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SignupConfirmation.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SignupConfirmation = () => {
    const user = useCookies(['id', 'role'])[0];
    const { token } = useParams();
    const [registered, setRegistered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const confirmSignup = () => {
        const requestBody = {
            query: 
            `
                mutation ConfirmRegister($token: String!) {
                    confirmRegister(token: $token)
                }
            `
            ,
            variables: {
                token: token
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
            } else if (!body.data.confirmRegister) {
                setIsLoaded(true);              
                setRegistered(false);
            } else {
                setIsLoaded(true);
                setRegistered(true);
            }
        })
        .catch(err => {
            console.log(err);
        });
    };

    useEffect(() => {
        confirmSignup();
    }, []);

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

                {isLoaded ? 
                    <>
                    {registered ? (
                            <>
                            <div className="text-center mt-5 mb-5">
                            <h2 className="mt-5 mb-5 text-success">
                                <FontAwesomeIcon icon={faCheck} className="mr-3"/>
                                You have signed up to Career Connect!
                            </h2>
                            </div>

                            <div className="text-center">
                                <Button as={Link} className="mr-3 pt-2 pb-2 pr-3 pl-3 confirm_action_btn" to="/" variant="outline-primary">Back to home</Button>
                                <Button as={Link} className="pt-2 pb-2 pr-3 pl-3 confirm_action_btn" to="/signin" variant="outline-primary">Sign in to your account</Button>
                            </div>
                            </>
                        ) : (
                            <div className="text-center mt-5 mb-5">
                                <h2 className="mt-5 mb-5 text-danger">Something went wrong</h2>
                            </div>
                        )}
                    </>
                    :
                    <></>
                }
            </div>
        )
    );
}

export default SignupConfirmation;