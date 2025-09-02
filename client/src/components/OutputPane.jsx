import React from 'react';

/**
 * OutputPane component
 *
 * Displays the result of code execution. Accepts an `output` prop
 * which should be the JSON response from the API. Handles errors
 * gracefully and differentiates between stdout and stderr.
 */
export default function OutputPane({ output }) {
  // When there is no output yet
  if (!output) {
    return (
      <div className="output-area">
        <div style={{ 
          textAlign: 'center', 
          color: 'var(--text-color)', 
          fontSize: '1.1rem',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          ⚡ SYSTEM READY - AWAITING CODE EXECUTION ⚡
          <br />
          <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Program output will appear here...
          </span>
        </div>
      </div>
    );
  }
  
  // Handle top-level error
  if (output.runError) {
    return (
      <div className="output-area">
        <div style={{ 
          color: 'var(--error-color)',
          fontSize: '1rem',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(255, 68, 68, 0.5)'
        }}>
          ❌ EXECUTION ERROR:
        </div>
        <span className="stderr">{output.message}</span>
      </div>
    );
  }
  
  // Determine whether the response has a run field (Piston style)
  const runResult = output.run || output;
  const { stdout = '', stderr = '', output: out = '', code: exitCode } = runResult;
  
  return (
    <div className="output-area">
      {(stdout || out) && (
        <div>
          <div style={{ 
            color: 'var(--success-color)', 
            fontSize: '0.9rem', 
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            textShadow: '0 0 5px rgba(0, 255, 136, 0.5)'
          }}>
            ✅ OUTPUT:
          </div>
          <div className="stdout">{stdout || out}</div>
        </div>
      )}
      {stderr && (
        <div>
          <div style={{ 
            color: 'var(--error-color)', 
            fontSize: '0.9rem', 
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            marginTop: stdout || out ? '1rem' : '0',
            textShadow: '0 0 5px rgba(255, 68, 68, 0.5)'
          }}>
            ⚠️ ERRORS:
          </div>
          <div className="stderr">{stderr}</div>
        </div>
      )}
      {typeof exitCode !== 'undefined' && (
        <div style={{ 
          marginTop: '1rem', 
          color: exitCode === 0 ? 'var(--success-color)' : 'var(--warning-color)',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          textShadow: `0 0 5px ${exitCode === 0 ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 170, 0, 0.5)'}`
        }}>
          {exitCode === 0 ? '✅' : '⚠️'} Process exited with code: {exitCode}
        </div>
      )}
    </div>
  );
}