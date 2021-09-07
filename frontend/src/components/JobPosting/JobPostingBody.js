import './JobPostingBody.css';
const JobPostingBody = ({description, requirements, dateExpired}) => {
    return (
        <>
            <div className="mb-5">
                <h5 className="job_posting_body_heading mb-3">Job Description:</h5>
                <p className="job_posting_body_text">{description}</p>
            </div>
            <div className="mb-5">
                <h5 className="job_posting_body_heading mb-3">Requirements:</h5>
                <p className="job_posting_body_text">{requirements}</p>
            </div>
            <div className="mb-5 d-flex align-items-end">
                <h5 className="job_posting_body_heading mb-3">Deadline to apply:</h5>
                <p className="job_posting_body_text ml-3">{dateExpired.toLocaleDateString()}</p>
            </div>
        </>
    );
}

export default JobPostingBody;