import Vue from 'vue'
import Router from 'vue-router'
import multiguard from 'vue-router-multiguard'
import guard from './guard'

Vue.use(Router)

const lazyLoad = (path) => () => import(`./pages/${path}.vue`)

const indexRoutes = [
    {
        path: '/',
        name: 'home',
        component: lazyLoad('homePage'),
        meta: {
            title: 'Anispark'
        },
        beforeEnter: multiguard([ guard.getCSRFToken, guard.notAuth ])
    },
    {
        path: '/home',
        redirect: '/'
    },

    {
        path: '/login',
        name: 'login',
        component: lazyLoad('loginPage'),
        meta: {
            title: 'Login to Anispark'
        },
        beforeEnter: guard.notAuth
    },
    // TODO: delete this
    {
        path: '/about',
        name: 'about',
        component: lazyLoad('aboutPage'),
        meta: {
            title: 'About'
        },
    }
]

const registerRoutes = {
    path: '/register',
    component: lazyLoad('register/register'),
    children: [
        {
            path: '',
            name: 'register',
            component: lazyLoad('register/registerPage'),
            meta: {
                title: 'Register'
            },
            beforeEnter: guard.notAuth
        },
        {
            path: 'verify',
            name: 'verify',
            component: lazyLoad('register/registerVerifyPage'),
            meta: {
                title: 'Registration'
            },
            beforeEnter: guard.notAuth
        },
        {
            path: 'info',
            name: 'registerInfo',
            component: lazyLoad('register/registerInfoPage'),
            meta: {
                title: 'Set Up Your Profile'
            },
            beforeEnter: multiguard([ guard.notAuth, guard.key ])
        },
        {
            path: 'interest',
            name: 'registerInterest',
            component: lazyLoad('register/registerInterestPage'),
            meta: {
                title: 'Set Up Your Profile'
            },
            beforeEnter: multiguard([ guard.notAuth, guard.key, guard.info ])
        },
        {
            path: 'pic',
            name: 'registerPicture',
            component: lazyLoad('register/registerPicPage'),
            meta: {
                title: 'Set Up Your Profile'
            },
            beforeEnter: multiguard([ guard.notAuth, guard.key, guard.info, guard.interest ])
        }
    ]
}

const adminRoutes = {
    path: '/admin',
    component: lazyLoad('admin/admin'),
    children: [
        {
            path: '/',
            name: 'admin',
            component: lazyLoad('admin/adminPage'),
            meta: {
                title: 'Admin'
            },
            beforeEnter: guard.isAdmin
        },
        {
            path: 'login',
            name: 'adminLogin',
            component: lazyLoad('admin/adminLoginPage'),
            meta: {
                title: 'Admin Login'
            },
            beforeEnter: multiguard([ guard.getCSRFToken, guard.noAdmin ])
        }
    ]
}

const errorRoutes = [
    {
        path: '/',
        name: 'errors',
        component: lazyLoad('errorPage'),
        children: [
            {
                path: '/down',
                name: 521,
                meta: {
                    title: '521 Web server is down',
                    message: 'Web server is down'
                },
            },
            {
                path: '/*',
                name: 404,
                meta: {
                    title: '404 Not Found',
                    message: 'Not Found'
                },
            },
        ],
        props: route => {
            return {
                error: route.name,
                message: route.meta.message
            }
        }
    },
]

const router = new Router({
    mode: 'history',
    routes: [
        ...indexRoutes,
        registerRoutes,
        adminRoutes,
        {
            path: '/chat',
            name: 'chat',
            component: lazyLoad('chatPage'),
            meta: {
                title: 'Anispark'
            },
            beforeEnter: guard.auth
        },
        ...errorRoutes,
    ],
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})

export default router