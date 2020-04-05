import axreq from './axreq';

const PATH = '/api/admin';

const AdminService = {
    ////// GET
    noAdmin: () => axreq('get', `${PATH}/noauth`),
    isAdmin: () => axreq('get', `${PATH}/auth`),
    getAdmin: () => axreq('get', `${PATH}/get`),

    /////// POST
    login: (user, pass) => axreq('post', `${PATH}/login`, { user, pass }),
    logout: () => axreq('post', `${PATH}/logout`),
};

export default AdminService;