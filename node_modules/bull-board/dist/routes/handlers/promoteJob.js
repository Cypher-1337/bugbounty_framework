"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoteJob = void 0;
const promoteJob = async (_req, res) => {
    const { job } = res.locals;
    await job.promote();
    return res.sendStatus(204);
};
exports.promoteJob = promoteJob;
//# sourceMappingURL=promoteJob.js.map