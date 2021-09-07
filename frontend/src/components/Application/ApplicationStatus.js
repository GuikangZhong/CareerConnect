import { VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './ApplicationStatus.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import statusTable from '../../context/statusTable'
import { useState } from 'react';
import RejectConfirmation from './RejectConfirmation';

const ApplicationStatus = ({historyNode, curStatus, acceptInterview, rejectInterview, rejectOffer, acceptOffer}) => {
    const [confirmationShow, setConfirmationShow] = useState(false);

    historyNode.modifiedDate = new Date(historyNode.modifiedDate);
    if (historyNode.status === 1 || historyNode.status === 2 || historyNode.status === 3) {
        historyNode.interviewTime = new Date(historyNode.interviewTime);
    }

    return (
        <>
            {(historyNode.status === 0 || historyNode.status === 1 || historyNode.status === 2 || historyNode.status === 6) && 
                <VerticalTimelineElement
                    date={"Date Updated: " + historyNode.modifiedDate.toLocaleDateString()}
                    dateClassName=""
                    contentArrowStyle={{ borderRight: '7px solid rgb(241, 241, 241)' }}
                    contentStyle={{ background: 'rgb(241, 241, 241)'}}
                    position="right"
                    iconStyle={{ background: 'rgb(121, 193, 252)', color: '#fff'}}
                    icon={<FontAwesomeIcon icon={faCheck}/>}
                >
                    <h3 className="vertical-timeline-element-title">{statusTable(historyNode.status)}</h3>
                    {(historyNode.status !== 1) ? 
                        <></>
                        :
                        <p>Interview Time: {historyNode.interviewTime.toLocaleTimeString()}, {historyNode.interviewTime.toLocaleDateString()}</p>
                    }
                    {(historyNode.status !== 2) ? 
                        <></>
                        :
                        <p>Check your schedule page for online interview link</p>
                        // <div><a href={`/interview/${historyNode.interviewURL}`}>Interview Link</a></div>
                    }
                    {(historyNode.status === curStatus && (curStatus === 1 || curStatus === 6)) ?
                        <>
                            {(historyNode.status === 1 && historyNode.interviewTime > new Date()) || historyNode.status === 6 ? 
                                <div className="d-flex mt-3">
                                    <Button 
                                        variant="outline-success" 
                                        className="mr-3" 
                                        onClick={(historyNode.status === 1 ? acceptInterview : acceptOffer)}
                                    >
                                        Accept
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => setConfirmationShow(true)}>Reject</Button>
                                </div>
                                :
                                <p className="text-danger">Interview time expired</p>
                            }
                            <RejectConfirmation
                                show={confirmationShow}
                                onHide={() => setConfirmationShow(false)}
                                rejectAction={historyNode.status === 1 ? rejectInterview : rejectOffer}
                                content={historyNode.status === 1 ? "interview" : "offer"}
                            />
                        </>
                        :
                        <></>
                    }
                </VerticalTimelineElement>
            }
            {(historyNode.status === 3 || historyNode.status === 4 || historyNode.status === 7) && 
                <VerticalTimelineElement
                    date={"Date Updated: " + historyNode.modifiedDate.toLocaleDateString()}
                    dateClassName=""
                    contentArrowStyle={{ borderRight: '7px solid rgb(241, 241, 241)' }}
                    contentStyle={{ background: 'rgb(241, 241, 241)'}}
                    position="right"
                    iconStyle={{ background: 'red', color: '#fff'}}
                    icon={<FontAwesomeIcon icon={faTimes}/>}
                >
                    <h3 className="vertical-timeline-element-title">{statusTable(historyNode.status)}</h3>
                </VerticalTimelineElement>
            }
            {historyNode.status === 5 && 
                <VerticalTimelineElement
                    date={"Date Updated: " + historyNode.modifiedDate.toLocaleDateString()}
                    dateClassName=""
                    contentArrowStyle={{ borderRight: '7px solid rgb(241, 241, 241)' }}
                    contentStyle={{ background: 'rgb(241, 241, 241)'}}
                    position="right"
                    iconStyle={{ background: '#28a745', color: '#fff'}}
                    icon={<FontAwesomeIcon icon={faCheck}/>}
                >
                    <h3 className="vertical-timeline-element-title">{statusTable(historyNode.status)}</h3>
                </VerticalTimelineElement>
            }
        </>
    );
}

export default ApplicationStatus;