const authorize_uri = 'https://github.com/login/oauth/authorize';
const redirect_uri = 'http://localhost:8080/oauth/redirect';
const clientID = '2698c878ef232a23a08d';
const clientSecret = '9d38b7834feb49b4dd6ef2d1d20c1712e281e735';

const GITHUB_CONF={
    authorize_uri,
    redirect_uri,
    clientID,
    clientSecret
}

module.exports = {
    GITHUB_CONF
};