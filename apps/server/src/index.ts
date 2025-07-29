import { createServer } from "./server";
import "dotenv/config";

const port = process.env.PORT || 8000;
const server = createServer();
server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
