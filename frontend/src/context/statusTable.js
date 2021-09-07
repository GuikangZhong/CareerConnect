const statusTable = (code) => {
    if (code === 0) return "Pending";
    else if (code === 1) return "Interview";
    else if (code === 2) return "Interview Accepted";
    else if (code === 3) return "Interview Rejected";
    else if (code === 4) return "Rejected";
    else if (code === 5) return "Offer Accepted";
    else if (code === 6) return "Offer Pending"
    else if (code === 7) return "Offer Rejected"
    else return "Pending";
};

export default statusTable;