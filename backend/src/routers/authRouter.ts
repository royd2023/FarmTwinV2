import { Router } from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/authController';

const router = Router();

/**
 * Auth routes
 * POST /auth/signup - Create new user account
 * POST /auth/login - Authenticate user
 * POST /auth/logout - Sign out user
 * GET /auth/me - Get current authenticated user
 */

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getCurrentUser);

export default router;
