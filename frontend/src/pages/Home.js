import Navigation from '../components/Common/Navigation';
import JobList from '../components/HomePage/JobList/JobList';
import JobPostingList from '../components/HomePage/JobPostingList/JobPostingList';
import Pagination from '../components/Common/Pagination';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Message from '../components/Common/Message';
import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";

const Home = () => {
    const user = useCookies(['id', 'role'])[0];
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [jobs, setJobs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [labels, setLabels] = useState([""]);
    const [preSearch, setPreSearch] = useState("");

    const getTotalPage = () => {
        const requestBody = {
            query: `
                query {
                    getTotalPages
                    getLabels
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
                setTotalPage(body.data.getTotalPages);
                setLabels(body.data.getLabels);
            }
        })
        .catch(err => {
            console.log(err);
            setOpenErrorMessage(true);
            setErrorMessage(err.message);
        });
    }

    const getAllJobs = (page, selected) => {
        const requestBody = {
            query: user.role === "2" ?
            `
                query GetAllJobs($page: Int!, $searchKeyword: String!, $labels: [String!]!) {
                    getAllJobs(page: $page, searchKeyword: $searchKeyword , labels: $labels) {
                        _id
                        title
                        dueDate
                        creator {
                            companyName
                            profile {
                                location
                            }
                        }
                        labels
                        applications {
                            _id
                        }
                    }
                }
            `:
            `
                query GetAllJobs($page: Int!, $searchKeyword: String!, $labels: [String!]!) {
                    getAllJobs(page: $page, searchKeyword: $searchKeyword , labels: $labels) {
                        _id
                        title
                        labels
                        dueDate
                        creator {
                            companyName
                            _id
                            profile {
                                location
                                logo {
                                    location
                                }
                            }
                        }
                        createdAt
                        salary
                    }
                }
            `
            ,
            variables: {
                page: page - 1,
                searchKeyword: searchKeyword,
                labels: selected? selected : labels
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
                setJobs(body.data.getAllJobs);
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
        getAllJobs(curPage);
    }, []);

    const closeErrorMessage = () => {
        setOpenErrorMessage(false);
        setErrorMessage("");
    }

    const prePage = () => {
        if (curPage > 1) {
            getAllJobs(curPage - 1);
        }
    }

    const nextPage = () => {
        if (curPage < totalPage) {
            getAllJobs(curPage + 1);
        }
    }

    const search = (e) => {
        e.preventDefault();
        setPreSearch(searchKeyword);
        setSearchKeyword("");
        setLabels([]);
        getAllJobs(curPage);
    }

    const filterJobs = (selected) => {
        setLabels(selected);
        getAllJobs(curPage, selected);
    }

    const handleChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    return (
        <>
            <Navigation />

            {isLoaded ?
            <>
            {(!user.id || user.role === "1") ? (
                <div className="mt-3 w-75 mx-auto">
                    <h2 className="mt-4 mb-4">Jobs {preSearch && `related to "${preSearch}"`}</h2>
                </div>
            ) : (
                <div className="mt-3 w-75 mx-auto d-flex justify-content-between align-items-center">
                    <h2 className="mt-4 mb-4">Job Postings {preSearch && `related to "${preSearch}"`}</h2>
                    <Button as={Link} to="/createjob" variant="outline-primary">Create a new job posting</Button>
                </div>
            )}
            
            <div className="d-flex flex-column align-items-center">
                <Form onSubmit={search} id="search_form" className="w-75 mb-4">
                    <InputGroup>
                        <FormControl 
                            type="text" 
                            placeholder="Search for a job position" 
                            id="search_input" 
                            value={searchKeyword}
                            onChange={handleChange}/>
                        <InputGroup.Append>
                            <Button type="submit">                            
                                Search<FontAwesomeIcon icon={faSearch} className="ml-2" />
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>

                <div className="job_filter bg-light w-75 pt-2 pb-2 border rounded mb-4">
                    <DropdownMultiselect
                        options={labels}
                        name="job_positions"
                        placeholder="Job Positions"
                        buttonClass="ml-3 bg-light border"
                        handleOnChange={filterJobs}
                    />
                </div>
            </div>

            {(!user.id || user.role === "1") && 
                <JobList 
                    jobs={jobs}
                />
            }
            
            {user.role === "2" && 
                <JobPostingList 
                    jobs={jobs}
                />
            }

            {!jobs.length ?
                <></>
                :
                <Pagination curPage={curPage} totalPage={totalPage} nextPage={nextPage} prePage={prePage}/>
            }

            <div className="text-center mb-3">
                <Link to="/credits">credits</Link>
            </div>
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

export default Home;