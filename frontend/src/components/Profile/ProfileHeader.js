import './ProfileHeader.css';
import logo from '../../media/company.png';
const ProfileHeader = ({companyName, location, companyId, companyLogo}) => {
    return (
        <div className="w-75">
            {companyLogo ?
                <img src={`https://storage.googleapis.com/bubblecareerconnect/${companyLogo}`} className="profile_logo mb-3" alt={companyName}/>
                :
                <img src={logo} className="profile_logo mb-3" alt={companyName}/>
            }
            <h2 className="profile_company_name mb-4">{companyName}</h2>
            <div className="mb-3">
                <span className="profile_location">{location}</span>
            </div>
        </div>
    );
}

export default ProfileHeader;