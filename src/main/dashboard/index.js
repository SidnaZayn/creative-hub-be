import express from 'express';
import userDashboardRouter from './user/user-dashboard.router.js';
// import ownerDashboardRouter from './owner/ownerDashboard.router.js';

const router = express.Router();

router.use('/dashboard/user', userDashboardRouter);
// router.use('/owner', ownerDashboardRouter);

export default router;