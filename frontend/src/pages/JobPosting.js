import './JobPosting.css';
import Navigation from '../components/Common/Navigation';
import JobPostingHeader from '../components/JobPosting/JobPostingHeader';
import ResumeUpload from '../components/JobPosting/ResumeUpload';
import JobPostingBody from '../components/JobPosting/JobPostingBody';
import CandidateList from '../components/JobPosting/CandidateList/CandidateList';
import Message from '../components/Common/Message';
import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const JobPosting = () => {
    const { id } = useParams();
    const user = useCookies(['id', 'role'])[0];
    const [resumeUploadShow, setResumeUploadShow] = useState(false);
    const [job, setJob] = useState({});
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const actionFeedback = (msg, msgType) => {
        setOpenMessage(true);
        setMessage(msg);
        setMessageType(msgType);
    }

    const getJob = () => {
        const requestBody = {
            query: user.role === "2" ?
            `
                query GetJob($id: ID!) {
                    getJob(id: $id) {
                        _id
                        title
                        labels
                        requirement
                        description
                        dueDate
                        creator {
                            companyName
                            _id
                            profile {
                                logo {
                                    location
                                }
                                location
                            }
                        }
                        applications {
                            _id
                            files {
                                location
                            }
                            applicant {
                                _id
                                username
                                email
                            }
                            history {
                                status
                                interviewURL
                            }
                        }
                        createdAt
                        salary
                    }
                }
            `
            :
            `
                query GetJob($id: ID!) {
                    getJob(id: $id) {
                        _id
                        title
                        labels
                        requirement
                        description
                        dueDate
                        creator {
                            companyName
                            _id
                            profile {
                                logo {
                                    location
                                }
                                location
                            }
                        }
                        createdAt
                        salary
                    }
                }
            `
            ,
            variables: {
                id: id
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
                let j = body.data.getJob;
                j.createdAt = new Date(j.createdAt);
                j.dueDate = new Date(j.dueDate);      
                setJob(j);
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
        getJob();
    }, []);

    const closeMessage = () => {
        setOpenMessage(false);
        setMessageType("");
        setMessage("");
    }
    
    const submitResume = (files) => {
       let len = files.length;
       let files_list = [];
       let map = `{`;
       for (let i = 0; i < len; i++){
           files_list.push(null);
           map = map + '"' + i + '": ["variables.'+"files." + i +'"]';
           if(i != len - 1){
               map = map+ ", "
           }
       }
       map = map + "}";
        const requestBody = {
            query: 
                `mutation ResumeSubmit($jobId: ID!, $files: [Upload!]!){
                    applyJob(jobId: $jobId, files:$files){
                        files {
                            location
                        }
                    }
                }`
            ,
            variables: {
                "jobId": job._id,
                "files": files_list
            }
        };

        const formData = new FormData();
        formData.append('operations', JSON.stringify(requestBody));
        formData.append("map", map); 
        for (let j = 0; j < len; j++){
            formData.append(j, files[j]);
        }
        fetch('/graphql', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Cannot upload your resume');
            }
            return res.json();
        })
        .then(body => {             
            if (body.errors) {
                throw new Error(body.errors[0].message);
            } else {              
                setOpenMessage(true);
                setMessage("Applied successfully");
                setMessageType("success");
            }
        })
        .catch(err => {
            console.log(err);
            setOpenMessage(true);
            setMessage(err.message);
            setMessageType("error");
        });
    }

    return (
        <>
            <Navigation />

            {isLoaded ?
            <>
                {(user.role === "2" && user.id !== job.creator._id) ? 
                    <Redirect to="/"/> 
                    :
                    <>
                        <div className="mt-5 mr-5 ml-5 pb-3 border-bottom d-flex">
                            <JobPostingHeader 
                                title={job.title} 
                                location={"location"} 
                                dateCreated={job.createdAt} 
                                salary={job.salary} 
                                labels={job.labels}
                                company={job.creator}
                            />

                            <div className="d-flex w-25 justify-content-end align-items-start mt-3">
                                {user.role === "1" && <Button variant="outline-primary" className="pl-5 pr-5 apply_btn" onClick={() => setResumeUploadShow(true)} disabled={job.dueDate < new Date()}>Apply</Button>}
                            </div>

                            {user.role === "1" && 
                                <ResumeUpload
                                    show={resumeUploadShow}
                                    onHide={() => setResumeUploadShow(false)}
                                    jobId={job._id}
                                    submitResume={submitResume}
                                />
                            }
                        </div>

                        <div className="mt-4 mr-5 ml-5 pb-3">
                            <JobPostingBody 
                                requirements={job.requirement} 
                                description={job.description} 
                                dateExpired={job.dueDate}
                            />

                            {(user.role === "2" && user.id === job.creator._id) && 
                                <CandidateList 
                                    candidates={job.applications}
                                    interviewName={job.creator.companyName + "'s "  + job.title}
                                    actionFeedback={actionFeedback}
                                    jobId={job._id}
                                />
                            }
                        </div>
                    </>
                }
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

export default JobPosting;