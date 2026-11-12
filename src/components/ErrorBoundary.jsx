import { Component } from 'react'

// A render error anywhere in the tree used to leave a blank white page.
// This keeps the shop usable and shows a retry button instead.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[app] render error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const isBn = (localStorage.getItem('gb_lang') || '').includes('bn')
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="card w-full max-w-md p-6 text-center">
          <h1 className="text-lg font-bold text-ink">
            {isBn ? 'কিছু একটা সমস্যা হয়েছে' : 'Something went wrong'}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {isBn
              ? 'পেজটি লোড করা যায়নি। আবার চেষ্টা করুন।'
              : 'This page could not be loaded. Please try again.'}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button onClick={() => window.location.reload()} className="btn-primary px-4 py-2 text-sm">
              {isBn ? 'আবার চেষ্টা করুন' : 'Reload'}
            </button>
            <a href="/" className="btn-outline px-4 py-2 text-sm">
              {isBn ? 'হোম' : 'Home'}
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
