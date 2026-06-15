import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { bookingRouter } from "./routes/booking.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { desksRouter } from "./routes/desks.js";
import { realtimeRouter } from "./routes/booking_realtime.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

export const app = express();
const port = process.env.APP_PORT;
export const api_ver = process.env.API_VERSION;
const corsOption = {
	origin: "http://localhost:5173",
	credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsOption));
app.use(cookieParser());

app.use(`/api/v${api_ver}/auth`, authRouter);
app.use(`/api/v${api_ver}/booking`, verifyToken, bookingRouter);
app.use(`/api/v${api_ver}/desks`, verifyToken, desksRouter);
app.use(`/api/v${api_ver}/realtime`, verifyToken, realtimeRouter);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
