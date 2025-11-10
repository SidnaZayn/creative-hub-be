import express from 'express';
import userDashboardRouter from './user/user-dashboard.router.js';
import ownerDashboardRouter from './owner/owner-dashboard.router.js';

const router = express.Router();

router.use('/dashboard/user', userDashboardRouter);
router.use('/dashboard/owner', ownerDashboardRouter);

export default router;