import { Schema, model, Document, Types } from 'mongoose';

export type Role = 'VIEWER' | 'EDITOR' | 'OWNER';

export interface ICollaborator extends Document {
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  role: Role;
}

const collaboratorSchema = new Schema<ICollaborator>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['VIEWER', 'EDITOR', 'OWNER'], required: true },
});

// Ensure a user can only have one role per project
collaboratorSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const Collaborator = model<ICollaborator>('Collaborator', collaboratorSchema);
