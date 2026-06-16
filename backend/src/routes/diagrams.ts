import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Diagram } from '../models/Diagram';
import { Collaborator } from '../models/Collaborator';

const router = Router();
router.use(authMiddleware);

// Middleware to check if user has access to the project
const checkAccess = async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const collab = await Collaborator.findOne({ projectId: id, userId });
    if (!collab) {
      res.status(403).json({ error: 'Access denied to this project' });
      return;
    }

    req.body.collabRole = collab.role;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error checking access' });
  }
};

// GET /projects/:id/diagram - Fetch diagram
router.get('/:id/diagram', checkAccess, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const diagram = await Diagram.findOne({ projectId: id });

    if (!diagram) {
      res.status(404).json({ error: 'Diagram not found' });
      return;
    }

    res.json({ diagram });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching diagram' });
  }
});

// PUT /projects/:id/diagram - Upsert diagram
router.put(
  '/:id/diagram',
  checkAccess,
  [
    body('nodes').isArray().withMessage('Nodes must be an array'),
    body('edges').isArray().withMessage('Edges must be an array'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { nodes, edges, collabRole } = req.body;

      if (collabRole === 'VIEWER') {
        res.status(403).json({ error: 'Viewers cannot modify diagrams' });
        return;
      }

      const diagram = await Diagram.findOneAndUpdate(
        { projectId: id },
        { nodes, edges },
        { new: true, upsert: true }
      );

      res.json({ diagram });
    } catch (error) {
      res.status(500).json({ error: 'Server error saving diagram' });
    }
  }
);

export default router;
