import React from 'react';

/**
 * LanguageSelector component
 *
 * Renders a language dropdown and an optional version dropdown. The
 * languages prop should be an array of objects with `language` and
 * `version` properties. Languages may appear multiple times when
 * multiple versions are supported. Only unique language names are
 * shown in the first select. When a language is selected and
 * multiple versions are available, the second select appears.
 */
export default function LanguageSelector({ languages, selected, onChange }) {
  // Create a map of language to available versions
  const byLang = languages.reduce((acc, runtime) => {
    acc[runtime.language] = acc[runtime.language] || [];
    if (runtime.version) acc[runtime.language].push(runtime.version);
    return acc;
  }, {});
  const uniqueLangs = Object.keys(byLang);
  const versions = byLang[selected.language] || [];
  
  return (
    <div className="language-selector">
      <label 
        htmlFor="language-select" 
        style={{ 
          color: 'var(--text-color)', 
          fontWeight: 'bold',
          textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
          marginRight: '0.5rem'
        }}
      >
        🔧 LANGUAGE:
      </label>
      <select
        id="language-select"
        value={selected.language}
        onChange={(e) => {
          const lang = e.target.value;
          const vers = (byLang[lang] && byLang[lang][0]) || '';
          onChange({ language: lang, version: vers });
        }}
        style={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}
      >
        {uniqueLangs.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
      {versions.length > 1 && (
        <>
          <label 
            htmlFor="version-select" 
            style={{ 
              color: 'var(--text-color)', 
              fontWeight: 'bold',
              textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
              margin: '0 0.5rem'
            }}
          >
            📋 VERSION:
          </label>
          <select
            id="version-select"
            value={selected.version}
            onChange={(e) => onChange({ ...selected, version: e.target.value })}
            style={{
              fontWeight: 'bold'
            }}
          >
            {versions.map((ver) => (
              <option key={ver} value={ver}>{ver}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}