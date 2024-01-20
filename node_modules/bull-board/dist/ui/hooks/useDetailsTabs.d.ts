import { Status } from '../components/constants';
declare const regularItems: readonly ["Data", "Options", "Logs"];
export declare type TabsType = typeof regularItems[number] | 'Error';
export declare function useDetailsTabs(currentStatus: Status): {
    tabs: {
        title: TabsType;
        isActive: boolean;
        selectTab: () => void;
    }[];
    selectedTab: TabsType;
};
export {};
