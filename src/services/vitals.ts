/**
 * WEB VITALS TRACKING
 * Monitors CLS, INP, LCP per Phase 13 requirements
 */

import { onCLS, onINP, onLCP } from 'web-vitals';

interface VitalsMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
}

function sendToAnalytics(metric: VitalsMetric) {
    const data = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        path: window.location.pathname,
        timestamp: Date.now(),
    };

    // Send to analytics endpoint (replace with actual endpoint)
    console.log('[Web Vitals]', data);

    // Example: Send to analytics API
    // fetch('/api/analytics/vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
}

export function initVitalsTracking() {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
}
