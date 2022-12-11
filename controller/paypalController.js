const axios = require('axios');
var qs = require('qs');
require("dotenv").config();
const { PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

exports.paypalAuth = async () => {
    const data = qs.stringify({
        'grant_type': 'client_credentials',
        'ignoreCache': 'true',
        'return_authn_schemes': 'true',
        'return_client_metadata': 'true',
        'return_unconsented_scopes': 'true'
    });
    const config = {
        method: 'post',
        url: `${PAYPAL_BASE_URL}/v1/oauth2/token`,
        auth: {
            username: PAYPAL_CLIENT_ID,
            password: PAYPAL_CLIENT_SECRET
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Accept-Encoding': 'identity'
        },
        data: data
    };

    return await axios(config)
}

exports.authorizePayment = async (id, token) => {
    try {
        var config = {
            method: 'post',
            url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${id}/authorize`,
            headers: {
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
                'Authorization': `Bearer ${token}`,
            }
        };
        return axios(config)
    } catch (error) {
        return error
    }
}

exports.capturePayment = async (id, token) => {
    try {
        var config = {
            method: 'post',
            url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${id}/capture`,
            headers: {
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
                'Authorization': `Bearer ${token}`
            }
        };
        return axios(config)

    } catch (error) {
        return error
    }
}