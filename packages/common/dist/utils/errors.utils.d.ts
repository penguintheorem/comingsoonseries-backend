import { AxiosError } from 'axios';
import { HttpException } from '@nestjs/common';
declare function toHttpException(err: any): HttpException;
declare function formatAuth0Exception(err: AxiosError): HttpException;
export declare const ErrorUtils: {
    toHttpException: typeof toHttpException;
    formatAuth0Exception: typeof formatAuth0Exception;
};
export {};
