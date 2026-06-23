'use client';

interface LanguageSelectorProps {
  value: 'javascript' | 'python';
  onChange: (lang: 'javascript' | 'python') => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as 'javascript' | 'python')}
      className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
    </select>
  );
}