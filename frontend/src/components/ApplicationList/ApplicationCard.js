import './ApplicationCard.css';
import '../Common/style.css';
import logo from '../../media/company.png';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import statusTable from '../../context/statusTable'

const ApplicationCard = ({application}) => {
    application.createdAt = new Date(application.createdAt);
    return (
        <Card as={Link} to={`/application/${application._id}`} className="application_card w-75 mb-3">
            <Card.Body className="pb-1">
                <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>{application.job.title}</Card.Title>
                    <Card.Title className="application_card_status">
                        <span className={
                            (application.history[0].status === 3 || application.history[0].status === 4 || application.history[0].status === 7) ? "badge badge-pill status_tag badge-danger" : 
                            application.history[0].status === 5 ? "badge badge-pill status_tag badge-success" : 
                            "badge badge-pill status_tag badge-info"
                        }>
                            {statusTable(application.history[0].status)}
                        </span>
                    </Card.Title>
                </div>
                <div className="d-flex justify-content-between">
                    <Card.Text className="application_card_location">{application.job.creator.profile.location}</Card.Text>
                    <Card.Text className="application_card_date">Applied on {application.createdAt.toLocaleDateString()}</Card.Text>
                </div>
                <hr className="dashed_separator mt-1 mb-2"/>
                <div className="d-flex align-items-center">
                    {application.job.creator.profile.logo.location ?
                        <img src={`https://storage.googleapis.com/bubblecareerconnect/${application.job.creator.profile.logo.location}`} className="application_card_company_logo mr-3"/>
                        :
                        <img src={logo} className="application_card_company_logo mr-3"/>
                    }
                    <Card.Text className="application_card_company_name">{application.job.creator.companyName}</Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}

export default ApplicationCard;