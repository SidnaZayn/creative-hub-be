import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const authorize = (allowedRoles = []) => async (req, res, next) => {
	try {
		const userId = req.user?.id;
		if (!userId) return res.status(401).json({ error: 'Unauthorized' });

		// Get user roles from DB
		const userRoles = await prisma.userRole.findMany({
			where: { userId },
			include: { role: true },
		});
		const roles = userRoles.map(ur => ur.role.name);

		// Check if any role matches
		const isValid = allowedRoles.some(role => roles.includes(role));
		if (!isValid) {
			return res.status(403).json({ error: 'Forbidden: insufficient role' });
		}
		next();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export default authorize;