const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');
 //-----------------------------------------------------------
 async function githubTwo(clientID,clientSecret,code){
    const requestToken = code;

    const tokenResponse = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${clientSecret}&` +
            `code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    });

    const accessToken = tokenResponse.data.access_token;
    // console.log(`access token: ${accessToken}`);

    const result = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`
    }
    });
    const data = result.data;
    return data;
};

module.exports = githubTwo;