"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryJob = void 0;
const retryJob = async (_req, res) => {
    const { job } = res.locals;
    await job.retry();
    return res.sendStatus(204);
};
exports.retryJob = retryJob;
//# sourceMappingURL=retryJob.js.map