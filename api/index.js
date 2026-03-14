/**
 * Vercel serverless entry: forwards all /api/* requests to the Express app.
 * Export the app so Vercel's Node runtime uses it as the request handler.
 */
import app from "../src/app.js";

export default app;
