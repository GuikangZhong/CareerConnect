import { VerticalTimeline }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import ApplicationStatus from './ApplicationStatus';

const ApplicationBody = ({process, curStatus, statusAction}) => {
    const acceptInterview = () => {
        statusAction(2);
    }

    const rejectInterview = () => {
        statusAction(3);
    }
    
    const acceptOffer = () => {
        statusAction(5);
    }

    const rejectOffer = () => {
        statusAction(7);
    }
    
    return (
        <div className="mt-4 mb-4">
            <VerticalTimeline animate={false} layout="1-column-left">
                {process.map((historyNode, index) => (
                    <ApplicationStatus
                        key={index} 
                        historyNode={historyNode} 
                        curStatus={curStatus}
                        acceptInterview={acceptInterview}
                        rejectInterview={rejectInterview}
                        acceptOffer={acceptOffer}
                        rejectOffer={rejectOffer}
                    />
                ))}
            </VerticalTimeline>
        </div>
    );
}

export default ApplicationBody;