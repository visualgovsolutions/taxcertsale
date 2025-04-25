import { useQuery, gql } from '@apollo/client';

export const GET_COUNTIES = gql`
  query GetCounties {
    counties {
      id
      name
      state
    }
  }
`;

export interface County {
  id: string;
  name: string;
  state: string;
}

export function useCounties() {
  const { 
    data, 
    loading, 
    error, 
    refetch 
  } = useQuery(GET_COUNTIES, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  return {
    counties: data?.counties as County[] || [],
    loading,
    error,
    refetch
  };
}