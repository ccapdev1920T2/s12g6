import axreq from './axreq';

const PATH = '/api/user';

const UserService = {
    //////// GET
    isAuth: () => axreq('get', `${PATH}/auth`),
    isNotAuth: () => axreq('get', `${PATH}/notauth`),
    getVerifySecret: secret => axreq('get', `${PATH}/verify?key=${secret}`),
    getAllUsers: () => axreq('get', `${PATH}/all`),
    getUserById: id => axreq('get', `${PATH}/${id}`),

    //////// POST
    postSendEmail: user => axreq('post', `${PATH}/send-email`, user),
    postRegister: userInfo => axreq('post', `${PATH}/create`, userInfo),
    postDP: (image, userID) => axreq('post', `${PATH}/dp/${userID}`, image),
    postImage: (image, userID) => axreq('post', `${PATH}/image/${userID}`, image),
    login: (email, pass, rememberMe) => axreq('post', `${PATH}/login`, { email, pass, rememberMe }),
    logout: () => axreq('post', `${PATH}/logout`),

    //////// PATCH
    editProfileInfo: (update, userID) => axreq('patch', `${PATH}/info/${userID}`, update),
    editProfileInterest: ({ update, userID }) => axreq('patch', `${PATH}/interest/${userID}`, update),
    editDP: (dp, userID) => axreq('patch', `${PATH}/dp/${userID}`, { dp }),
    editRemoveImages: (images, userID) => axreq('patch', `${PATH}/remove-img/${userID}`, { images }),
    warnUser: reported => axreq('patch', `${PATH}/warn/${reported}`),

    //////// DELETE
    deleteAccount: userID => axreq('delete', `${PATH}/delete/${userID}`),
    deleteUserByAdmin: reported => axreq('delete', `${PATH}/reported/${reported}`),
}

export default UserService;