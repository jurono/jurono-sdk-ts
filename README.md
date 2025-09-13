# Jurono TypeScript SDK

Official TypeScript SDK for the Jurono API. This SDK provides a complete interface to interact with Jurono's banking and financial services platform.

## Installation

```bash
npm install @jurono/sdk
```

## Quick Start

### Basic Usage

```typescript
import { JuronoApiClient } from '@jurono/sdk';

const client = new JuronoApiClient({
  apiKey: 'your-api-key'
});

// List all clients
const clients = await client.clients.list();

// Get user by ID
const user = await client.users.getById('user-id');
```

### Next.js Integration

#### Client-Side Usage (React Hooks)

```typescript
import { JuronoProvider, useJurono } from '@jurono/sdk/react';

// Wrap your app with the provider
function App() {
  return (
    <JuronoProvider apiKey="your-api-key">
      <MyComponent />
    </JuronoProvider>
  );
}

// Use hooks in your components
function MyComponent() {
  const { clients, users } = useJurono();
  
  const { data: clientsList, loading } = useQuery(() => clients.list());
  
  return (
    <div>
      {loading ? 'Loading...' : clientsList.map(client => (
        <div key={client.id}>{client.name}</div>
      ))}
    </div>
  );
}
```

#### Server-Side Usage (SSG/SSR)

```typescript
import { withJuronoSSR } from '@jurono/sdk/server';

export const getServerSideProps = withJuronoSSR(
  async (sdk, context) => {
    const clients = await sdk.clients.list();
    
    return {
      props: {
        clients: clients.data
      }
    };
  },
  { apiKey: process.env.JURONO_API_KEY }
);
```

#### Next.js Server Actions

For Next.js applications, use the dedicated Next.js bundle with pre-built server actions:

```typescript
import { login, getUser, logout, refresh } from '@jurono/sdk/nextjs';

// Replace your custom auth-actions.ts with:
export async function loginAction(email: string, password: string) {
  return await login(email, password, {
    requireAdminRole: true,
    cookieName: 'admin-token'
  });
}

export async function getUserAction() {
  return await getUser({ 
    requireAdminRole: true 
  });
}

export async function logoutAction() {
  return await logout();
}

export async function refreshAction() {
  return await refresh();
}
```

## API Reference

### Authentication

```typescript
// Login
const loginResult = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Register
const registerResult = await client.auth.register({
  email: 'user@example.com',
  password: 'password',
  name: 'John Doe'
});

// Get current user
const currentUser = await client.auth.me();
```

### Users

```typescript
// List users
const users = await client.users.list();

// Get user by ID
const user = await client.users.getById('user-id');

// Add comment to user
const comment = await client.users.addComment('user-id', {
  message: 'Important note about this user'
});
```

### Clients

```typescript
// List clients
const clients = await client.clients.list();

// Create client
const newClient = await client.clients.create({
  type: 'INDIVIDUAL',
  email: 'client@example.com',
  name: 'John Smith'
});
```

### Organizations

```typescript
// List organizations
const organizations = await client.organizations.list();

// Create organization
const newOrg = await client.organizations.create({
  name: 'ACME Corp',
  type: 'CORPORATION'
});
```

### Documents

```typescript
// List documents
const documents = await client.documents.list();

// Get document by ID
const document = await client.documents.getById('doc-id');
```

### Mandates

```typescript
// List mandates
const mandates = await client.mandates.list();

// Get mandate by ID
const mandate = await client.mandates.getById('mandate-id');
```

## Configuration

### Environment Variables

For development, you can override the API endpoint using environment variables:

- `API_BASEURL` - For Node.js/server environments
- `NEXT_PUBLIC_API_URL` - For Next.js client-side environments

```bash
# .env.local
API_BASEURL=http://localhost:3000/api
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Client Options

```typescript
const client = new JuronoApiClient({
  apiKey: 'your-api-key',
  timeout: 30000,        // Request timeout in milliseconds (default: 30000)
  retries: 3,            // Number of retry attempts (default: 3)
  retryDelay: 1000       // Delay between retries in milliseconds (default: 1000)
});
```

## Error Handling

The SDK includes comprehensive error handling with specific error types:

```typescript
import { JuronoApiError, JuronoNetworkError } from '@jurono/sdk';

try {
  const user = await client.users.getById('invalid-id');
} catch (error) {
  if (error instanceof JuronoApiError) {
    console.log('API Error:', error.status, error.message);
    console.log('Response:', error.response);
  } else if (error instanceof JuronoNetworkError) {
    console.log('Network Error:', error.message);
  }
}
```

## React Hooks

When using the React integration, you have access to powerful hooks:

### useQuery Hook

```typescript
import { useQuery } from '@jurono/sdk/react';

function UsersList() {
  const { users } = useJurono();
  
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(() => users.list(), {
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### useMutation Hook

```typescript
import { useMutation } from '@jurono/sdk/react';

function CreateClientForm() {
  const { clients } = useJurono();
  
  const {
    mutate: createClient,
    loading,
    error
  } = useMutation(clients.create, {
    onSuccess: (data) => {
      console.log('Client created:', data);
    },
    onError: (error) => {
      console.error('Failed to create client:', error);
    }
  });

  const handleSubmit = (formData) => {
    createClient({
      type: 'INDIVIDUAL',
      email: formData.email,
      name: formData.name
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Client'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

## TypeScript Support

This SDK is written in TypeScript and includes comprehensive type definitions. All API responses are fully typed based on the OpenAPI specification.

```typescript
import type { User, Client, Organization } from '@jurono/sdk';

// All API methods return typed responses
const users: User[] = await client.users.list();
const client: Client = await client.clients.getById('client-id');
```

## Development

### Building from Source

```bash
git clone https://github.com/jurono/jurono-sdk-ts.git
cd jurono-sdk-ts
npm install
npm run build
```

### Running Tests

```bash
npm test
npm run test:coverage
```

### Type Checking

```bash
npm run typecheck
```

## Bundle Information

The SDK is built with multiple entry points to optimize bundle size:

- **Main Bundle** (`@jurono/sdk`): Core client and API endpoints (~75KB)
- **React Bundle** (`@jurono/sdk/react`): React hooks and components (~70KB)  
- **Server Bundle** (`@jurono/sdk/server`): Server-side utilities (~20KB)
- **Next.js Bundle** (`@jurono/sdk/nextjs`): Next.js server actions with cookies (~25KB)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- Documentation: [Jurono API Docs](https://docs.jurono.com)
- Issues: [GitHub Issues](https://github.com/jurono/jurono-sdk-ts/issues)
- Email: support@jurono.com