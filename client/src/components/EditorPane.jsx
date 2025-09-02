import React from 'react';
import Editor from '@monaco-editor/react';

/**
 * EditorPane component
 *
 * Wraps the Monaco Editor and forwards props such as language,
 * code, onChange handler and theme. The height is set to fill
 * its parent container.
 */
export default function EditorPane({ language, code, onChange, theme }) {
  return (
    <div style={{ position: 'relative', height: '100%', zIndex: 2 }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '15px',
        color: 'var(--text-color)',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
        zIndex: 10,
        pointerEvents: 'none',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        💻 CODE EDITOR
      </div>
      <Editor
        height="100%"
        language={language || 'javascript'}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-dark'} // Always use dark theme for better look
        value={code}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true
          },
          padding: { top: 40 }, // Add padding for the header
          renderWhitespace: 'selection',
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
        onChange={(value) => onChange(value || '')}
      />
    </div>
  );
}