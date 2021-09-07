import '../card.css';
import '../../Common/style.css';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const JobPostingCard = ({job}) => {
    job.dueDate = new Date(job.dueDate);
    
    return (
        <Card as={Link} to={"/job/" + job._id} className="job_card w-75 mb-3">
            <Card.Body className="pb-1">
                <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>{job.title}</Card.Title>
                </div>
                <div className="d-flex justify-content-between">
                    <Card.Text className="job_card_location mb-1">{job.creator.profile.location}</Card.Text>
                    <Card.Text className="job_card_date mb-1">{job.dueDate.toLocaleDateString()}</Card.Text>
                </div>
                <div className="mb-2">
                    {job.labels.map((label) => (
                        <span key={label} className="badge badge-info mr-3">{label}</span>
                    ))}
                </div>
                <hr className="dashed_separator mt-1 mb-2"/>
                <div className="d-flex align-items-center mt-2 mb-2">
                    <Card.Text className="job_card_num_applicants">{job.applications.length} people have applied for this position</Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}

export default JobPostingCard;