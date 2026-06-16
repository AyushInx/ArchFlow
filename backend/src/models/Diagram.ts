import { Schema, model, Document, Types } from 'mongoose';

export interface IDiagram extends Document {
  projectId: Types.ObjectId;
  nodes: any;
  edges: any;
  updatedAt: Date;
}

const diagramSchema = new Schema<IDiagram>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
  nodes: { type: Schema.Types.Mixed, default: [] },
  edges: { type: Schema.Types.Mixed, default: [] },
}, { timestamps: { createdAt: false, updatedAt: true } });

export const Diagram = model<IDiagram>('Diagram', diagramSchema);
