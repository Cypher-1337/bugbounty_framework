"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBullBoard = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const apiRouter_1 = require("./routes/apiRouter");
const entryPoint_1 = require("./routes/entryPoint");
function createBullBoard(bullQueues) {
    const bullBoardQueues = new Map();
    const app = express_1.default();
    app.locals.bullBoardQueues = bullBoardQueues;
    app.set('view engine', 'ejs');
    app.set('views', path_1.default.resolve(__dirname, '../dist/ui'));
    app.use('/static', express_1.default.static(path_1.default.resolve(__dirname, '../static')));
    app.get(['/', '/queue/:queueName'], entryPoint_1.entryPoint);
    app.use('/api', apiRouter_1.apiRouter);
    function addQueue(queue) {
        const name = queue.getName();
        bullBoardQueues.set(name, queue);
    }
    function removeQueue(queueOrName) {
        const name = typeof queueOrName === 'string' ? queueOrName : queueOrName.getName();
        bullBoardQueues.delete(name);
    }
    function setQueues(newBullQueues) {
        newBullQueues.forEach((queue) => {
            const name = queue.getName();
            bullBoardQueues.set(name, queue);
        });
    }
    function replaceQueues(newBullQueues) {
        const queuesToPersist = newBullQueues.map((queue) => queue.getName());
        bullBoardQueues.forEach((_queue, name) => {
            if (queuesToPersist.indexOf(name) === -1) {
                bullBoardQueues.delete(name);
            }
        });
        return setQueues(newBullQueues);
    }
    setQueues(bullQueues);
    return {
        router: app,
        setQueues,
        replaceQueues,
        addQueue,
        removeQueue,
    };
}
exports.createBullBoard = createBullBoard;
//# sourceMappingURL=index.js.map