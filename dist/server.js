"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const http_1 = __importDefault(require("http"));
const client_1 = require("@notionhq/client");
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;
if (!notionDatabaseId || !notionSecret) {
    throw Error("Must define env variables");
}
const notion = new client_1.Client({
    auth: notionSecret,
});
const host = "localhost";
const port = 8000;
const server = http_1.default.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Avoid CORS errors
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    switch (req.url) {
        // Will respond to queries to the domain root (like http://localhost/)
        case "/":
            const query = yield notion.databases.query({
                database_id: notionDatabaseId,
            });
            const list = query.results.map((row) => {
                var _a, _b;
                const labelCell = row.properties.label;
                const urlCell = row.properties.url;
                const isLabel = labelCell.type === "rich_text";
                const isUrl = urlCell.type === "url";
                if (isLabel && isUrl) {
                    const label = (_a = labelCell.rich_text) === null || _a === void 0 ? void 0 : _a[0].plain_text;
                    const url = (_b = urlCell.url) !== null && _b !== void 0 ? _b : "";
                    return { label, url };
                }
                return { label: "NOT_FOUND", url: "" };
            });
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(list));
            break;
        // Only supports the / route
        default:
            res.setHeader("Content-Type", "application/json");
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Resource not found" }));
    }
}));
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
