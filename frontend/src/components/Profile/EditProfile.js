import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import usePlacesAutocomplete from "use-places-autocomplete";

const EditProfile = ({submitProfile, profile}) => {
    // const [latitude, setLatitude] = useState(null);
    // const [longitude, setLongtitude] = useState(null);

    // navigator.geolocation.getCurrentPosition((position) => {
    //     setLatitude(position.coords.latitude);
    //     setLongtitude(position.coords.longitude);
    // });

    // const [center, setCenter] = useState({lat: latitude, lng: longitude});

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue
    } = usePlacesAutocomplete();
    const [logo, setLogo] = useState(null);
    const searchLocation = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    const onSubmitProfile = (e) => {
        e.preventDefault();
        submitProfile(logo);
    }

    useEffect(() => {
        setValue(profile.profile.location);
    }, []);

    return (
        <div>
            <Form onSubmit={onSubmitProfile} id="edit_profile_form">
                <Form.Group as={Row} className="mb-5">
                    <Form.Label column sm="2" className="font-weight-bold">
                        Company Name
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="edit_profile_company_name" defaultValue={profile.companyName} placeholder="Company name" required/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-5">
                    <Form.Label column sm="2" className="font-weight-bold">
                        Logo
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control 
                            type="file" 
                            id="edit_profile_logo" 
                            accept="image/*" 
                            onChange={(e) => setLogo(e.currentTarget.files[0])}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-5">
                    <Form.Label column sm="2" className="font-weight-bold">
                        Overview
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control 
                            as="textarea" 
                            id="edit_profile_overview" 
                            defaultValue={profile.profile.description ? profile.profile.description : ""} 
                            rows="8" required
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-5">
                    <Form.Label column sm="2" className="font-weight-bold">
                        Location
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control 
                            type="text" 
                            disabled={!ready}
                            id="edit_profile_location" 
                            placeholder="Search for the location"
                            value={value ? value : ""}
                            onChange={searchLocation}
                        />
                        {status === "OK" && 
                            <ListGroup>
                                {data.map((suggestion) => (
                                    <ListGroup.Item
                                        action
                                        variant="light"
                                        key={suggestion.place_id}
                                        value={suggestion}
                                        onClick={(e) => (
                                            e.preventDefault(),
                                            setValue(suggestion.description)
                                        )}
                                    >
                                        {suggestion.description}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        }
                    </Col>
                </Form.Group>
                <div className="d-flex justify-content-center"> 
                    <Button type="submit" variant="outline-primary">Update Profile</Button>
                </div>
            </Form>
        </div>
    )
}

export default EditProfile;