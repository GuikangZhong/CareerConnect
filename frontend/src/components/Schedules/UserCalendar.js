import { Modal, Button } from 'react-bootstrap';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './UserCalendar.css'
const UserCalendar = ({show, handleClose, selectedInterview, interviewAction, interviews, handleShow}) => {
    const acceptInterview = () => {
        interviewAction(1);
    }

    const rejectInterview = () => {
        interviewAction(2);
    }

    return (
        <>
        {selectedInterview ? (            
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                animation={false}
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title>Interview</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        {selectedInterview.status === 1 ?
                            <>
                                {selectedInterview.start >= new Date() ? 
                                    <p className="text-info">This interview is waiting for you to confirm</p>
                                    :
                                    <p className="text-danger">Interivew time expired</p>
                                }
                            </>
                            :
                            <p className="text-success"><FontAwesomeIcon icon={faCheck} className="mr-2"/>You have accepted this interview</p>
                        }
                        <p><strong>Interview Title:</strong> {selectedInterview.title}</p> 
                        <p><strong>Start time:</strong> { selectedInterview.start.toLocaleString()}</p>
                        <p><strong>End time:</strong> { selectedInterview.end.toLocaleString()}</p>
                        {selectedInterview.status === 1 && selectedInterview.start >= new Date() ? 
                            <>
                                <p>Press "Reject Interview" to reject this interview </p>
                                <p>Press "Accept Interview" to accept this interview </p> 
                            </>
                            : selectedInterview.status === 2 ? 
                            <div>
                                <a href={`/interview/${selectedInterview.link}/${selectedInterview.title}/${selectedInterview.companyName}`}>Interview Link</a>
                            </div>
                            : <></> 
                        }
                    </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {selectedInterview.status === 1 && selectedInterview.start >= new Date() ? 
                    <>
                        <Button variant="success" onClick={acceptInterview}>Accept Interview</Button> 
                        <Button variant="danger" onClick={rejectInterview}>Reject Interview</Button>
                    </>
                    : 
                    <></>
                }
                </Modal.Footer>
            </Modal>) :(<></>)}
            <FullCalendar
                initialView="dayGridMonth"
                headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
                }}
                plugins={[dayGridPlugin, timeGridPlugin]}
                events={interviews}
                eventClick={(event) => handleShow(event)}
            />
            
    </>
    )
}

export default UserCalendar
