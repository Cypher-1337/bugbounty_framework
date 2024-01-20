"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const cleanAll_1 = require("./handlers/cleanAll");
const cleanJob_1 = require("./handlers/cleanJob");
const errorHandler_1 = require("./handlers/errorHandler");
const jobLogs_1 = require("./handlers/jobLogs");
const promoteJob_1 = require("./handlers/promoteJob");
const queues_1 = require("./handlers/queues");
const retryAll_1 = require("./handlers/retryAll");
const retryJob_1 = require("./handlers/retryJob");
const jobProvider_1 = require("./middlewares/jobProvider");
const queueProvider_1 = require("./middlewares/queueProvider");
const wrapAsync_1 = require("./middlewares/wrapAsync");
exports.apiRouter = express_1.Router()
    .get('/queues', wrapAsync_1.wrapAsync(queues_1.queuesHandler))
    .put('/queues/:queueName/retry', queueProvider_1.queueProvider(), wrapAsync_1.wrapAsync(retryAll_1.retryAll))
    .put('/queues/:queueName/:jobId/retry', [queueProvider_1.queueProvider(), jobProvider_1.jobProvider()], wrapAsync_1.wrapAsync(retryJob_1.retryJob))
    .put('/queues/:queueName/:jobId/clean', [queueProvider_1.queueProvider(), jobProvider_1.jobProvider()], wrapAsync_1.wrapAsync(cleanJob_1.cleanJob))
    .put('/queues/:queueName/:jobId/promote', [queueProvider_1.queueProvider(), jobProvider_1.jobProvider()], wrapAsync_1.wrapAsync(promoteJob_1.promoteJob))
    .put('/queues/:queueName/clean/:queueStatus', queueProvider_1.queueProvider(), wrapAsync_1.wrapAsync(cleanAll_1.cleanAll))
    .get('/queues/:queueName/:jobId/logs', [queueProvider_1.queueProvider({ skipReadOnlyModeCheck: true }), jobProvider_1.jobProvider()], wrapAsync_1.wrapAsync(jobLogs_1.jobLogs))
    .use(errorHandler_1.errorHandler);
//# sourceMappingURL=apiRouter.js.map