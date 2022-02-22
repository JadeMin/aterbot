import { PreAuthResponse, Credentials, LogUserResponse } from '../..';
export declare const preAuth: () => Promise<PreAuthResponse>;
export declare const logUser: (preAuthResponse: PreAuthResponse, credentials: Credentials) => Promise<LogUserResponse>;
