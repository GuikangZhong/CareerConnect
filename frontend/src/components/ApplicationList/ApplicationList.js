import ApplicationCard from './ApplicationCard';

const ApplicationList = ({applications}) => {
    return (
        <div>
            <div className="mt-3 w-75 mx-auto">
                <h2 className="mt-4 mb-4">Applications</h2>
            </div>

            {!applications.length ?
                <div className="w-75 mx-auto">
                    <h4 className="mt-3 mb-5">You haven't applied for any job yet</h4>
                </div>
                :
                <div className="d-flex flex-column align-items-center">
                    {applications.map((application) => (
                        <ApplicationCard key={application._id} application={application} />
                    ))}
                </div>
            }
        </div>
    );
}

export default ApplicationList;