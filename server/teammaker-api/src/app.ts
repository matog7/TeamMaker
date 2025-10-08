import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/ApiRoutes";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", apiRoutes);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
