"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobProvider = void 0;
function jobProvider() {
    return async (req, res, next) => {
        const { jobId } = req.params;
        const { queue } = res.locals;
        if (!jobId || !queue) {
            return next(new Error('Invalid data'));
        }
        const job = await queue.getJob(jobId);
        if (!job) {
            return res.status(404).send({
                error: 'Job not found',
            });
        }
        res.locals.job = job;
        next();
    };
}
exports.jobProvider = jobProvider;
//# sourceMappingURL=jobProvider.js.map