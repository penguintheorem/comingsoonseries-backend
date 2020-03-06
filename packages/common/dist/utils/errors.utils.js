"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
function toHttpException(err) {
    if (err instanceof common_1.HttpException) {
        return err;
    }
    const { response } = err;
    if (response) {
        return new common_1.HttpException({
            errorCode: `generic_http_error`,
            description: `Request failed with status code ${response.status}`,
        }, response.status);
    }
    else {
        return new common_1.HttpException({
            errorCode: `generic_internal_error`,
            description: `GENERIC INTERNAL ERROR FROM THE API`,
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
function formatAuth0Exception(err) {
    const { response } = err;
    const DEFAULT_ERROR = `Generic error from Auth0`;
    return new common_1.HttpException({
        errorCode: response.data && response.data.code,
        description: response.data &&
            (response.data.error_description ||
                response.data.description ||
                response.data.error ||
                DEFAULT_ERROR),
    }, response.status);
}
exports.ErrorUtils = {
    toHttpException,
    formatAuth0Exception,
};
//# sourceMappingURL=errors.utils.js.map