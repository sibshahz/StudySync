import { createServer } from "./server";
import "dotenv/config";
import { readExcelFile } from "./utils/excelReader";
import path from "path";

const port = process.env.PORT || 8000;
const server = createServer();
server.listen(port, () => {
  console.log(`Server running on ${port}`);
  // readExcelFile(path.join(__dirname, "utils/projects.xlsx"));
});
