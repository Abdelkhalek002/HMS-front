export { ROUTES, default as routes } from './routePaths';
export {
  AuthGuard,
  UserGuard,
  AdminGuard,
  CounterGuard,
  TransferGuard,
  PermissionGuard,
  // Backward compatible aliases
  UserGuard as UserProtect,
  AdminGuard as AdminProtect,
  CounterGuard as CounterProtect,
  TransferGuard as TransferProtect,
  PermissionGuard as PermissionProtect,
} from './guards';
