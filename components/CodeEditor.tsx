'use client';

import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export default function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  return (
    <Editor
      height="450px"
      theme="vs-dark"
      value={value}
      language={language}
      onChange={(newValue) => onChange(newValue || '')}
      defaultValue='console.log("Hello, Execify!")'
      options={{ minimap: { enabled: false }, fontSize: 14 }}
    />
  );
}