const axios = require('axios');
const urlJoin = require('url-join');
 
const USERS_SERVICE = process.env.USERS_SERVICE || 'http://localhost:4001';
const API_VERSION = '/api/v1/sellers/';
 
const getSellersInfo = async function(accessToken, userId) {
 
    try {
        const urlGet = urlJoin(USERS_SERVICE, API_VERSION, userId.toString());
        const headers = {
            Authorization: accessToken
          };
          const config = {
            headers: headers,
          };
 
        const seller = await axios.get(urlGet, config);
        const sellerData = seller.data;
        console.log("VENDEDOR",sellerData);
        return {email : sellerData.email, name : sellerData.name}
    } catch (e) {
        console.error(e);
        return null;
    }
}

module.exports = { getSellersInfo };
