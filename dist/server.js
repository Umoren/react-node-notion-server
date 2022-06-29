"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const host = "localhost";
const port = 8000;
const server = http_1.default.createServer((req, res) => {
    // Avoid CORS errors
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    switch (req.url) {
        // Will respond to queries to the domain root (like http://localhost/)
        case "/":
            res.writeHead(200);
            res.end(JSON.stringify({ data: "success" }));
            break;
        // Only supports the / route
        default:
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Resource not found" }));
    }
});
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
