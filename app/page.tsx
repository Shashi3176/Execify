import Link from 'next/link';
import ErrorBoundary from '../components/ErrorBoundary'

export const metadata = {
  title: 'Execify | Code Execution Platform',
  description: 'Browser-based code execution with job queuing and real-time streaming',
}

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="space-y-16">
      <section className="text-center py-20">
        <h1 className="text-6xl font-bold text-white mb-6">⚡ Execify</h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Code goes in. Results come out. Everything in between is OS.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Code
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Process Isolation</h3>
            <p className="text-gray-400">Secure sandboxed execution</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Job Queue</h3>
            <p className="text-gray-400">FIFO and priority scheduling</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Updates</h3>
            <p className="text-gray-400">Live execution monitoring</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Scheduling Modes</h3>
            <p className="text-gray-400">Flexible queue management</p>
          </div>
        </div>
      </section>
      </div>
    </ErrorBoundary>
  );
}