import express from 'express';
import { MarkerController } from '../controllers/markerController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, MarkerController.getMyMarkers);
router.get('/user/:userId', authMiddleware, MarkerController.getUserMarkers);
router.post('/', authMiddleware, MarkerController.createMarker);
router.delete('/', authMiddleware, MarkerController.deleteMarker);

export default router;