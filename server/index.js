import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { nanoid } from 'nanoid';

// Simple in-memory storage for code snippets. In a production
// deployment you should back this with a persistent store such
// as a database or S3 bucket.
const snippets = {};

const app = express();
app.use(cors());
app.use(express.json());

// Environment configuration
const PORT = process.env.PORT || 3001;
const DEFAULT_RUNNER_URL = 'https://emkc.org/api/v2/piston';

/**
 * GET /api/languages
 *
 * Returns a list of supported runtime environments from the
 * configured code runner. Falls back to a static list if the
 * remote call fails. Each entry in the list contains a
 * `language` and a `version` property.
 */
app.get('/api/languages', async (req, res) => {
  try {
    const baseUrl = process.env.PISTON_BASE_URL || DEFAULT_RUNNER_URL;
    const response = await axios.get(`${baseUrl}/runtimes`);
    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch runtimes from remote runner:', error.message);
    // Fallback static list
    res.json([
      { language: 'javascript', version: '16.0.0' },
      { language: 'python', version: '3.10.0' },
      { language: 'c', version: '10.2.0' },
      { language: 'cpp', version: '10.2.0' },
      { language: 'java', version: '17.0.4' },
      { language: 'csharp', version: '6.0' }
    ]);
  }
});

/**
 * POST /api/run
 *
 * Executes the supplied code using the configured code runner. The
 * request body should be a JSON object containing a `language`, a
 * `version` (optional) and the `code` itself. Input can be passed
 * via `stdin`.
 */
app.post('/api/run', async (req, res) => {
  const { language, version, code, stdin } = req.body;
  if (!language || !code) {
    return res.status(400).json({ error: 'language and code are required' });
  }
  try {
    const baseUrl = process.env.PISTON_BASE_URL || DEFAULT_RUNNER_URL;
    const token = process.env.PISTON_TOKEN;
    const payload = {
      language,
      version: version || undefined,
      files: [{ content: code }],
      stdin: stdin || ''
    };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(`${baseUrl}/execute`, payload, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Execution failed:', error);
    res.status(500).json({ error: 'Failed to execute code', details: error.message });
  }
});

/**
 * POST /api/snippets
 *
 * Saves a code snippet on the server and returns its unique ID. The
 * request body may include a `language` alongside the `code`. Snippets
 * are stored in memory; for production use persist them to disk or a
 * database.
 */
app.post('/api/snippets', (req, res) => {
  const { code, language } = req.body;
  const id = nanoid(10);
  snippets[id] = { code, language, createdAt: new Date().toISOString() };
  res.json({ id });
});

/**
 * GET /api/snippets/:id
 *
 * Retrieves a previously saved snippet by its ID. Returns 404 if not
 * found.
 */
app.get('/api/snippets/:id', (req, res) => {
  const { id } = req.params;
  const snippet = snippets[id];
  if (!snippet) {
    return res.status(404).json({ error: 'Snippet not found' });
  }
  res.json(snippet);
});

// Root endpoint for sanity checking
app.get('/', (req, res) => {
  res.json({ status: 'Developer Studio API v2 is running' });
});

app.listen(PORT, () => {
  console.log(`Developer Studio API listening on port ${PORT}`);
});