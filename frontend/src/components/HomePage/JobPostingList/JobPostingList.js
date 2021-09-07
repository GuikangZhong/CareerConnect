import JobPostingCard from './JobPostingCard';

const JobPostingList = ({jobs}) => {
    return (
        <div>
            {!jobs.length ?
                <div className="w-75 mx-auto">
                    <h4 className="mt-3 mb-5">No jobs available</h4>
                </div>
                :
                <div className="d-flex flex-column align-items-center">
                    {jobs.map((job) => (
                        <JobPostingCard key={job._id} job={job} />
                    ))}
                </div>
            }
        </div>
    );
}

export default JobPostingList;