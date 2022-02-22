import { ExchangeRpsTicketResponse, AuthenticateResponse, ExchangeResponse, TokensExchangeProperties, TokensExchangeOptions } from '../..';
export declare const exchangeRpsTicketForUserToken: (RpsTicket: string) => Promise<ExchangeRpsTicketResponse>;
export declare const exchangeTokensForXSTSIdentity: <T extends ExchangeResponse>({ userToken, deviceToken, titleToken }: TokensExchangeProperties, { XSTSRelyingParty, optionalDisplayClaims, raw }?: TokensExchangeOptions) => Promise<T | AuthenticateResponse>;
export declare const exchangeUserTokenForXSTSIdentity: <T extends ExchangeResponse>(userToken: string, options: TokensExchangeOptions) => Promise<AuthenticateResponse | T>;
