import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/cv.types';

interface PermissionGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  mode?: 'hide' | 'disable';
}

/**
 * PermissionGate
 * 
 * A component to restrict access to certain parts of the UI based on user roles.
 * Supports 'hide' (removes component) and 'disable' (adds opacity and pointer-events-none).
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null,
  mode = 'hide'
}) => {
  const { user } = useAuthStore();
  
  const isAllowed = user && allowedRoles.includes(user.role);

  if (!isAllowed) {
    if (mode === 'hide') return <>{fallback}</>;
    
    return (
      <div className="opacity-50 pointer-events-none select-none grayscale" aria-hidden="true">
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGate;
