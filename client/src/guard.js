// services
import axreq from './services/axreq'
import UserService from './services/UserService'
import AdminService from './services/AdminService'

const getCSRFToken = (to, from, next) => {
    console.log('Getting Token')
    axreq('get', '/api/getcsrftoken')
        .then(() => next())
        .catch(() => next('/down'))
}

const userGuards = {
    auth: (to, from, next) => {
        UserService.isAuth()
            .then(() => next())
            .catch(() => next('/'))
    },

    notAuth: (to, from, next) => {
        UserService.isNotAuth()
            .then(() => next())
            .catch(() => next('/chat'))
    },
}

const registerGuards = {
    key: (to, from, next) => to.query.key ? next() : next('/register'),

    info: (to, from, next) => {
        const { fname, lname, nickname, gender, birthday, religion, address } = to.query
        if (!fname || !lname || !nickname || !gender || !birthday || !religion || !address) {
            next({
                path: '/register/info',
                query: {
                    ...to.query,
                    fname,
                    lname,
                    nickname,
                    gender,
                    birthday,
                    religion,
                }
            })
        } else {
            next()
        }
    },

    interest: (to, from, next) => {
        const { personality, likes, dislikes } = to.query
        if (!personality || !likes || !dislikes) {
            next({
                path: '/register/interest',
                query: {
                    ...to.query,
                    personality,
                    likes,
                    dislikes
                }
            })
        } else {
            next()
        }
    },
}

const adminGuards = {
    noAdmin: function(to, from, next) {
        AdminService.noAdmin()
            .then(() => next())
            .catch(() => next('/admin'))
    },

    isAdmin: function(to, from, next) {
        AdminService.isAdmin()
            .then(() => next())
            .catch(() => next('/admin/login'))
    }
}

export default {
    getCSRFToken,
    ...userGuards,
    ...registerGuards,
    ...adminGuards,
}