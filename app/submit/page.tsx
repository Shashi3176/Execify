'use client';

import { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector from '@/components/LanguageSelector';
import PrioritySelector from '@/components/PrioritySelector';
import JobStatusCard from '@/components/JobStatusCard';

export default function SubmitPage() {
  const [code, setCode] = useState<string>('console.log("Hello, Execify!")');
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [priority, setPriority] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language, priority }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmittedJobId(data.jobId);
      } else {
        setError(data.error || 'Failed to submit code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Submit Code for Execution</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
        <div>
          <CodeEditor value={code} onChange={setCode} language={language} />
        </div>

        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">Language</label>
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">Priority</label>
            <PrioritySelector value={priority} onChange={setPriority} />
          </div>

          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Code'}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>

      {submittedJobId && <JobStatusCard jobId={submittedJobId} />}
    </div>
  );
}