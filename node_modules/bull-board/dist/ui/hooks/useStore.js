"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const react_1 = require("react");
const useInterval_1 = require("./useInterval");
const useSelectedStatuses_1 = require("./useSelectedStatuses");
const interval = 5000;
const useStore = (api) => {
    const [state, setState] = react_1.useState({
        data: null,
        loading: true,
    });
    const selectedStatuses = useSelectedStatuses_1.useSelectedStatuses();
    const update = () => api
        .getQueues({ status: selectedStatuses })
        .then((data) => {
        setState({ data, loading: false });
    })
        // eslint-disable-next-line no-console
        .catch((error) => console.error('Failed to poll', error));
    useInterval_1.useInterval(update, interval, [selectedStatuses]);
    const promoteJob = (queueName) => (job) => () => api.promoteJob(queueName, job.id).then(update);
    const retryJob = (queueName) => (job) => () => api.retryJob(queueName, job.id).then(update);
    const cleanJob = (queueName) => (job) => () => api.cleanJob(queueName, job.id).then(update);
    const retryAll = (queueName) => () => api.retryAll(queueName).then(update);
    const cleanAllDelayed = (queueName) => () => api.cleanAllDelayed(queueName).then(update);
    const cleanAllFailed = (queueName) => () => api.cleanAllFailed(queueName).then(update);
    const cleanAllCompleted = (queueName) => () => api.cleanAllCompleted(queueName).then(update);
    const getJobLogs = (queueName) => (job) => () => api.getJobLogs(queueName, job.id);
    return {
        state,
        actions: {
            promoteJob,
            retryJob,
            retryAll,
            cleanJob,
            cleanAllDelayed,
            cleanAllFailed,
            cleanAllCompleted,
            getJobLogs,
        },
        selectedStatuses,
    };
};
exports.useStore = useStore;
//# sourceMappingURL=useStore.js.map