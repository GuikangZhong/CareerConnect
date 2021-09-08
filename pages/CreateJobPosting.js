import Navigation from '../components/Common/Navigation';
import CreateJobForm from '../components/CreateJob/CreateJobForm';
import { useEffect, useState } from 'react';
import Message from '../components/Common/Message';
import { useHistory, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const CreateJobPosting = () => {
    const [jobLabels, setJobLabels] = useState(['']);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    const user = useCookies(['id', 'role'])[0];
    const [allLabels, setAllLabels] = useState([]);

    const closeErrrorMessage = () => {
        setOpenErrorMessage(false);
        setErrorMessage("");
    }

    const createJob = (e) => {
        e.preventDefault();
        const title = document.querySelector("#create_job_title").value;
        const labels = jobLabels;
        const description = document.querySelector('#create_job_description').value;
        const requirement = document.querySelector('#create_job_requirements').value;
        const dueDate = document.querySelector("#create_job_deadline").value;
        const salary = document.querySelector('#create_job_salary').value;
        document.querySelector("#create_job_form").reset();

        const requestBody = {
            query: `mutation  CreateJob($title: String!, $labels: [String!]!, $description: String!, $requirement: String!, $dueDate: String!, $salary: String!){
                createJob(jobInput: {title: $title, labels: $labels, description: $description, requirement: $requirement, dueDate: $dueDate, salary: $salary}){
                    _id
                }

            }`,
            variables: {
                title: title,
                labels: labels,
                description: description, 
                requirement: requirement,
                dueDate: dueDate,
                salary: salary
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
            if(res.status !== 200){
                return new Error('Cannot create job posting');
            }
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
    }

    useEffect(() => {
        const requestBody = {
            query: `
                query {
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
                setAllLabels(body.data.getLabels);
            }
        })
        .catch(err => {
            console.log(err);
            setOpenErrorMessage(true);
            setErrorMessage(err.message);
        });
    }, []);

    return (
        ((!user.id || user.role !== "2") ? 
            <Redirect to="/"/> 
            :
            <>
                <Navigation />

                <div className="mt-5 ml-5 mt-5 mb-5">
                    <h2>Create a Job Posting</h2>
                </div>

                <div className="d-flex flex-column ml-5 mr-5 mb-5">
                    <CreateJobForm 
                        createJob={createJob}
                        setLabels={setJobLabels}
                        allLabels={allLabels}
                    />
                </div>

                <Message 
                    open={openErrorMessage} 
                    message={errorMessage} 
                    handleClose={closeErrrorMessage}
                    type="error"
                />
            </>
        )
    )
}

export default CreateJobPosting;