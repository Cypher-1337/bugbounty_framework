/// <reference types="react" />
import { AppJob } from '../../../../@types/app';
import { Status } from '../../constants';
interface DetailsProps {
    job: AppJob;
    status: Status;
    actions: {
        getJobLogs: () => Promise<string[]>;
    };
}
export declare const Details: ({ status, job, actions }: DetailsProps) => JSX.Element | null;
export {};
