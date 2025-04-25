import { mergeResolvers } from '@graphql-tools/merge';
import certificateResolvers from './certificate.resolver';
// Import other resolvers as needed

// Merge resolvers
const resolvers = mergeResolvers([
  certificateResolvers,
  // Add other resolvers here
]);

export default resolvers;
