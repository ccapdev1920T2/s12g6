import UserService from '../services/UserService'
import ChatService from '../services/ChatService'
import MatchService from '../services/MatchService'

const userActions = {
  // SIMPLE
  viewMyProfile: ({ commit }, payload) => commit('viewMyProfile', payload),
  addNewImage: ({ commit }, payload) => commit('addNewImage', payload),
  setUser: ({ commit }, payload) => commit('setUser', payload),
  editProfile: ({ commit }, payload) => commit('editProfile', payload),
  editDP: ({ commit }, payload) => commit('editDP', payload),
  editRemoveImages: ({ commit }, payload) => commit('editRemoveImages', payload),
  reportUser: ({ commit }, payload) => commit('reportUser', payload),
  
  // GET
  getUserById: ({ commit }, payload) => userAction(commit, payload, 'getUserById', 'setMatchByUser'),
  // PATCH
  editProfileInfo: ({ commit }, payload) => userAction(commit, payload, 'editProfileInfo', 'editProfile'),
  editProfileInterest: ({ commit }, payload) => userAction(commit, payload, 'editProfileInterest', 'editProfile'),
  // DELETE
  deleteAccount: ({ commit }) => userAction(commit, null, 'deleteAccount', 'destroyStates'),
  // MISC
  logout: ({ commit }) => userAction(commit, null, 'logout', 'destroyStates'),
}

const chatActions = {
  // SIMPLE
  switchChat: ({ commit }, payload) => commit('switchChat', payload),
  setChats: ({ commit }, payload) => commit('setChats', payload),
  chatPushToTop: ({ commit }, payload) => commit('chatPushToTop', payload),
  newChatPushToTop: ({ commit }, payload) => commit('newChatPushToTop', payload),
  newEmptyChat: ({ commit }) => commit('newEmptyChat'),
  
  setLoading: ({ commit }, payload) => commit('setLoading', payload),
  setBG: ({ commit }, payload) => commit('setBG', payload),
  setDialog: ({ commit }, payload) => commit('setDialog', payload),
  // PROMISES
  
  updateReadChat: ({ commit }, payload) => chatAction(commit, payload, 'updateReadChat', 'updateReadChat'),
  createChat: ({ commit }, payload) => chatAction(commit, payload, 'createChat', 'createChat'),
  deleteChatAndUnmatch: ({ commit }, payload) => chatAction(commit, payload, 'deleteChatAndUnmatch', 'deleteChatAndUnmatch'),

  // INIT
  initChat({ commit }) {
      return new Promise((resolve, reject) => {
          ChatService.initChat()
              .then(res => {
                  if (res.status >= 300)
                      reject(res)
                  commit('setUser', res.data.user)

                  if (res.data.chats.length > 0) {
                    commit('setChats', res.data)
                    resolve(false) // true if chats exists
                  }
                  resolve(true) // false if chats is undefined
              }).catch(err => reject(err))
      })
  },
}

const matchActions = {
  // SIMPLE
  viewMatch: ({ commit }, payload) => commit('viewMatch', payload),
  hideMatch: ({ commit }) => commit('hideMatch'),
  // PROMISES
  getMatches: ({ commit }) => matchAction(commit, null, 'getMatches', 'setMatches'),
  unmatchMatch: ({ commit }, payload) => matchAction(commit, payload, 'unmatchMatch', 'unmatchMatch'),
}

// userFunc   -> key function in the UserService
// mutateFunc -> function name in mutateFunc
const userAction = (commit, payload, userFunc, mutateFunc) => {
  return new Promise((resolve, reject) =>
      UserService[userFunc](payload) // payload can be null
          .then(res => res.status < 300 ?
              mutate(commit, mutateFunc, res.data, resolve) :
              reject(res)
          ).catch(err => reject(err))
  )
}

// chatFunc   -> key function in the ChatService
// mutateFunc -> function name in mutateFunc
const chatAction = (commit, payload, chatFunc, mutateFunc) => {
  return new Promise((resolve, reject) => {
    console.log(payload)
      ChatService[chatFunc](payload) // payload can be null
          .then(res => res.status < 300 ?
              mutate(commit, mutateFunc, res.data, resolve) :
              reject(res)
          ).catch(err => reject(err))
  }
  )
}

// matchFunc  -> key function in the MatchService
// mutateFunc -> function name in mutateFunc
const matchAction = (commit, payload, matchFunc, mutateFunc) => {
  return new Promise((resolve, reject) =>
      MatchService[matchFunc](payload) // payload can be null
          .then(res => res.status < 300 ?
              mutate(commit, mutateFunc, res.data, resolve) :
              reject(res)
          ).catch(err => reject(err))
  )
}

// func -> mutateFunc
// data -> res.data that came from the service
const mutate = (commit, func, data, resolve) => {
  commit(func, data) // data can be null
  resolve(data)
}

export default {
  ...userActions,
  ...chatActions,
  ...matchActions,
}