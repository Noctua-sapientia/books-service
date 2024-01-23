const debug = require('debug')('books:users');

const getSellersInfo = async function(sellerId, accessToken) {
  try {
    const headers = {
        'Content-Type' : 'application/json',
        Authorization: accessToken
    };

    const request = new Request(`http://localhost:4001/api/v1/sellers/${sellerId}`,{
        method: 'GET',
        headers: headers,
    });

    const response = await fetch(request);
    
    const sellerData = await response.json();
    const { email, name } = sellerData;
    return { email: email, name: name };

  } catch (e) {
    console.error("Error obtaining customer information:", e.message);
    return null;
  }
};

module.exports = { getSellersInfo };
