import Navigation from '../components/Common/Navigation';
import ApplicationList from '../components/ApplicationList/ApplicationList';
import Pagination from '../components/Common/Pagination';
import Message from '../components/Common/Message';
import { useState, useEffect } from 'react';

const Applications = () => {
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [applications, setApplications] = useState([]);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const closeErrorMessage = () => {
        setOpenErrorMessage(false);
        setErrorMessage("");
    }

    const prePage = () => {
        if (curPage > 1) {
            setCurPage(curPage - 1);
        }
    }

    const nextPage = () => {
        if (curPage < totalPage) {
            setCurPage(curPage + 1);
        }
    }

    const getTotalPage = () => {
        const requestBody = {
            query: `
                query GetTotalApplicationsPages {
                    getTotalApplicationsPages
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
                setTotalPage(body.data.getTotalApplicationsPages);
            }
        })
        .catch(err => {
            console.log(err);
            setOpenErrorMessage(true);
            setErrorMessage(err.message);
        });
    }

    const getAllApplications = (page) => {
        const requestBody = {
            query:
            `
                query GetAllApplications($page: Int!) {
                    getApplicationsByUser(page: $page) {
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
                        }
                        createdAt
                    }
                }
            `,
            variables: {
                page: page - 1
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
                setApplications(body.data.getApplicationsByUser);
                setCurPage(page);
                setIsLoaded(true);
            }
        })
        .catch(err => {
            console.log(err);
            setOpenErrorMessage(true);
            setErrorMessage(err.message);
        });
    }

    useEffect(() => {
        getTotalPage();
        getAllApplications(curPage);
    }, []);

    return (
        <>
            <Navigation />

            {isLoaded ?
                <>
                    <ApplicationList applications={applications}/>
                    
                    {!applications.length ?
                        <></>
                        :
                        <Pagination curPage={curPage} totalPage={totalPage} nextPage={nextPage} prePage={prePage}/>
                    }
                </>
                :
                <></>
            }

            <Message 
                open={openErrorMessage} 
                message={errorMessage} 
                handleClose={closeErrorMessage}
                type="error"
            />
        </>
    );
}

export default Applications;