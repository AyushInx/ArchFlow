import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  nodeId: string;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  nodeId: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = model<IComment>('Comment', commentSchema);
