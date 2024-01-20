"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = require("react-dom");
require("./index.css");
require("./theme.css");
require("./toastify.css");
const react_router_dom_1 = require("react-router-dom");
const App_1 = require("./components/App");
const Api_1 = require("./services/Api");
const basePath = ((_a = document.head.querySelector('base')) === null || _a === void 0 ? void 0 : _a.getAttribute('href')) || '';
const api = new Api_1.Api({ basePath });
react_dom_1.render(react_1.default.createElement(react_router_dom_1.BrowserRouter, { basename: basePath },
    react_1.default.createElement(App_1.App, { api: api })), document.getElementById('root'));
//# sourceMappingURL=index.js.map