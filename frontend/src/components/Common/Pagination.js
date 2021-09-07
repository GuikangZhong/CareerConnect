import { Button } from 'react-bootstrap';
import './Pagination.css';

const Pagination = ({curPage, totalPage, prePage, nextPage}) => {
    return (
        <div className="w-75 mx-auto d-flex justify-content-center mt-3 mb-4 align-items-center">
            <Button variant="outline-secondary" onClick={prePage} style={{visibility: (curPage === 1) ? "hidden" : "visible"}} className="page_btn">Previous</Button>
            <span className="mr-3 ml-3">Page {curPage}</span>
            <Button variant="outline-secondary" onClick={nextPage} style={{visibility: (curPage === totalPage) ? "hidden" : "visible"}} className="page_btn">Next</Button>
        </div>
    );
}

export default Pagination;