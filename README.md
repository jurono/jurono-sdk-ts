# Jurono TypeScript SDK

A production-ready, lightweight TypeScript SDK for the Jurono API with full Next.js support.

## Features
- 🏗️ **Stripe-like resource classes** for all major API endpoints
- 🔄 **Auto-generated TypeScript types** from OpenAPI spec
- ⚛️ **React hooks** for client-side usage
- 🔄 **SSG/SSR utilities** for Next.js server-side operations
- 🛡️ **Production-ready error handling** with custom error types
- 🔄 **Built-in retry mechanism** with exponential backoff
- 🎣 **Request/response interceptors** for customization
- 📦 **Lightweight** - zero dependencies except React (peer dependency)
- 🔒 **Type-safe** throughout with proper OpenAPI integration

## Installation
```sh
npm install @jurono/sdk
```

## Usage

### Server-Side (SSG/SSR/API Routes)

```ts
import { createServerSDK, withJuronoSSR, withJuronoAPI } from '@jurono/sdk/server';

// Direct usage
const sdk = createServerSDK({ apiKey: 'YOUR_API_KEY' });
const users = await sdk.users.list();

// Next.js getServerSideProps
export const getServerSideProps = withJuronoSSR(
  async (sdk, context) => {
    const users = await sdk.users.list();
    return {
      props: {
        users: users.data
      }
    };
  },
  { apiKey: process.env.JURONO_API_KEY }
);

// Next.js API Route
export default withJuronoAPI(
  async (sdk, { req, res }) => {
    const users = await sdk.users.list();
    res.json(users.data);
  },
  { apiKey: process.env.JURONO_API_KEY }
);
```

### Client-Side with React

```tsx
import { JuronoProvider, useAuth, useUsers } from '@jurono/sdk/react';

// App setup
function App() {
  return (
    <JuronoProvider apiKey="YOUR_API_KEY">
      <Dashboard />
    </JuronoProvider>
  );
}

// Component usage
function Dashboard() {
  const { useLogin } = useAuth();
  const { useUsersList } = useUsers();
  
  const { data: users, loading, error, refetch } = useUsersList();
  const { mutate: login, loading: loginLoading } = useLogin({
    onSuccess: (data) => {
      console.log('Logged in!', data);
    }
  });

  const handleLogin = () => {
    login({ email: 'user@example.com', password: 'password123' });
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleLogin} disabled={loginLoading}>
        {loginLoading ? 'Logging in...' : 'Login'}
      </button>
      <button onClick={refetch}>Refresh Users</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Advanced Usage

```ts
import { JuronoApiClient, JuronoApiError } from '@jurono/sdk';

// Custom configuration
const client = new JuronoApiClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.jurono.eu/api', // optional
  timeout: 30000, // 30 seconds
  retries: 3, // retry failed requests
  retryDelay: 1000 // 1 second base delay
});

// Add request interceptor
client.addRequestInterceptor({
  fulfilled: async (config) => {
    console.log('Request:', config.url);
    // Add custom headers, modify request
  }
});

// Add response interceptor
client.addResponseInterceptor({
  fulfilled: async (response) => {
    console.log('Response:', response.status);
  },
  rejected: async (error) => {
    console.error('Request failed:', error);
  }
});

// Error handling
try {
  await client.auth.login({ email: 'user@example.com', password: 'wrong' });
} catch (error) {
  if (error instanceof JuronoApiError) {
    console.log('API Error:', error.status, error.response);
  } else {
    console.log('Network/Other Error:', error.message);
  }
}
```

## API Reference

### Core Classes
- `JuronoApiClient` - Main client for server-side usage
- `Auth` - Authentication operations
- `Users` - User management
- `Organizations` - Organization management
- `Clients` - Client management
- `Mandates` - Legal mandate operations
- `Documents` - Document operations

### React Hooks
- `useQuery` - Generic data fetching hook
- `useMutation` - Generic data mutation hook
- `useAuth()` - Authentication hooks
- `useUsers()` - User management hooks
- `useOrganizations()` - Organization hooks
- `useClients()` - Client hooks
- `useMandates()` - Mandate hooks
- `useDocuments()` - Document hooks

### Server Utilities
- `createServerSDK()` - Create server-side SDK instance
- `withJuronoSSG()` - Next.js getStaticProps wrapper
- `withJuronoSSR()` - Next.js getServerSideProps wrapper
- `withJuronoAPI()` - Next.js API route wrapper

## Type Generation
Types are auto-generated from the OpenAPI spec:
```sh
npm run generate:types
```

## Development
```sh
npm run build        # Build the SDK
npm run dev          # Build in watch mode
npm run typecheck    # Check TypeScript
npm run lint         # Lint code
npm run test         # Run tests
```

## Error Types
- `JuronoApiError` - API response errors (4xx, 5xx)
- `JuronoNetworkError` - Network connectivity issues
- `JuronoTimeoutError` - Request timeout
- `JuronoAbortError` - Request cancellation

## Contributing
Open issues or PRs on [GitHub](https://github.com/jurono/sdk-js-api)

## License
MIT