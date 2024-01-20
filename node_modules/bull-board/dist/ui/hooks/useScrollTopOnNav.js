"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollTopOnNav = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function useScrollTopOnNav() {
    const { key } = react_router_dom_1.useLocation();
    react_1.useEffect(() => {
        window.scrollTo(0, 0);
    }, [key]);
}
exports.useScrollTopOnNav = useScrollTopOnNav;
//# sourceMappingURL=useScrollTopOnNav.js.map