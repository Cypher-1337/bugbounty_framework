/// <reference types="react" />
import { AppJob } from '../../../../../@types/app';
import { TabsType } from '../../../../hooks/useDetailsTabs';
interface DetailsContentProps {
    job: AppJob;
    selectedTab: TabsType;
    actions: {
        getJobLogs: () => Promise<string[]>;
    };
}
export declare const DetailsContent: ({ selectedTab, job: { stacktrace, data, returnValue, opts, failedReason }, actions, }: DetailsContentProps) => JSX.Element | null;
export {};
