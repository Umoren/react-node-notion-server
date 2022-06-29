require("dotenv").config();
import http from "http";
import { Client } from "@notionhq/client";

interface ThingToLearn {
  label: string;
  url: string;
}

const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

if (!notionDatabaseId || !notionSecret) {
  throw Error("Must define env variables")
}

const notion = new Client({
  auth: notionSecret,
})

const host = "localhost";
const port = 8000;

const server = http.createServer(async (req, res) => {
  // Avoid CORS errors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    // Will respond to queries to the domain root (like http://localhost/)
    case "/":
      const query = await notion.databases.query({
        database_id: notionDatabaseId,
      });

      const list: ThingToLearn[] = query.results.map((row) => {

        const labelCell = row.properties.label;
        const urlCell = row.properties.url;

         const isLabel = labelCell.type === "rich_text";
         const isUrl = urlCell.type === "url";

         if (isLabel && isUrl) {
          const label = labelCell.rich_text?.[0].plain_text;
          const url = urlCell.url ?? "";

          return { label, url}
         }

         return { label: "NOT_FOUND", url: ""};
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
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});