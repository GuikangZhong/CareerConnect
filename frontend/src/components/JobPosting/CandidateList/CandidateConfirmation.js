import { Modal, Button } from 'react-bootstrap';

const CandidateConfirmation = ({applicationId, candidateName, show, onHide, confirmationOption, handleActionConfirm}) => {
    const onConfirm = () => {
        handleActionConfirm(applicationId, confirmationOption);
        onHide();
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
                    Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {confirmationOption === 4 && 
                    <p>Are you sure not to move Candidate {candidateName} forward?</p>
                }
                {confirmationOption === 6 && 
                    <p>Are you sure to give Candidate {candidateName} an offer?</p>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    No
                </Button>
                <Button variant="success" onClick={onConfirm}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CandidateConfirmation;