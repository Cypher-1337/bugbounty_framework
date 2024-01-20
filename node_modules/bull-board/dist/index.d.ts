import { Express } from 'express-serve-static-core';
import { BaseAdapter } from './queueAdapters/base';
export declare function createBullBoard(bullQueues: ReadonlyArray<BaseAdapter>): {
    router: Express;
    setQueues: (newBullQueues: ReadonlyArray<BaseAdapter>) => void;
    replaceQueues: (newBullQueues: ReadonlyArray<BaseAdapter>) => void;
    addQueue: (queue: BaseAdapter) => void;
    removeQueue: (queueOrName: string | BaseAdapter) => void;
};
