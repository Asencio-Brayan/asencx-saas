import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const user = JSON.parse(userStr);
        if (!allowedRoles.includes(user.role)) {
            // Redirect based on role if trying to access unauthorized area
            if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
                return <Navigate to="/admin" replace />;
            }
            return <Navigate to="/app" replace />;
        }
    }

    return <>{children}</>;
}
