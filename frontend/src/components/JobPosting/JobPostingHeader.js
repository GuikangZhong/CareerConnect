import './JobPostingHeader.css';
import logo from '../../media/company.png';
const JobPostingHeader = ({title, dateCreated, salary, labels, company}) => {
    return (
        <div className="w-75">
            <a href={"/profile/" + company._id}>
                {company.profile.logo.location ?
                    <img src={`https://storage.googleapis.com/bubblecareerconnect/${company.profile.logo.location}`} className="job_posting_logo mb-3"/>
                    :
                    <img src={logo} className="job_posting_logo mb-3"/>
                }
            </a>
            <h2 className="job_posting_title mb-4">{title}</h2>
            <h5 className="job_posting_date mb-3">{dateCreated.toLocaleDateString()}</h5>
            <div className="mb-3">
                <a href={"/profile/" + company._id} className="job_posting_company"><span className="pr-3 border-right border-dark">{company.companyName}</span></a>
                <span className="job_posting_salary pr-3 pl-3 border-right border-dark">{salary}</span>
                <span className="job_posting_location pl-3">{company.profile.location}</span>
            </div>
            <div className="job_posting_labels">
                {labels.map((label) => (
                    <span key={label} className="badge badge-info mr-3">{label}</span>
                ))}
            </div>
        </div>
    );
}

export default JobPostingHeader;