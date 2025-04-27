// Types for GraphQL context
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

export interface Context {
  user?: User;
  req: any;
  res: any;
  prisma: any;
} 