import logo from '../../media/company.png';
import './ApplicationHeader.css';
import statusTable from '../../context/statusTable'

const ApplicationHeader = ({title, location, dateApplied, status, company}) => {
    dateApplied = new Date(dateApplied);
    return (
        <div className="mt-5 mr-5 ml-5 pb-3 border-bottom">
            <a href={`/profile/${company._id}`}>
                {company.profile.logo.location ?
                    <img src={`https://storage.googleapis.com/bubblecareerconnect/${company.profile.logo.location}`} className="job_posting_logo mb-3"/>
                    :
                    <img src={logo} className="job_posting_logo mb-3"/>
                }
            </a>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="application_title mb-4">{title}</h2>
                
                <span className={
                    (status === 3 || status === 4 || status === 7) ? "badge badge-pill status_tag badge-danger" : 
                    status === 5 ? "badge badge-pill status_tag badge-success" : 
                    "badge badge-pill status_tag badge-info"
                }>
                    {statusTable(status)}
                </span>
            </div>
            <h5 className="application_date mb-3">Date Applied: {dateApplied.toLocaleDateString()}</h5>
            <div className="mb-2">
                <a href="/signin" className="application_company"><span className="pr-3 border-right border-dark">{company.companyName}</span></a>
                <span className="application_location pl-3">{company.profile.location}</span>
            </div>
        </div>
    );
}

export default ApplicationHeader;