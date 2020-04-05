const getters = {
  getAllChats: state => state.chats || [],

  getCurrentUser: state => state.user || { userInfo: {} },

  getCurrentChat: state => state.currentChat || {},

  getAllMatches: state => state.matches || [],

  getMatchProfile: state => {
    if (checkObj(state.currentMatch)) { // Empty object
      return state.currentMatch
    } else if (checkObj(state.matches[0])){
      state.currentMatch = state.matches[0]
      return state.currentMatch
    } else {
      return undefined
    }
  },

  getReportedUser: state => state.reportedUser || {},

  isLoading: state => state.loading,

  isBG: state => state.bg,

  getDialog: state => state.dialog,
}

const checkObj = (obj) => {
  for (let key in obj)
    return true
  return false
}

export default getters