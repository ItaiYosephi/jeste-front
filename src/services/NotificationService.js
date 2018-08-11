import axios from 'axios'
const NOTIFICATION_URL = (process.env.NODE_ENV !== 'development') ? '/notification' : '//localhost:3000/notification';

function query(userId) {
    return axios.get(`${NOTIFICATION_URL}/${userId}`)
    .then(res => {
        return res.data
    })

}
function markRead(ids) {

    return axios.put(`${NOTIFICATION_URL}`, {ids})
    .then(res => {
        return res.data
    })


}
export default {
    query,
    markRead

}