import { Form, Button, Row, Col } from 'react-bootstrap';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";

const CreateJobForm = ({createJob, setLabels, allLabels}) => {
    return (
        <Form onSubmit={createJob} id="create_job_form">
            <Form.Group as={Row} className="mb-5">
                <Form.Label column sm="2" className="font-weight-bold">
                    Job Title
                </Form.Label>
                <Col sm="10">
                    <Form.Control type="text" id="create_job_title" placeholder="Job title" required/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="create_job_labels" className="mb-5">
                <Form.Label column sm="2" className="font-weight-bold">
                    Labels
                </Form.Label>
                {allLabels.length > 0 ? 
                    <DropdownMultiselect
                    column
                    sm="7"
                    options={allLabels}
                    name="job_labels"
                    placeholder="Job Labels"
                    buttonClass="ml-3 bg-light border"
                    handleOnChange={(selected) => {setLabels(selected)}}
                /> : <></>    
                }
            </Form.Group>
            <Form.Group as={Row} className="mb-5">
                <Form.Label column sm="2" className="font-weight-bold">
                    Job Description
                </Form.Label>
                <Col sm="10">
                    <Form.Control as="textarea" id="create_job_description" rows="8" required/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-5">
                <Form.Label column sm="2" className="font-weight-bold">
                    Requirements
                </Form.Label>
                <Col sm="10">
                    <Form.Control as="textarea" id="create_job_requirements" rows="8" required/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-5">
                <Form.Label column sm="2" className="font-weight-bold">
                    Deadline to apply
                </Form.Label>
                <Col sm="3">
                    <Form.Control 
                        type="date" 
                        // Get line 47 code from: https://stackoverflow.com/questions/32378590/set-date-input-fields-max-date-to-today
                        min={new Date().toISOString().split("T")[0]}
                        id="create_job_deadline"
                        required
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-5">
                <Form.Label column sm="2" className="font-weight-bold">
                    Salary
                </Form.Label>
                <Col sm="3">
                    <Form.Control type="text" id="create_job_salary" placeholder="Job salary" required/>
                </Col>
            </Form.Group>
            <div className="d-flex justify-content-center"> 
                <Button type="submit" variant="outline-primary">Publish the Job Posting</Button>
            </div>
        </Form>
    );
}

export default CreateJobForm;