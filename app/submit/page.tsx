'use client'

import { useState } from 'react'
import CodeEditor from '@/components/CodeEditor'
import LanguageSelector from '@/components/LanguageSelector'
import PrioritySelector from '@/components/PrioritySelector'
import JobStatusCard from '@/components/JobStatusCard'

export default function SubmitPage() {
  const [code, setCode] = useState('console.log("Hello, Execify!")')
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript')
  const [priority, setPriority] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Code cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, priority })
      })

      const data = await response.json()

      if (data.success) {
        setSubmittedJobId(data.jobId)
      } else {
        setError(data.error || 'Submission failed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Submit Code</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Code Editor */}
        <div className="lg:col-span-2">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
          />
        </div>

        {/* Right: Controls */}
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Language
                </label>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Priority
                </label>
                <PrioritySelector value={priority} onChange={setPriority} />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
              >
                {isSubmitting ? 'Submitting...' : 'Execute Code'}
              </button>

              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Card (appears after submission) */}
      {submittedJobId && (
        <div className="mt-8">
          <JobStatusCard jobId={submittedJobId} />
        </div>
      )}
    </div>
  )
}