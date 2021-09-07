import './ProfileBody.css';
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import React, { useState, useEffect } from 'react';
import { getGeocode, getLatLng } from "use-places-autocomplete";

const ProfileBody = ({overview, location}) => {
    const [center, setCenter] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [openInfoWindow, setOpenInfoWindow] = useState(false);
    const [sOverview, setOverview] = useState(overview);
    const [sLocation, setLocation] = useState(location);
    const mapRef = React.useRef();
    const options = {
        disableDefaultUI: true,
        zoomControl: true,
    };

    useEffect(() => {
        if (location) {
            setLocation(location);
            getGeocode({address: location})
            .then((results) => getLatLng(results[0]))
            .then(({lat, lng}) => {
                setCenter({lat, lng});
                setIsLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }, [location]);

    useEffect(() => {
        setOverview(overview);
    }, [overview]);

    const loadMap = React.useCallback((map) => {
      mapRef.current = map;
    }, []);

    return (
        <>
        {!sOverview && !sLocation ?
            <div className="mt-4 mr-5 ml-5">
                <h4>Sorry, the company hasn't created profile yet</h4>
            </div>
            :
            <>
                {isLoaded ? 
                    <div className="mt-4 mr-5 ml-5">
                        <div className="mb-5">
                            <h5 className="profile_body_heading mb-3">Overview:</h5>
                            <p className="profile_body_text">{overview}</p>
                        </div>
                        <div className="mb-5">
                            <div className="d-flex align-items-end">
                                <h5 className="profile_body_heading mb-3">Location:</h5>
                                <p className="profile_body_text ml-3">{location}</p>
                            </div>
                            <GoogleMap
                                id="map"
                                mapContainerStyle={{  
                                    height: "70vh",
                                    width: "70vw",
                                    left: "50%",
                                    transform: "translateX(-50%)"
                                }}
                                zoom={12}
                                center={center}
                                options={options}
                                onLoad={loadMap}
                            >
                                <Marker
                                    position={center}
                                    onClick={() => setOpenInfoWindow(true)}
                                >
                                    {openInfoWindow ?
                                        <InfoWindow 
                                            onCloseClick={() => setOpenInfoWindow(false)}
                                        >
                                            <div>
                                                {location}
                                            </div>
                                        </InfoWindow>
                                        :
                                        <></>
                                    }
                                </Marker>
                            </GoogleMap>
                        </div>
                    </div>
                    :
                    <></>
                }
            </>
        }
        </>
    );
}

export default ProfileBody;