"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelectedStatuses = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const constants_1 = require("../components/constants");
function useSelectedStatuses() {
    const { search, pathname } = react_router_dom_1.useLocation();
    const match = react_router_dom_1.useRouteMatch({ path: '/queue/:name' });
    const [selectedStatuses, setSelectedStatuses] = react_1.useState({});
    react_1.useEffect(() => {
        const query = new URLSearchParams(search);
        const status = query.get('status') || constants_1.STATUS_LIST[0];
        const queue = match ? decodeURIComponent(match === null || match === void 0 ? void 0 : match.params.name) : '';
        if (queue) {
            setSelectedStatuses({ ...selectedStatuses, [queue]: status });
        }
    }, [search, pathname]);
    return selectedStatuses;
}
exports.useSelectedStatuses = useSelectedStatuses;
//# sourceMappingURL=useSelectedStatuses.js.map