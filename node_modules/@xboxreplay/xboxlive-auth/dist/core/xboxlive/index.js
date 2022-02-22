"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = __importDefault(require("@xboxreplay/errors"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
const config_2 = __importDefault(require("../../config"));
exports.exchangeRpsTicketForUserToken = (RpsTicket) => axios_1.default
    .post(config_1.default.uris.userAuthenticate, {
    RelyingParty: 'http://auth.xboxlive.com',
    TokenType: 'JWT',
    Properties: {
        AuthMethod: 'RPS',
        SiteName: 'user.auth.xboxlive.com',
        RpsTicket
    }
}, {
    headers: Object.assign(Object.assign({}, config_2.default.request.baseHeaders), { Accept: 'application/json', 'x-xbl-contract-version': 0 })
})
    .then(response => {
    if (response.status !== 200)
        throw errors_1.default.internal('Could not exchange specified "RpsTicket"');
    else
        return response.data;
})
    .catch(err => {
    if (!!err.__XboxReplay__)
        throw err;
    else
        throw errors_1.default.internal(err.message);
});
exports.exchangeTokensForXSTSIdentity = ({ userToken, deviceToken, titleToken }, { XSTSRelyingParty, optionalDisplayClaims, raw } = {}) => axios_1.default
    .post(config_1.default.uris.XSTSAuthorize, {
    RelyingParty: XSTSRelyingParty || config_1.default.defaultRelyingParty,
    TokenType: 'JWT',
    Properties: {
        UserTokens: [userToken],
        DeviceToken: deviceToken,
        TitleToken: titleToken,
        OptionalDisplayClaims: optionalDisplayClaims,
        SandboxId: 'RETAIL'
    }
}, {
    headers: Object.assign(Object.assign({}, config_2.default.request.baseHeaders), { Accept: 'application/json', 'x-xbl-contract-version': 1 })
})
    .then(response => {
    if (response.status !== 200) {
        throw errors_1.default.internal('Could not exchange specified "userToken"');
    }
    if (raw !== true) {
        const body = response.data;
        return {
            userXUID: body.DisplayClaims.xui[0].xid || null,
            userHash: body.DisplayClaims.xui[0].uhs,
            XSTSToken: body.Token,
            expiresOn: body.NotAfter
        };
    }
    else
        return response.data;
})
    .catch(err => {
    var _a;
    if (!!err.__XboxReplay__)
        throw err;
    else if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 400) {
        const isDefaultRelyingParty = XSTSRelyingParty === config_1.default.defaultRelyingParty;
        const computedErrorMessage = [
            'Could not exchange "userToken", please',
            `refer to ${config_2.default.gitHubLinks.seeUserTokenIssue}`
        ];
        if (isDefaultRelyingParty === false)
            computedErrorMessage.splice(1, 0, 'double check the specified "XSTSRelyingParty" or');
        throw errors_1.default.internal(computedErrorMessage.join(' '));
    }
    else
        throw errors_1.default.internal(err.message);
});
exports.exchangeUserTokenForXSTSIdentity = (userToken, options) => exports.exchangeTokensForXSTSIdentity({ userToken }, options);
