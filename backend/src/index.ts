import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
dotenv.config();

export const app = express();
const port = process.env.APP_PORT;
export const api_ver = process.env.API_VERSION;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
