import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve pages
const pages = ['index', 'report', 'dashboard', 'about', 'contact', 'login'];
pages.forEach(page => {
  const route = page === 'index' ? '/' : `/${page}`;
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// Placeholder API endpoints
app.post('/api/report', (req, res) => {
  console.log('Report received:', req.body);
  res.json({ success: true, message: 'Report submitted successfully', caseId: 'MP-' + Date.now() });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@safetrace.ai' && password === 'admin123') {
    res.json({ success: true, token: 'demo-token-' + Date.now(), user: { name: 'Admin User', role: 'authority' } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/contact', (req, res) => {
  console.log('Contact form:', req.body);
  res.json({ success: true, message: 'Message sent successfully' });
});

app.get('/api/cases', (req, res) => {
  res.json([
    { id: 'MP-2026-001', name: 'Priya Sharma', age: 8, status: 'Active', lastSeen: 'Jaipur, Rajasthan', date: '2026-02-08', confidence: 87, matches: 3 },
    { id: 'MP-2026-002', name: 'Rahul Verma', age: 14, status: 'Matched', lastSeen: 'Delhi NCR', date: '2026-02-05', confidence: 94, matches: 7 },
    { id: 'MP-2026-003', name: 'Ananya Patel', age: 6, status: 'Resolved', lastSeen: 'Mumbai, Maharashtra', date: '2026-01-28', confidence: 99, matches: 12 },
    { id: 'MP-2026-004', name: 'Vikram Singh', age: 72, status: 'Active', lastSeen: 'Lucknow, UP', date: '2026-02-10', confidence: 45, matches: 1 },
    { id: 'MP-2026-005', name: 'Meera Joshi', age: 10, status: 'Active', lastSeen: 'Pune, Maharashtra', date: '2026-02-09', confidence: 62, matches: 2 },
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SafeTrace AI server running at http://localhost:${PORT}`);
});
