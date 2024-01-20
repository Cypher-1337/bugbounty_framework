"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobLogs = void 0;
const jobLogs = async (req, res) => {
    const { jobId } = req.params;
    const { queue } = res.locals;
    const logs = await queue.getJobLogs(jobId);
    return res.json(logs);
};
exports.jobLogs = jobLogs;
//# sourceMappingURL=jobLogs.js.map