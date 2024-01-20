// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',  // Your API endpoint path
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000',  // Your backend server URL
      changeOrigin: true,
    })
  );
};