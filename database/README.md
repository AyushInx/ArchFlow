# Database

This project uses **MongoDB** with **Mongoose** for data modeling.

## Setup

1. Install MongoDB locally, use Docker, or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Set your connection string in `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/archflow
   ```

## Schema Overview

- **User** — name, email (unique), password (hashed), createdAt
- **Project** — title, owner (→ User), createdAt, updatedAt
- **Diagram** — project (→ Project), nodes (JSON), edges (JSON), updatedAt
- **Collaborator** — project (→ Project), user (→ User), role (VIEWER/EDITOR/OWNER)
- **Comment** — nodeId, project (→ Project), user (→ User), text, createdAt

Models are defined in `backend/src/models/`.
