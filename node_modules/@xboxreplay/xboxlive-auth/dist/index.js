"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const live_1 = require("./core/live");
exports.preAuth = live_1.preAuth;
exports.logUser = live_1.logUser;
const xboxlive_1 = require("./core/xboxlive");
exports.exchangeRpsTicketForUserToken = xboxlive_1.exchangeRpsTicketForUserToken;
exports.exchangeUserTokenForXSTSIdentity = xboxlive_1.exchangeUserTokenForXSTSIdentity;
exports.exchangeTokensForXSTSIdentity = xboxlive_1.exchangeTokensForXSTSIdentity;
exports.authenticate = (email, password, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const preAuthResponse = yield live_1.preAuth();
    const logUserResponse = yield live_1.logUser(preAuthResponse, { email, password });
    const exchangeRpsTicketForUserTokenResponse = yield xboxlive_1.exchangeRpsTicketForUserToken(logUserResponse.access_token);
    return xboxlive_1.exchangeUserTokenForXSTSIdentity(exchangeRpsTicketForUserTokenResponse.Token, { XSTSRelyingParty: options.XSTSRelyingParty, raw: false });
});
