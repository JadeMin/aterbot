"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CLIENT_IDS = {
    MY_XBOX_LIVE: '0000000048093EE3',
    XBOX_APP: '000000004C12AE6F'
};
exports.default = {
    uris: {
        authorize: 'https://login.live.com/oauth20_authorize.srf'
    },
    queries: {
        authorize: {
            client_id: CLIENT_IDS.XBOX_APP,
            redirect_uri: 'https://login.live.com/oauth20_desktop.srf',
            scope: 'service::user.auth.xboxlive.com::MBI_SSL',
            display: 'touch',
            response_type: 'token',
            locale: 'en'
        }
    }
};
