import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const CandidateInterviewTime = ({show, onHide, applicationId, interviewName, handleActionConfirm}) => {
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [error, setError] = useState("");

    const onConfirm = () => {
        if (start >= end) {
            setError("You have to set the interview start time later than the end time");
        } else {
            handleActionConfirm(applicationId, 1, interviewName, start, end);
            onHide();
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            animation={false}
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Choose the interview time
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Please choose the interview time:
                </p>

                {error ?
                    <p className="text-danger">{error}</p>
                    :
                    <></>
                }

                <div> 
                    <div className="d-flex align-items-center mb-3">  
                        <p className="mb-0 col-2">Start Time:</p>
                        <DateTimePicker
                            onChange={(value) => setStart(value)}
                            value={start}
                            clearIcon="Reset"
                            dayPlaceholder="dd"
                            hourPlaceholder="hh"
                            minutePlaceholder="mm"
                            monthPlaceholder="mm"
                            yearPlaceholder="yyyy"
                            locale="en-US"
                            minDate={new Date()}
                            calendarIcon={<FontAwesomeIcon icon={faCalendarAlt} />}
                        />
                    </div>
                    <div className="d-flex align-items-center">
                    <p className="mb-0 col-2">End Time:</p>
                        <DateTimePicker
                            onChange={(value) => setEnd(value)}
                            value={end}
                            clearIcon="Reset"
                            dayPlaceholder="dd"
                            hourPlaceholder="hh"
                            minutePlaceholder="mm"
                            monthPlaceholder="mm"
                            yearPlaceholder="yyyy"
                            locale="en-US"
                            minDate={start}
                            calendarIcon={<FontAwesomeIcon icon={faCalendarAlt} />}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Send Interview Invitation
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CandidateInterviewTime;