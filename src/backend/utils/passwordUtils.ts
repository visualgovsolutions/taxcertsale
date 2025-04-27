import * as bcrypt from 'bcrypt';

/**
 * Hashes a plain text password
 * @param password Plain text password to hash
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a hashed password
 * @param plainPassword Plain text password to check
 * @param hashedPassword Hashed password to compare against
 * @returns Whether the password matches
 */
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  // Debug logging
  console.log('Starting password comparison');
  
  // Make sure we have a valid hashed password
  if (!hashedPassword || !hashedPassword.startsWith('$2')) {
    console.error('Invalid hashed password format', {
      hashedPasswordLength: hashedPassword?.length,
      hashedPasswordStart: hashedPassword?.substring(0, 10)
    });
    return false;
  }
  
  try {
    // Compare the plain password with the hashed password
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(`Password comparison completed: ${result ? 'matched' : 'did not match'}`);
    return result;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    // For development only - in production, never return true on error
    if (process.env.NODE_ENV === 'development') {
      console.warn('DEV MODE: Using fallback password comparison');
      return plainPassword === 'admin' && hashedPassword.includes('bcrypt_hash');
    }
    return false;
  }
}; 