import { Modal, FormControl, Button } from 'react-bootstrap';
import { useState } from 'react';

const ResumeUpload = ({jobId, show, onHide, submitResume}) => {
    const [resume, setResume] = useState(null);

    const onSubmitResume = () => {
        submitResume(resume);
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
                    Upload your resume
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Please choose a pdf file
                </p>
                <FormControl 
                    type="file" 
                    id={"resume_upload_" + jobId} 
                    accept="application/pdf"
                    onChange={(e) => setResume(e.currentTarget.files)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={onSubmitResume}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ResumeUpload;