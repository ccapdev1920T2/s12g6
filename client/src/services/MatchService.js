import axreq from './axreq';

const PATH = '/api/match';

const MatchService = {
    getMatches: () => axreq('get', `${PATH}`),
    unmatchMatch: match => axreq('post', `${PATH}/unmatch`, { match: match._id }),
};

export default MatchService;