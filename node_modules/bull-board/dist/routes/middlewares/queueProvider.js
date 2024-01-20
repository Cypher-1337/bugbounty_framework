"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueProvider = void 0;
function queueProvider({ skipReadOnlyModeCheck = false, } = {}) {
    return async (req, res, next) => {
        const { queueName } = req.params;
        if (typeof queueName === 'undefined') {
            return next();
        }
        const { bullBoardQueues } = req.app.locals;
        const queue = bullBoardQueues.get(queueName);
        if (!queue) {
            return res.status(404).send({ error: 'Queue not found' });
        }
        else if (queue.readOnlyMode && !skipReadOnlyModeCheck) {
            return res.status(405).send({
                error: 'Method not allowed on read only queue',
            });
        }
        res.locals.queue = queue;
        next();
    };
}
exports.queueProvider = queueProvider;
//# sourceMappingURL=queueProvider.js.map