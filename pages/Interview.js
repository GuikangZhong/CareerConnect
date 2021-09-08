// https://github.com/coding-with-chaim/group-video-final
import Navigation from '../components/Common/Navigation';
import { Button } from 'react-bootstrap';
import React, { useEffect, useState, useRef } from 'react';
import './Interview.css';
import Peer from 'simple-peer';
import io from "socket.io-client";
import { useParams, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Interview() {
    const user = useCookies(['id', 'role'])[0];
    const { roomId, title, peerName } = useParams();

    const [peers, setPeers] = useState([]);
    const [myStream, setMyStream] = useState();
    const [camera, setCamera] = useState(false);
    const [mic, setMic] = useState(false);
    const [turnOnCamera, setTurnOnCamera] = useState(true);
    const [unmuted, setUnMuted] = useState(true);
    const socket = useRef();
    const myVideo = useRef();
    const peersRef = useRef([]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const cam = devices.find(device => device.kind === "videoinput");
            const mic = devices.find(device => device.kind === "audioinput");
            if (cam) setCamera(true);
            if (mic) setMic(true);
            return navigator.mediaDevices.getUserMedia({ video: cam ? true : false, audio: mic ? true : false })
        })
        .then(stream => {
            setMyStream(stream);
            socket.current = io("/");
            myVideo.current.srcObject = stream;
            // join the interview room
            socket.current.emit("join room", roomId);

            // create connections to other users
            socket.current.on("all users", users => {
                const temp = [];
                users.forEach(socketId => {
                    const peer = initiateCaller(socket.current.id, socketId, stream);
                    peersRef.current.push({id: socketId, peer});
                    temp.push({id: socketId, peer});
                });
                setPeers(temp);
            });

            // once you join the room, receive the call the user is sending
            socket.current.on("I am joined", data => {
                // set up the connection
                const peer = initiateCallee(data.callerId, data.signal, stream);
                peersRef.current.push({id: data.callerId, peer});
                setPeers(prevState => [...prevState, {id: data.callerId, peer}]);
            });

            // receive the response of a callee
            socket.current.on("received calls", data => {
                // find the peer that is the callee
                const connection = peersRef.current.find(element => element.id === data.calleeId);
                
                // establish the call with the callee signal
                connection.peer.signal(data.signal);
            });

            socket.current.on('user disconnected', id => {
                handleLeave(id);
            });
        })
        .catch(err => console.log(err));

    }, []);

    const initiateCaller = (callerId, calleeId, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });

        // send the signal to call others
        peer.on("signal", data => {
            socket.current.emit("call others", {callerId, calleeId, signal: data});
        });

        return peer;
    };

    const initiateCallee = (callerId, incomingCall, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });

        // give your signal to the caller
        peer.on("signal", data => {  
            socket.current.emit("accept calls", {callerId, signal: data});
        });

        // answer the call from the caller
        peer.signal(incomingCall);

        return peer;
    };

    const toggleVideo = () => {
        const stream = myStream;
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setMyStream(stream);
        setTurnOnCamera(!turnOnCamera);
        myVideo.current.srcObject = stream;
    };

    const toggleAudio = () => {
        const stream = myStream;
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setMyStream(stream);
        setUnMuted(!unmuted);
        myVideo.current.srcObject = stream;
    };

    const handleLeave = (id) => {
        // destroy the peer object
        const index = peersRef.current.findIndex(obj => obj.id === id);
        const target = peersRef.current.splice(index, 1);
        if (target.length > 0) target[0].peer.destroy();
        // set peers state
        const temp = peersRef.current.map(obj => obj.peer);
        setPeers(temp);
        // setLeave(true);
    };

    return (
        <>
            <Navigation />

            {user.id ? 
            <div className="Container">
                <h1 className="title text-center mt-5">Interview For: {title}</h1>
                <div className='d-flex flex-row mt-5'>
                

                    <div className="candidate col-6">
                        <h3>Me</h3>
                        <video className="mt-4" playsInline muted ref={myVideo} autoPlay />
                        {
                            myStream ? 
                            <div className="d-flex flex-row mt-4 justify-content-center mb-4">
                                {camera ? 
                                    <Button className="mr-5" variant="primary" onClick={toggleVideo}>
                                    {turnOnCamera ? 'Turn Off Cam' : 'Turn On Cam'}
                                    </Button> :
                                    <Button className="mr-5" variant="primary" disabled>
                                        No Cam
                                    </Button> 
                                }
                                {mic ? 
                                    <Button className="ml-5" variant="primary" onClick={toggleAudio}>
                                    {unmuted ? 'Turn Off Mic' : 'Turn On Mic'}
                                    </Button> :
                                    <Button className="mr-5" variant="primary" disabled>
                                        No Mic
                                    </Button> 
                                }
                            </div> :
                            <></>
                        }   
                    </div>

                    
                    {peers.map(peerObj => {
                        return ( <Video className="mt-4 col-6" key={peerObj.id} peerObj={peerObj} peerN={peerName} />);
                    })}

                </div>
            </div> : 
            <Redirect to="/"/>
            }
        </>
    );
}

function Video({peerObj, peerN}) {
    console.log(peerObj);
    console.log("peerName is " + peerN)
    const [peername, setPeerName] = useState(peerN);
    const ref = useRef();
    // receive the callee streams
    useEffect(() => {
        peerObj.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    }, []);
    return (
        <div className="interviewer col-6 mb-5">
            <h3>{peername}: </h3>
            <video playsInline ref={ref} autoPlay className="mt-4"/>
        </div>
    )
}

export default Interview;