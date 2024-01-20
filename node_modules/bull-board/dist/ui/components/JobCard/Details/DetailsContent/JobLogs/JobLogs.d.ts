/// <reference types="react" />
interface JobLogsProps {
    actions: {
        getJobLogs: () => Promise<string[]>;
    };
}
export declare const JobLogs: ({ actions }: JobLogsProps) => JSX.Element | null;
export {};
