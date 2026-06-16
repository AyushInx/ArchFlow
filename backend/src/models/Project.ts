import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  title: string;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Project = model<IProject>('Project', projectSchema);
