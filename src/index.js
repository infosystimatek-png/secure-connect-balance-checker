import app from "./app.js";
import { config } from "./config.js";

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`TRON DelegaPay backend running at http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/health`);
});
