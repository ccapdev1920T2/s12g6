import axreq from './axreq';

const PATH = '/api/report';

const ReportService = {
    /// GET
    getAllReports: () => axreq('get', `${PATH}/all`),

    /// POST
    sendReport: report => axreq('post', `${PATH}/create`, report),

    // PATCH
    dismissReport: reportID => axreq('patch', `${PATH}/dismiss/${reportID}`),
};

export default ReportService;