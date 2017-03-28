
export function hasExpired(auth) {
  return auth && auth.expiresAt < Date.now();
}

export function isAdmin(user) {
  return user && user.role === 'ADMIN';
}
