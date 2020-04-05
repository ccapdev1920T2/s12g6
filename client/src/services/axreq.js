import axios from 'axios'
import config from '@/config'

axios.defaults.withCredentials = true

const { REQUEST_CONFIG, SERVER_URL } = config

const axreq = (method, path, data) => {
    return new Promise((resolve, reject) => {
        const url = `${SERVER_URL}${path}`
        axios({ method, url, data, ...REQUEST_CONFIG })
            .then(res => {
                res.status < 300 ? resolve(res) : reject(res)
            })
            .catch(err => {
                console.log(err)
                err.data = 'Something went wrong on our side'
                reject(err)
            })
        })
}

export default axreq