import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Comment } from '../models/Comment';
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
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error checking access' });
  }
};

// GET /projects/:id/nodes/:nodeId/comments - List comments for a node
router.get('/:id/nodes/:nodeId/comments', checkAccess, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, nodeId } = req.params;
    const comments = await Comment.find({ projectId: id, nodeId })
      .populate('userId', 'name')
      .sort({ createdAt: 1 });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching comments' });
  }
});

// POST /projects/:id/nodes/:nodeId/comments - Create a comment
router.post(
  '/:id/nodes/:nodeId/comments',
  checkAccess,
  [body('text').trim().notEmpty().withMessage('Comment text is required')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id, nodeId } = req.params;
      const { text } = req.body;
      const userId = req.user!._id;

      const comment = new Comment({
        projectId: id,
        nodeId,
        userId,
        text,
      });

      await comment.save();
      await comment.populate('userId', 'name');

      res.status(201).json({ comment });
    } catch (error) {
      res.status(500).json({ error: 'Server error creating comment' });
    }
  }
);

export default router;
