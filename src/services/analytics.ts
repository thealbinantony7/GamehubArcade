/**
 * ANALYTICS SERVICE
 * Tracks user interactions per Phase 13 requirements
 */

interface AnalyticsEvent {
    event: string;
    properties: Record<string, any>;
    timestamp: number;
    sessionId: string;
    path: string;
}

function getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

function sendEvent(event: string, properties: Record<string, any> = {}) {
    const data: AnalyticsEvent = {
        event,
        properties,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        path: window.location.pathname,
    };

    console.log('[Analytics]', data);

    // Example: Send to analytics API
    // fetch('/api/analytics/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
}

export const analytics = {
    track: sendEvent,

    search: (query: string, results: number) => {
        sendEvent('search', { query, results });
    },

    filter: (filter: string, games: number) => {
        sendEvent('filter', { filter, games });
    },

    gameClick: (gameId: string, position: number, source: string) => {
        sendEvent('game_click', { gameId, position, source });
    },

    abandon: (lastAction: string, timeOnPage: number) => {
        sendEvent('abandon', { lastAction, timeOnPage });
    },
};
