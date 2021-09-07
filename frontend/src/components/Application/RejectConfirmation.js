import { Modal, Button } from 'react-bootstrap';

const RejectConfirmation = ({show, onHide, rejectAction, content}) => {
    const onConfirm = () => {
        rejectAction();
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
                <p>Are you sure to reject this {content}</p>
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

export default RejectConfirmation;