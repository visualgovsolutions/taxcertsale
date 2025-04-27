import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
// Config import might not be needed if using relative path
// import config from '../config'; 

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  // Use a relative path, relying on proxy in dev or same-origin in prod
  uri: '/graphql', 
  credentials: 'include', // This ensures cookies are sent with requests
});

// Error handling link to log and handle GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // If we get a 401 Unauthorized error, redirect to login
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
});

// Middleware to add the authentication token to requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  
  // Log token presence for debugging (remove in production)
  console.log(`Token present: ${!!token}`);
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  // Use the authLink middleware and the httpLink to send requests
  link: from([errorLink, authLink, httpLink]),
  // Use an InMemoryCache for caching query results
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add cache policies for specific queries if needed
        },
      },
    },
  }),
  connectToDevTools: process.env.NODE_ENV !== 'production',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only', // Don't cache queries by default
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client; 