import { Router } from "express";
import {
	deleteRouteTemplate,
	postRouteTemplate,
	searchRouteTemplate,
	updateRouteTemplate,
} from "./routeTemplate.js";
import {
	createDesk,
	deleteDesk,
	getAllAvailableDesks,
	getAllDesksInfo,
	getAllDesksWithStatus,
	updateDesk,
} from "../controllers/desks.js";

export const desksRouter = Router();

desksRouter.post(`/create`, postRouteTemplate(createDesk));
desksRouter.get(`/get/info`, searchRouteTemplate(getAllDesksInfo));
desksRouter.get(`/get/status`, searchRouteTemplate(getAllDesksWithStatus));
desksRouter.get(`/get/available`, searchRouteTemplate(getAllAvailableDesks));
desksRouter.put(`/update`, updateRouteTemplate(updateDesk));
desksRouter.delete(`/delete`, deleteRouteTemplate(deleteDesk));
