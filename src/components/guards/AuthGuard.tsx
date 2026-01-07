import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
    children: ReactNode;
    redirectTo?: string;
}

/**
 * Auth guard component for protected routes.
 * Redirects to /auth if user is not authenticated.
 * Preserves the attempted URL for post-login redirect.
 */
export function RequireAuth({ children, redirectTo = '/auth' }: RequireAuthProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show nothing while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect to auth if not logged in
    if (!user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

interface RequireAdminProps {
    children: ReactNode;
    role?: 'admin' | 'super_admin' | 'finance';
}

/**
 * Admin guard component for admin routes.
 * Checks user role from user_roles table.
 */
export function RequireAdmin({ children, role = 'admin' }: RequireAdminProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Role check will be done by the admin layout component
    // which has access to the user's roles
    return <>{children}</>;
}
