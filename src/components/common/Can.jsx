import React from 'react';
import { usePermission } from '../../hooks/usePermission';

/**
 * Declarative component for permission-gated UI elements.
 * 
 * Props:
 * - permission: Single or array of permissions required to view the element.
 * - mutatePermission: Action/write permission required (strictly blocked for Observers / Auditors).
 * - children: Content to render when authorized.
 * - fallback: Optional content to render when not authorized (defaults to null).
 */
export const Can = ({ permission, mutatePermission, children, fallback = null }) => {
  const { can, canMutate } = usePermission();

  if (mutatePermission && !canMutate(mutatePermission)) {
    return fallback;
  }

  if (permission && !can(permission)) {
    return fallback;
  }

  return <>{children}</>;
};

export default Can;
