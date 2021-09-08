import Navigation from '../components/Common/Navigation';
import { useState, useEffect } from 'react';
import UserCalendar from '../components/Schedules/UserCalendar';
import Message from '../components/Common/Message';

const Schedules = () => {
    const [show, setShow] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const closeMessage = () => {
        setOpenMessage(false);
        setMessage("");
        setMessageType("");
    }

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        let interview = {
            id: e.event._def.extendedProps._id,
            title: e.event.title,
            start: e.event.start,
            end: e.event.end,
            link: e.event._def.extendedProps.interviewURL,
            applicationId: e.event._def.extendedProps.application._id,
            status: e.event._def.extendedProps.application.history[0].status,
            companyName: e.event._def.extendedProps.application.job.creator.companyName
        };
        setSelectedInterview(interview);
        setShow(true);
    } 

    const getInterviews = () => {
        const requestBody = {
            query:
            `
                query GetUser {
                    getUser {
                        _id
                        username
                        schedule {
                            _id
                            title
                            start
                            end
                            color
                            interviewURL
                            application {
                                _id
                                history {
                                    status
                                }
                                job {
                                    creator {
                                        companyName
                                    }
                                }
                            }

                        }
                    }
                }
            `
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
                let schedules = body.data.getUser.schedule;   
                setInterviews(schedules);
                setIsLoaded(true);
            }
        })
        .catch(err => {
            console.log(err);
            setMessageType("error");
            setMessage(err.message);
            setOpenMessage(true);
        });
    }

    const interviewAction = (interviewStatus) => {
        const requestBody = {
            query:
            `
                mutation ChangeStatus($id: ID!, $code: Int!) {
                    changeStatus(id: $id, code: $code){
                        _id
                    }
                }
            `,
            variables: {
                id: selectedInterview.applicationId,
                title: selectedInterview.title,
                start: selectedInterview.start,
                end: selectedInterview.end,
                code: interviewStatus === 1 ? 2 : 3
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
                setMessage(interviewStatus === 1 ? "Interview accepted" : "Interview rejected");
                setOpenMessage(true);
                setMessageType("success");
                setShow(false);
                getInterviews();
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
        getInterviews();
    }, []);

    return (
        <>
            <Navigation />

            {isLoaded? 
                <UserCalendar
                    show={show}
                    handleClose={handleClose}
                    selectedInterview={selectedInterview}
                    interviewAction={interviewAction}
                    interviews={interviews}
                    handleShow={handleShow}
                />
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
    )

    
}

export default Schedules
