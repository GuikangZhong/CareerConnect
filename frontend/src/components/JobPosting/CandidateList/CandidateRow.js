import './CandidateRow.css';
import CandidateConfirmation from './CandidateConfirmation';
import CandidateInterviewTime from './CandidateInterviewTime';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faUserTimes, faUserTie, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import root from '../../../env';
import statusTable from '../../../context/statusTable';

const CandidateRow = ({candidate, index, interviewName, actionFeedback}) => {
    const [confirmationShow, setConfirmationShow] = useState(false);
    const [interviewTimeShow, setInterviewTimeShow] = useState(false);
    const [clickedOption, setClickedOption] = useState(0);
    const [status, setStatus] = useState(candidate.history[0].status);
    const [url, setUrl] = useState('');
    const [interviewLink, setInterviewLink] = useState(candidate.history[0].interviewURL);
    const confirmAction = (appId, code, title, start, end) => {
        const requestBody = {
            query:
            `
                mutation ChangeStatus($id: ID!, $code: Int!, $title: String, $start: Date, $end: Date) {
                    changeStatus(id: $id, code: $code, title: $title, start: $start, end: $end){
                        history {
                            interviewURL
                        }
                    }
                }
            `,
            variables: {
                id: appId,
                code: code,
                title: title,
                start: start,
                end: end
            }
        };

        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            return res.json();
        })
        .then(body => {
            if (body.errors) {
                throw new Error(body.errors[0].message);
            } else {    
                setInterviewLink(body.data.changeStatus.history[0].interviewURL);    
                setStatus(code);
                if (code === 1) {
                    actionFeedback("Interview invitation sent", "success");
                } else if (code === 4) {
                    actionFeedback(`Reject ${candidate.applicant.username}`, "success");
                } else if (code === 6) {
                    actionFeedback("Offer sent", "success");
                }
            }
        })
        .catch(err => {
            console.log(err);
            actionFeedback(err.message, "error");
        });
    }

    useEffect(() => {
        fetch(`${root}/api/uploads/resume/${candidate._id}`, {
            method: 'GET',
            body: null,
            credentials: 'include'
        })
        .then(async res => {
            const result = await res.json();
            setUrl(result.url);
        })
        .catch(err => {
            console.log(err);
            actionFeedback(err.message, "error");
        })
    },[]);

    return (
        <tr>
            <td className="align-middle">{index}</td>
            <td className="align-middle">{candidate.applicant.username}</td>
            <td className="align-middle">{candidate.applicant.email}</td>
            <td className="align-middle">
                <a href={url} target="_blank">
                    <Button variant="outline-primary">
                    <FontAwesomeIcon icon={faFilePdf} className="mr-2" />Preview
                    </Button>
                </a>
            </td>

            <td className="align-middle">
                <span className={
                    (status === 3 || status === 4 || status === 7) ? "badge badge-pill status_tag badge-danger" : 
                    (status === 5) ? "badge badge-pill status_tag badge-success" : 
                    "badge badge-pill status_tag badge-info"
                }>
                    {statusTable(status)}
                </span>
            </td>


            <td className="align-middle">
                <Button 
                    variant="outline-danger" 
                    className="mr-3" 
                    onClick={() => {setConfirmationShow(true); setClickedOption(4);}}
                    disabled={(status === 3 || status === 4 || status === 6 || status === 5 || status === 7) ? true : false}>
                    <FontAwesomeIcon icon={faUserTimes} className="mr-2" />Reject
                </Button>
                <Button 
                    variant="outline-primary" 
                    className="mr-3" 
                    onClick={() => status === 2 ? window.location.href = `/interview/${interviewLink}/${interviewName}/${candidate.applicant.username}` : setInterviewTimeShow(true)}
                    disabled={(status !== 0 && status !== 2) ? true : false}>
                    <FontAwesomeIcon icon={faUserTie} className="mr-2" />{status === 2 ? "Interview Link" : "Set Interview"}
                </Button>
                <Button 
                    variant="outline-success" 
                    onClick={() => {setConfirmationShow(true); setClickedOption(6);}}
                    disabled={(status === 3 || status === 4 || status === 5 || status === 6 || status === 7) ? true : false}>
                    <FontAwesomeIcon icon={faUserCheck} className="mr-2" />Offer
                </Button>
            </td>

            <CandidateConfirmation
                applicationId={candidate._id}
                candidateName={candidate.applicant.username}
                show={confirmationShow}
                onHide={() => setConfirmationShow(false)}
                confirmationOption={clickedOption}
                handleActionConfirm={confirmAction}
            />
 
            <CandidateInterviewTime 
                applicationId={candidate._id}
                show={interviewTimeShow}
                onHide={() => setInterviewTimeShow(false)}
                candidateId={candidate.applicant._id}
                interviewName={interviewName}
                handleActionConfirm={confirmAction}
            />
        </tr>
    )
}

export default CandidateRow;