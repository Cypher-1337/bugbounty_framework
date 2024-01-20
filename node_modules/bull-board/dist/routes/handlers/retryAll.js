"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryAll = void 0;
const retryAll = async (_req, res) => {
    const { queue } = res.locals;
    const jobs = await queue.getJobs(['failed']);
    await Promise.all(jobs.map((job) => job.retry()));
    return res.sendStatus(200);
};
exports.retryAll = retryAll;
//# sourceMappingURL=retryAll.js.map