"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __importDefault(require("@xboxreplay/errors"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
const config_2 = __importDefault(require("../../config"));
const querystring_1 = require("querystring");
const _getMatchForIndex = (entry, regex, index = 0) => {
    const match = entry.match(regex);
    return (match === null || match === void 0 ? void 0 : match[index]) || void 0;
};
const _requiresIdentityConfirmation = (body) => {
    const m1 = _getMatchForIndex(body, /id=\"fmHF\" action=\"(.*?)\"/, 1);
    const m2 = _getMatchForIndex(m1 || '', /identity\/confirm/, 0);
    return m2 !== null;
};
exports.preAuth = () => axios_1.default
    .get(`${config_1.default.uris.authorize}?${querystring_1.stringify(Object.assign({}, config_1.default.queries.authorize))}`, { headers: config_2.default.request.baseHeaders })
    .then(response => {
    if (response.status !== 200) {
        throw errors_1.default.internal('Pre-authentication failed.');
    }
    const body = (response.data || '');
    const cookie = (response.headers['set-cookie'] || [])
        .map((c) => c.split(';')[0])
        .join('; ');
    const matches = {
        PPFT: _getMatchForIndex(body, /sFTTag:'.*value=\"(.*)\"\/>'/, 1),
        urlPost: _getMatchForIndex(body, /urlPost:'(.+?(?=\'))/, 1)
    };
    if (matches.PPFT === void 0)
        throw errors_1.default.internal(`Could not match "PPFT" parameter, please fill an issue on ${config_2.default.gitHubLinks.createIssue}`);
    else if (matches.urlPost === void 0)
        throw errors_1.default.internal(`Could not match "urlPost" parameter, please fill an issue on ${config_2.default.gitHubLinks.createIssue}`);
    return {
        cookie,
        matches: {
            PPFT: matches.PPFT,
            urlPost: matches.urlPost
        }
    };
})
    .catch(err => {
    if (!!err.__XboxReplay__)
        throw err;
    else
        throw errors_1.default.internal(err.message);
});
exports.logUser = (preAuthResponse, credentials) => axios_1.default
    .post(preAuthResponse.matches.urlPost, querystring_1.stringify({
    login: credentials.email,
    loginfmt: credentials.email,
    passwd: credentials.password,
    PPFT: preAuthResponse.matches.PPFT
}), {
    maxRedirects: 1,
    headers: Object.assign(Object.assign({}, config_2.default.request.baseHeaders), { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: preAuthResponse.cookie })
})
    .then(response => {
    var _a;
    if (response.status !== 200) {
        throw errors_1.default.internal(`Authentication failed.`);
    }
    const body = (response.data || '');
    const { responseUrl = '' } = ((_a = response.request) === null || _a === void 0 ? void 0 : _a.res) || {};
    const hash = responseUrl.split('#')[1];
    if (responseUrl === preAuthResponse.matches.urlPost) {
        throw errors_1.default.unauthorized('Invalid credentials.');
    }
    if (hash === void 0) {
        const errorMessage = _requiresIdentityConfirmation(body) === true
            ? `Activity confirmation required, please refer to ${config_2.default.gitHubLinks.unauthorizedActivityError}`
            : `Invalid credentials or 2FA enabled, please refer to ${config_2.default.gitHubLinks.twoFactorAuthenticationError}`;
        throw errors_1.default.unauthorized(errorMessage);
    }
    const parseHash = querystring_1.parse(hash);
    parseHash.expires_in = Number(parseHash.expires_in);
    return parseHash;
})
    .catch(err => {
    if (!!err.__XboxReplay__)
        throw err;
    else
        throw errors_1.default.internal(err.message);
});
