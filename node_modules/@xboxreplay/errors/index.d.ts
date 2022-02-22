declare namespace XboxReplayError {
    interface IXboxReplayError {
        __XboxReplay__: boolean;
        details: ErrorDetails;
    }

    export type ErrorDetails = {
        statusCode?: number;
        reason?: string;
    };

    export class XboxReplayError extends Error implements IXboxReplayError {
        static readonly details: Required<ErrorDetails>;
        constructor(message: string, details?: ErrorDetails);
        __XboxReplay__: true;
        details: ErrorDetails;
    }

    export function internal(
        message?: string,
        reason?: string
    ): XboxReplayError;

    export function unauthorized(
        message?: string,
        reason?: string
    ): XboxReplayError;

    export function forbidden(
        message?: string,
        reason?: string
    ): XboxReplayError;

    export function badRequest(
        message?: string,
        reason?: string
    ): XboxReplayError;

    export function build(
        message?: string,
        details?: ErrorDetails | string
    ): XboxReplayError;
}

export = XboxReplayError;
