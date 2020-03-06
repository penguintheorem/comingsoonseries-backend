import { AxiosError } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

function toHttpException(err: any): HttpException {
  if (err instanceof HttpException) {
    return err;
  }
  const { response } = err;

  if (response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return new HttpException(
      {
        errorCode: `generic_http_error`,
        description: `Request failed with status code ${response.status}`,
      },
      response.status,
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    return new HttpException(
      {
        errorCode: `generic_internal_error`,
        description: `GENERIC INTERNAL ERROR FROM THE API`,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

function formatAuth0Exception(err: AxiosError): HttpException {
  const { response } = err;
  const DEFAULT_ERROR = `Generic error from Auth0`;

  return new HttpException(
    {
      errorCode: response.data && response.data.code,
      description:
        response.data &&
        (response.data.error_description ||
          response.data.description ||
          response.data.error ||
          DEFAULT_ERROR),
    },
    response.status,
  );
}

export const ErrorUtils = {
  toHttpException,
  formatAuth0Exception,
};
