import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditorPane from './components/EditorPane.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import OutputPane from './components/OutputPane.jsx';

// Utility function to download the current code as a file
function downloadSource(code, language) {
  const filename = `snippet.${language}`;
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function App() {
  const [languages, setLanguages] = useState([]);
  const [selected, setSelected] = useState({ language: 'javascript', version: '' });
  const [code, setCode] = useState(`// ⚡ Welcome to Developer Studio v2.0 ⚡
// 🚀 Advanced Code Execution Platform
// 
// Start coding your next breakthrough here!
// This editor supports multiple programming languages
// with real-time execution and futuristic UI.

console.log("🔥 Hello, Developer! 🔥");
console.log("Ready to code the future? Let's go!");

// Example: Simple function
function greetDeveloper(name) {
    return \`👋 Hello \${name}! Welcome to the matrix of code! 🌐\`;
}

console.log(greetDeveloper("Ahmed"));`);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [theme, setTheme] = useState('light');

  // On mount fetch supported languages
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const res = await axios.get('https://developerstudio.onrender.com/api/languages');
        setLanguages(res.data);
        if (res.data.length > 0) {
          setSelected({ language: res.data[0].language, version: res.data[0].version });
        }
      } catch (error) {
        console.error('Failed to fetch languages', error);
      }
    }
    fetchLanguages();
  }, []);

  // Apply theme by setting data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Run code by calling server
  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await axios.post('https://developerstudio.onrender.com/api/run', {
        language: selected.language,
        version: selected.version,
        code
      });
      setOutput(res.data);
    } catch (error) {
      setOutput({ runError: true, message: error.response?.data?.error || error.message });
    } finally {
      setRunning(false);
    }
  };

  // Save snippet to server and copy id to clipboard
  const handleSave = async () => {
    try {
      const res = await axios.post('https://developerstudio.onrender.com/api/snippets', { code, language: selected.language });
      const id = res.data.id;
      await navigator.clipboard.writeText(id);
      alert(`Snippet saved! ID copied to clipboard: ${id}`);
    } catch (error) {
      alert('Failed to save snippet');
    }
  };

  // Load snippet by prompting user for ID
  const handleLoad = async () => {
    const id = prompt('Enter snippet ID');
    if (!id) return;
    try {
      const res = await axios.get(`https://developerstudio.onrender.com/api/snippets/${id}`);
      setCode(res.data.code);
      if (res.data.language) {
        setSelected({ language: res.data.language, version: '' });
      }
    } catch (error) {
      alert('Failed to load snippet');
    }
  };

  // Download the current source to a file
  const handleDownload = () => {
    downloadSource(code, selected.language);
  };

  // Toggle between light and dark themes
  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-container">
      <div className="toolbar">
        <LanguageSelector
          languages={languages}
          selected={selected}
          onChange={setSelected}
        />
        <button onClick={handleRun} disabled={running} className={running ? 'loading' : ''}>
          {running ? '◉ EXECUTING...' : '▶ RUN CODE'}
        </button>
        <button onClick={handleSave}>💾 SAVE</button>
        <button onClick={handleLoad}>📁 LOAD</button>
        <button onClick={handleDownload}>⬇ DOWNLOAD</button>
        <button onClick={handleThemeToggle}>
          {theme === 'light' ? '🌙 DARK MODE' : '☀ LIGHT MODE'}
        </button>
      </div>
      <div className="main-content">
        <div className="editor-pane">
          <EditorPane
            language={selected.language}
            code={code}
            onChange={setCode}
            theme={theme}
          />
        </div>
        <div className="output-pane">
          <OutputPane output={output} />
        </div>
      </div>
      <div className="footer">
        <span>Developed by </span>
        <a href="mailto:AhmedHammad708@yahoo.com" className="email-link">
          AhmedHammad708@yahoo.com
        </a>
        <span> | Developer Studio v2.0 - Advanced Code Execution Platform</span>
      </div>
    </div>
  );
}