"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanJob = void 0;
const cleanJob = async (_req, res) => {
    const { job } = res.locals;
    await job.remove();
    return res.sendStatus(204);
};
exports.cleanJob = cleanJob;
//# sourceMappingURL=cleanJob.js.map