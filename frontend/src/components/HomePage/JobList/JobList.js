import JobCard from './JobCard';
import './JobList.css';

const JobList = ({jobs}) => {
    return (
        <div className="d-flex flex-column align-items-center">
            {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
            ))}
        </div>
    );
}

export default JobList;