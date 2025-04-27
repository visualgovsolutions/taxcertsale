import { mergeResolvers } from '@graphql-tools/merge';
import certificateResolvers from './certificate.resolver';
import { w9FormResolvers } from './w9form.resolver';
// Import other resolvers as needed

// Merge resolvers
const resolvers = mergeResolvers([
  certificateResolvers,
  w9FormResolvers,
  // Add other resolvers here
]);

export default resolvers;
