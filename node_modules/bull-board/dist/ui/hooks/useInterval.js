"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterval = void 0;
const react_1 = require("react");
function useInterval(callback, delay, deps = []) {
    const savedCallback = react_1.useRef(callback);
    // Remember the latest callback if it changes.
    react_1.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    react_1.useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return;
        }
        savedCallback.current();
        const id = setInterval(() => savedCallback.current(), delay);
        return () => {
            clearInterval(id);
        };
    }, [delay, ...deps]);
}
exports.useInterval = useInterval;
//# sourceMappingURL=useInterval.js.map