import Navigation from '../components/Common/Navigation';
import ApplicationHeader from '../components/Application/ApplicationHeader';
import ApplicationBody from '../components/Application/ApplicationBody';
import Message from '../components/Common/Message';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Application = () => {
    const { applicationId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [application, setApplication] = useState({});

    const closeMessage = () => {
        setOpenMessage(false);
        setMessageType("");
        setMessage("");
    }

    const statusAction = (status) => {
        const requestBody = {
            query:
            `
                mutation ChangeStatus($id: ID!, $code: Int!) {
                    changeStatus(id: $id, code: $code){
                        _id
                        job {
                            _id
                            title
                            creator {
                                _id
                                companyName
                                profile {
                                    location
                                    logo{
                                        location
                                    }
                                }
                            }
                        }
                        history {
                            status
                            modifiedDate
                            interviewTime
                        }
                        createdAt
                    }
                }
            `,
            variables: {
                id: application._id,
                code: status
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
                setApplication(body.data.changeStatus);
                setOpenMessage(true);
                setMessageType("success");
                if (status === 2) {
                    setMessage("Interview Accepted");
                } else if (status === 3) {
                    setMessage("Interview Rejected");
                } else if (status === 5) {
                    setMessage("Offer Accepted");
                } else if (status === 7) {
                    setMessage("Offer Rejected")
                }
            }
        })
        .catch(err => {
            console.log(err);
            setOpenMessage(true);
            setMessage(err.message);
            setMessageType("error");
        });
    }

    const getApplication = () => {
        const requestBody = {
            query:
            `
                query getApplication($id: ID!) {
                    getApplication(id: $id) {
                        _id
                        job {
                            _id
                            title
                            creator {
                                _id
                                companyName
                                profile {
                                    location
                                    logo{
                                        location
                                    }
                                }
                            }
                        }
                        history {
                            status
                            interviewTime
                            interviewURL
                            modifiedDate
                        }
                        createdAt
                    }
                }
            `,
            variables: {
                id: applicationId
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
                setApplication(body.data.getApplication);
                setIsLoaded(true);
            }
        })
        .catch(err => {
            console.log(err);
            setOpenMessage(true);
            setMessage(err.message);
            setMessageType("error");
        });
    }

    useEffect(() => {
        getApplication();
    }, []);

    return (
        <>
            <Navigation />

            {isLoaded ? 
                <>
                    <ApplicationHeader 
                        title={application.job.title} 
                        location={application.job.creator.location} 
                        dateApplied={application.createdAt} 
                        status={application.history[0].status} 
                        company={application.job.creator}
                    />

                    <ApplicationBody 
                        process={application.history}
                        curStatus={application.history[0].status}
                        statusAction={statusAction}
                    />
                </>
                :
                <></>
            }

            <Message 
                open={openMessage} 
                message={message} 
                handleClose={closeMessage}
                type={messageType}
            />
        </>
    );
}

export default Application;