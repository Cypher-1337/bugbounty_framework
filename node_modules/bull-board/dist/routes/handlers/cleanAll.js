"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanAll = void 0;
const cleanAll = async (req, res) => {
    const { queueStatus } = req.params;
    const { queue } = res.locals;
    const GRACE_TIME_MS = 5000;
    await queue.clean(queueStatus, GRACE_TIME_MS);
    return res.sendStatus(200);
};
exports.cleanAll = cleanAll;
//# sourceMappingURL=cleanAll.js.map