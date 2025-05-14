// TypeScript MCP Test for SoftworksTradingWeb

// This file demonstrates how you can use the TypeScript MCP to:
// 1. Execute TypeScript code snippets
// 2. Test TypeScript functions
// 3. Debug TypeScript types and interfaces

// TypeScript interface example
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  joined: Date;
}

// Sample data
const users: User[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'admin',
    joined: new Date('2023-01-15')
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'user',
    joined: new Date('2023-03-22')
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    role: 'guest',
    joined: new Date('2023-05-10')
  }
];

// Utility functions that can be executed via MCP
function findUserById(id: number): User | undefined {
  return users.find(user => user.id === id);
}

function getAllUsersByRole(role: User['role']): User[] {
  return users.filter(user => user.role === role);
}

// Function that uses TypeScript features
function formatUser(user: User): string {
  const joinedDate = user.joined.toLocaleDateString();
  return `${user.name} (${user.role}) - Joined: ${joinedDate}`;
}

// Export for use with MCP
export {
  User,
  users,
  findUserById,
  getAllUsersByRole,
  formatUser
};

// When run directly
console.log('TypeScript MCP test file loaded - use MCP to interact with these functions');
console.log('Available users:', users.map(u => u.name).join(', '));