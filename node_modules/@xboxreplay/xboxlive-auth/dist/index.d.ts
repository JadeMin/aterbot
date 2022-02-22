import { preAuth, logUser } from './core/live';
import { exchangeRpsTicketForUserToken, exchangeUserTokenForXSTSIdentity, exchangeTokensForXSTSIdentity } from './core/xboxlive';
export declare type Credentials = {
    email: string;
    password: string;
};
export declare type TokensExchangeProperties = {
    userToken: string;
    deviceToken?: string;
    titleToken?: string;
};
export declare type TokensExchangeOptions = {
    XSTSRelyingParty?: string;
    optionalDisplayClaims?: string[];
    raw?: boolean;
};
export declare type AuthenticateOptions = {
    XSTSRelyingParty?: string;
};
export declare type PreAuthResponse = {
    cookie: string;
    matches: {
        PPFT: string;
        urlPost: string;
    };
};
export declare type LogUserResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    refresh_token: string;
    user_id: string;
};
export declare type ExchangeResponse = {
    IssueInstant: string;
    NotAfter: string;
    Token: string;
    DisplayClaims: object;
};
export declare type ExchangeRpsTicketResponse = ExchangeResponse & {
    DisplayClaims: {
        xui: [{
            uhs: string;
        }];
    };
};
export declare type AuthenticateResponse = {
    userXUID: string | null;
    userHash: string;
    XSTSToken: string;
    expiresOn: string;
};
export declare const authenticate: (email: string, password: string, options?: AuthenticateOptions) => Promise<AuthenticateResponse>;
export { preAuth, logUser, exchangeRpsTicketForUserToken, exchangeUserTokenForXSTSIdentity, exchangeTokensForXSTSIdentity };
