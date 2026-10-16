import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { app } from './api/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Serve frontend in standalone production (when not on Vercel)
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
      if (err) {
        res.send('Poultry Farm Pro API Server running. Open Vite frontend on port 5173 during development.');
      }
    });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
