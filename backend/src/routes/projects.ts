import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Project } from '../models/Project';
import { Collaborator } from '../models/Collaborator';
import { Diagram } from '../models/Diagram';

const router = Router();
router.use(authMiddleware);

// POST /projects - Create a new project
router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Title is required')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { title } = req.body;
      const userId = req.user!._id;

      const project = new Project({
        title,
        ownerId: userId,
      });
      await project.save();

      // Create owner collaborator record
      const collaborator = new Collaborator({
        projectId: project._id,
        userId,
        role: 'OWNER',
      });
      await collaborator.save();

      // Create empty diagram
      const diagram = new Diagram({
        projectId: project._id,
        nodes: [],
        edges: [],
      });
      await diagram.save();

      res.status(201).json({ project });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Server error creating project' });
    }
  }
);

// GET /projects - List user's projects (owned + collaborated)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { search } = req.query;

    // Find projects where the user is a collaborator
    const collaborations = await Collaborator.find({ userId }).select('projectId');
    const projectIds = collaborations.map(c => c.projectId);

    let query: any = { _id: { $in: projectIds } };

    if (search && typeof search === 'string') {
      query.title = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(query).sort({ updatedAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error fetching projects' });
  }
});

// GET /projects/:id - Get a single project
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    // Check access
    const collab = await Collaborator.findOne({ projectId: id, userId });
    if (!collab) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const diagram = await Diagram.findOne({ projectId: id });

    res.json({ project, diagram, role: collab.role });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Server error fetching project' });
  }
});

// DELETE /projects/:id - Delete a project (Owner only)
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Only owner can delete
    if (project.ownerId.toString() !== userId.toString()) {
      res.status(403).json({ error: 'Only the project owner can delete it' });
      return;
    }

    // Delete associated data
    await Project.findByIdAndDelete(id);
    await Collaborator.deleteMany({ projectId: id });
    await Diagram.deleteOne({ projectId: id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error deleting project' });
  }
});

export default router;
