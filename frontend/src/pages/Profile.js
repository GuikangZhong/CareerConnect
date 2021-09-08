import Navigation from '../components/Common/Navigation';
import './Profile.css';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileBody from '../components/Profile/ProfileBody';
import EditProfile from '../components/Profile/EditProfile';
import Message from '../components/Common/Message';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap';
import { getGeocode } from "use-places-autocomplete";
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { companyId } = useParams();
    const user = useCookies(['id', 'role'])[0];
    const [profile, setProfile] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const getProfile = () => {
        const requestBody = {
            query: 
            `
                query GetCompany($id: ID!) {
                    getCompany(id: $id) {
                        _id
                        companyName
                        profile {
                            logo {
                                location
                            }
                            description
                            location
                        }
                    }
                }
            `,
            variables: {
                id: companyId
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
            return res.json();
        })
        .then(body => {
            if (body.errors) {
                throw new Error(body.errors[0].message);
            } else {
                setProfile(body.data.getCompany);
                setIsLoaded(true);
            }
        })
        .catch(err => {
            console.log(err);
            setOpenMessage(true);
            setMessage(err.message);
            setMessageType("error")
        });
    }
    
    const submitProfile = (logo) => {
        const companyName = document.querySelector("#edit_profile_company_name").value;
        const overview = document.querySelector("#edit_profile_overview").value;
        const location = document.querySelector("#edit_profile_location").value;
        
        getGeocode({address: location})
        .then((result) => {
            document.querySelector("#edit_profile_form").reset();
            setEditMode(false);
        })
        .catch(err => {
            setMessage("Your location is invalid");
            setOpenMessage(true);
            setMessageType("error");
            console.log(err);
        });

        const requestBody = {
            query: 
                `mutation UpdateProfile($logo: Upload, $name: String!, $description: String!, $location: String!) {
                    updateProfile(logo: $logo, name: $name, description: $description, location: $location) {
                        _id
                    }
                }`
            ,
            variables: {
                "logo": null,
                "name": companyName,
                "description": overview,
                "location": location
            }
        };
        const formData = new FormData();
        if (logo) {
            formData.append('operations', JSON.stringify(requestBody));
            const map = `{"0": ["variables.logo"]}`;
            formData.append("map", map);
            formData.append("0", logo);
        }
        fetch('/graphql', {
            method: 'POST',
            body: logo ? formData : JSON.stringify(requestBody),
            headers: logo ? undefined : {'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        })
        .then(body => {
            if (body.errors) {
                throw new Error(body.errors[0].message);
            } else {
                setOpenMessage(true);
                setMessage("Profile updated");
                setMessageType("success");
                getProfile();
            }
        })
        .catch(err => {
            console.log(err);
            setOpenMessage(true);
            setMessage(err.message);
            setMessageType("error")
        });
    }

    const closeMessage = () => {
        setOpenMessage(false);
        setMessageType("");
        setMessage("");
    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <Navigation />

            {isLoaded ? 
                <>
                    {editMode ? 
                        <div className="d-flex flex-column mt-5 ml-5 mr-5 mb-5">
                            <EditProfile 
                                submitProfile={submitProfile}
                                profile={profile}
                            />
                        </div>
                        :
                        <>
                            <div className="mt-5 mr-5 ml-5 pb-3 border-bottom d-flex">
                                <ProfileHeader
                                    companyName={profile.companyName}
                                    overview={profile.profile.description} 
                                    location={profile.profile.location}
                                    companyId={companyId}
                                    companyLogo={profile.profile.logo.location}
                                />

                                <div className="d-flex w-25 justify-content-end align-items-start mt-3">
                                    {(user.role === "2" && user.id === profile._id) && 
                                        <Button 
                                            onClick={() => setEditMode(true)} 
                                            variant="outline-primary" 
                                            className="edit_btn pl-4 pr-4"
                                        >
                                            Edit
                                        </Button>
                                    }
                                </div>
                            </div>

                            <ProfileBody 
                                overview={profile.profile.description} 
                                location={profile.profile.location}
                            />
                        </>
                    }
                </>
                :
                <></>
            }

            <Message 
                open={openMessage} 
                message={message} 
                handleClose={closeMessage}
                type={messageType}
            />
        </>
    )
}

export default Profile;