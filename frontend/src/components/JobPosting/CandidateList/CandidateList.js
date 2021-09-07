import CandidateRow from './CandidateRow';
import { Table, Button } from 'react-bootstrap';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import root from '../../../env'

const CandidateList = ({candidates, interviewName, actionFeedback, jobId}) => {
    return (
        <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h5>Candidate List:</h5>
                {candidates.length ?
                    <a href={`${root}/api/downloads/resumes/${jobId}/`} target="_blank" download>
                        <Button variant="outline-primary">
                            <FontAwesomeIcon icon={faDownload} className="mr-3"/>
                            Download All Candidates' Resumes
                        </Button>
                    </a>
                    :
                    <></>
                }
            </div>
            <Table bordered hover className="text-center">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate, index) => (
                        <CandidateRow
                            key={candidate._id} 
                            candidate={candidate} 
                            index={index + 1} 
                            interviewName={interviewName}
                            actionFeedback={actionFeedback}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default CandidateList;