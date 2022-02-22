"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultMessage = 'Something went wrong...';
const defaultDetails = {
    statusCode: 500,
    reason: 'INTERNAL_SERVER_ERROR'
};
class XboxReplayError extends Error {
    constructor(message = defaultMessage, details = {}) {
        super(message);
        this.__XboxReplay__ = true;
        this.details = Object.assign({}, defaultDetails);
        Error.captureStackTrace(this, XboxReplayError);
        this.name = 'XboxReplayError';
        this.details = Object.assign({}, this.details, details);
    }
}
XboxReplayError.details = Object.assign({}, defaultDetails);
exports.XboxReplayError = XboxReplayError;
exports.default = {
    badRequest: (message = 'Bad request', reason = 'BAD_REQUEST') => new XboxReplayError(message, {
        statusCode: 400,
        reason
    }),
    unauthorized: (message = 'Unauthorized', reason = 'UNAUTHORIZED') => new XboxReplayError(message, {
        statusCode: 401,
        reason
    }),
    forbidden: (message = 'Forbidden', reason = 'FORBIDDEN') => new XboxReplayError(message, {
        statusCode: 403,
        reason
    }),
    internal: (message = defaultMessage, reason = defaultDetails.reason) => new XboxReplayError(message, {
        statusCode: 500,
        reason
    }),
    build: (message = '', details = Object.assign({}, XboxReplayError.details)) => {
        if (typeof details === 'string') {
            details = {
                reason: details,
                statusCode: defaultDetails.statusCode
            };
        }
        return new XboxReplayError(message, details);
    }
};
