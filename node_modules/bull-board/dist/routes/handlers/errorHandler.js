"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(err, _req, res, 
// eslint-disable-next-line
_next // important argument, don't remove
) {
    res.status(500).send({
        error: 'Queue error',
        message: err.message,
        details: err.stack,
    });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map