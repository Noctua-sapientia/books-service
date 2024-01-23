const axios = require('axios');
const urlJoin = require('url-join');
 
const USERS_SERVICE = process.env.USERS_SERVICE || 'http://localhost:4003';
const API_VERSION = '/api/v1/orders';
 
const cancelDeletedBookOrders = async function(accessToken, isbn, userId) {
 
    try {
        const urlPut = urlJoin(USERS_SERVICE, API_VERSION, '/books/', isbn.toString(), '/sellers/', userId.toString() ,'/cancelledRemove');
        const headers = {
            Authorization: accessToken
          };
          const config = {
            headers: headers,
          };
 
        await axios.put(urlPut, {}, config);
        return true;
    } catch (e) {
        console.error(e);
        return null;
    }
}

module.exports = { cancelDeletedBookOrders };