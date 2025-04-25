/**
 * Role normalization utilities
 *
 * These utilities help handle differences in case and naming between
 * the database user roles and the frontend expected role formats.
 */

/**
 * Normalizes a role value to the standard uppercase format used in the frontend
 *
 * @param role The role string from any source (API, database, etc.)
 * @returns Normalized role string in uppercase format
 */
export const normalizeRole = (role: string): string => {
  if (!role) return '';

  // Convert to uppercase for standardization
  const upperRole = role.toUpperCase();

  // Map any alternative role names to standard names
  switch (upperRole) {
    case 'ADMIN':
    case 'ADMINISTRATOR':
      return 'ADMIN';

    case 'COUNTY_OFFICIAL':
    case 'COUNTY':
    case 'OFFICIAL':
      return 'COUNTY_OFFICIAL';

    case 'INVESTOR':
    case 'BIDDER':
      return 'INVESTOR';

    case 'USER':
    case 'REGULAR':
    case 'STANDARD':
      return 'USER';

    default:
      return upperRole;
  }
};

/**
 * Checks if a role (from any source) matches a target role
 *
 * @param role The role string to check
 * @param targetRole The expected role format
 * @returns True if the role matches the target role after normalization
 */
export const isRole = (role: string, targetRole: string): boolean => {
  return normalizeRole(role) === normalizeRole(targetRole);
};

/**
 * Checks if a user has any of the specified roles
 *
 * @param userRole The user's role string
 * @param allowedRoles Array of allowed role strings
 * @returns True if the user's role is in the allowedRoles list after normalization
 */
export const hasRole = (userRole: string, allowedRoles: string[]): boolean => {
  const normalizedUserRole = normalizeRole(userRole);
  return allowedRoles.map(role => normalizeRole(role)).includes(normalizedUserRole);
};
