/**
 * ERROR BOUNDARY
 * Catches React errors and logs to observability system
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);

        // Log to Sentry or analytics
        // Sentry.captureException(error, { contexts: { react: errorInfo } });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,8%)] text-white">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold">Something went wrong</h1>
                        <p className="text-white/60">Please refresh the page</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-brand-red-base rounded-lg hover:bg-brand-red-deep transition-colors"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
