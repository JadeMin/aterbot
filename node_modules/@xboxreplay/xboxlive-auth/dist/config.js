"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_AGENT = [
    'Mozilla/5.0 (XboxReplay; XboxLiveAuth/3.0)',
    'AppleWebKit/537.36 (KHTML, like Gecko)',
    'Chrome/71.0.3578.98 Safari/537.36'
].join(' ');
exports.default = {
    request: {
        baseHeaders: {
            'Accept-encoding': 'gzip',
            'Accept-Language': 'en-US',
            'User-Agent': exports.USER_AGENT
        }
    },
    gitHubLinks: {
        createIssue: 'https://bit.ly/xr-xbl-auth-create-issue',
        seeUserTokenIssue: 'https://bit.ly/xr-xbl-auth-user-token-issue',
        twoFactorAuthenticationError: 'https://bit.ly/xr-xbl-auth-err-2fa',
        unauthorizedActivityError: 'https://bit.ly/xr-xbl-auth-err-activity'
    }
};
