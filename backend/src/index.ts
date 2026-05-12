import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { bookingRouter } from "./routes/booking.js";
import { verifyToken } from "./middleware/authMiddleware.js";
dotenv.config();

export const app = express();
const port = process.env.APP_PORT;
export const api_ver = process.env.API_VERSION;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(`/api/v${api_ver}/auth`, authRouter);
app.use(`/api/v${api_ver}/booking`, verifyToken, bookingRouter);

app.get(`/api/v${api_ver}/`, (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
