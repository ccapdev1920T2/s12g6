const moment = require('moment')

const userMutations = {
  addNewImage(state, newImage) {
    state.user.images.push(newImage)
  },

  setUser(state, user) {
    state.user = user
  },

  editProfile(state, update) {
      let keys = Object.keys(update)
      
      for (let i = 0; i < keys.length; i++) {
          state.user.userInfo[keys[i]] = update[keys[i]]
      }
  },

  editDP(state, dp) {
    state.user.dp = dp
  },

  editRemoveImages(state, removed) {
    const { images } = state.user
    state.user.images = images.filter(img => !removed.includes(img))
  },
  
  unmatchMatch(state, matchID) {
      let index = state.matches.findIndex(match => match._id === matchID)
  
      if (index !== -1) {
        // remove the match from the list and change the current match to the next
        state.matches.splice(index, 1)
        state.currentMatch = state.matches[index]
      }
  },

  reportUser(state, reportedUser) {
    state.reportedUser = reportedUser
  },

  // destroy all values
  destroyStates(state) {
      state.user = null
      state.chats = []
      state.currentChat = {}
      state.messages = []
      state.prevChatID= ''
      state.matches = []
      state.currentMatch = {}
  },

  setMatchByUser(state, match) {
    state.currentMatch = match
    state.prevChatID = state.currentChat._id
    state.currentChat = -1
  }
}

const chatMutations = {
  switchChat(state, id) { 
    let chat = state.chats.find(c => c._id === id)
    if (chat)
      state.currentChat = chat
    else
      state.currentChat = {}
  },

  setChats(state, { chats, user }) { // user id
    state.chats = []
    chats.map(chat => {
      // check for matched partner
      // the the first 24 characters of the id if it matched with the users id
      if (chat._id.substring(0, 24) === user._id) {
        chat.self = 'u1'
        chat.match = 'u2'
      } else {
        chat.self = 'u2'
        chat.match = 'u1'
      }
    })

    // sort chats by time stamp
    chats.sort((a, b) => {
      return moment(a.lastMsgSentDate).isBefore(b.lastMsgSentDate) ? 1 : -1
    })

    // set the current chat to the first 1
    if (chats.length > 0) {
      state.currentChat = chats[0]
      state.prevChatID = chats[0]._id
      
      chats.forEach(chat => {
        state.chats.push(chat)
      })
    }
  },

  chatPushToTop(state, { chatID, msg }) {
    let chats = state.chats
    for (let i = 0; i < chats.length; i++) {
      if (chats[i]._id === chatID) {
        // vuex action
        let [ chat ] = state.chats.splice(i, 1)
        chat.read = false
        chat.messages.push(msg)
        chat.lastUser = msg.user
        state.chats.unshift(chat)
        break
      }
    }
  },

  newChatPushToTop(state, { newChat, userID }) {
    let temp = newChat.self
    newChat.self = newChat.match
    newChat.match = temp
    newChat.read = false
    state.chats.unshift(newChat)
    // remove if match if in matches
    let index = state.matches.findIndex(match => match._id == userID)
    if (index > -1)
      state.matches.splice(index, 1)
    if (state.currentMatch._id == userID)
      state.currentMatch = state.matches[0]
  },

  newEmptyChat(state) {
    state.currentChat = {}
    state.currentChat._id = state.currentMatch._id
    state.currentChat.emptyImg = state.currentMatch.dp
    state.currentChat.match = 'new'
    state.currentChat.new = state.currentMatch.userInfo.nickname
    // state.currentMatch = {}
  },

  setLoading(state, loading) {
    state.loading = loading ? true : false
  },

  setBG(state, bg) {
    state.bg = bg ? true : false
  },

  setDialog(state, dialog) {
    // dialog { header, msg }
    state.dialog = dialog
  },

  updateReadChat(state, id) {
    let chat = state.chats.find(c => c._id === id)
    if (chat)
      chat.read = true // push this to the db
  },

  createChat(state, { newChat, matchID }) {
    let chat = newChat
    chat.read = true
    if (chat._id.substring(0, 24) === state.user._id) {
      chat.self = 'u1'
      chat.match = 'u2'
    } else {
      chat.self = 'u2'
      chat.match = 'u1'
    }

    // push to the chat list
    state.chats.unshift(chat)
    // set to current chat
    state.currentChat = chat

    // remove from match list, find the index
    const index = state.matches.findIndex(match => match._id === matchID)
    // remove the match from the list
    if (index !== -1)
      state.matches.splice(index, 1)
  },

  deleteChatAndUnmatch(state, chatID) {
    let index = state.chats.findIndex(chat => chat._id === chatID)
    state.chats.splice(index, 1)
    if (state.currentChat._id === chatID)
      state.currentChat = state.chats[ Math.max(0, index - 1) ]
  }
}

const matchMutations = {
    setMatches(state, matches){
      state.matches = []
      matches.forEach(match => {
        state.matches.push(match)
    })
  },

  viewMatch(state, id) {
    state.prevChatID = state.currentChat._id
    state.currentChat = -1
    state.currentMatch = state.matches.find(match => match._id === id)
  },

  viewMyProfile(state)  {
    state.prevChatID = state.currentChat._id
    state.currentChat = -1
    state.currentMatch = state.user
  },

  hideMatch(state) {
    let chat = state.chats.find(c => c._id === state.prevChatID)
    if (chat)
      state.currentChat = chat
    else
      state.currentChat = {}

    if (Object.keys(state.currentChat).length > 0)
      state.currentMatch = {}
  },
}

export default {
  ...userMutations,
  ...chatMutations,
  ...matchMutations,
}