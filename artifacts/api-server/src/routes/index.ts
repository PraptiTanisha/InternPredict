import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resumeRouter from "./resume";
import predictRouter from "./predict";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resumeRouter);
router.use(predictRouter);
router.use(dashboardRouter);

export default router;
