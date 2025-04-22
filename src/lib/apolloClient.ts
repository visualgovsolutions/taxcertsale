import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// Config import might not be needed if using relative path
// import config from '../config'; 

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  // Use a relative path, relying on proxy in dev or same-origin in prod
  uri: '/graphql', 
});

// Middleware to add the authentication token to requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('accessToken'); // Adjust key if needed
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Create the Apollo Client instance
const client = new ApolloClient({
  // Use the authLink middleware and the httpLink to send requests
  link: ApolloLink.from([authLink, httpLink]),
  // Use an InMemoryCache for caching query results
  cache: new InMemoryCache(),
  // Optional: Configure default options (e.g., fetch policies)
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: 'cache-and-network',
  //   },
  // },
});

export default client; 