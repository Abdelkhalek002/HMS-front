export { ROUTES, default as routes } from './routePaths';
export {
  AuthGuard,
  UserGuard,
  StaffGuard,
  AdminGuard,
  CounterGuard,
  TransferGuard,
  PermissionGuard,
  StudentDocumentGuard,
  // Backward compatible aliases
  UserGuard as UserProtect,
  StaffGuard as StaffProtect,
  AdminGuard as AdminProtect,
  CounterGuard as CounterProtect,
  TransferGuard as TransferProtect,
  PermissionGuard as PermissionProtect,
} from './guards';
