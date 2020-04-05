import axreq from './axreq';

const PATH = '/api/chat';

const ChatService = {
    /////// GET
    initChat: () => axreq('get', PATH), // chatID, user
    getAllChats: () => axreq('get', `${PATH}/all`),

    /////// POST
    createChat: ({ match, txt }) => axreq('post', `${PATH}/create`, { match, txt }), // TODO: update validation
    postMessage: (chatID, txt) => axreq('post', `${PATH}/message/${chatID}`, { txt }),
    postImage: (chatID, formData) => axreq('post', `${PATH}/image/${chatID}`, formData), 

    /////// PATCH
    updateReadChat: ({ chatID }) => axreq('patch', `${PATH}/read/${chatID}`),

    /////// DELETE
    deleteChatAndUnmatch: (chatID) => axreq('delete', `${PATH}/delete/${chatID}`)
}

export default ChatService;