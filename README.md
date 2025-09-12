# Jurono TypeScript SDK

A fully automated, type-safe TypeScript SDK for the Jurono API.

## Features
- Stripe-like resource classes for all major API endpoints
- Auto-generated TypeScript types from OpenAPI spec
- Automated build, type generation, and release workflow
- Ready for CI/CD with semantic-release and changelog automation

## Installation
```sh
npm install @jurono/sdk
```

## Usage
```ts
import { JuronoApiClient, Auth, Users, Organizations, Clients, Mandates, Documents } from '@jurono/sdk';

const client = new JuronoApiClient({ apiKey: 'YOUR_API_KEY' });
const auth = new Auth(client);
const users = new Users(client);
const orgs = new Organizations(client);
const clients = new Clients(client);
const mandates = new Mandates(client);
const documents = new Documents(client);

// Example: Login
await auth.login({ email: 'user@example.com', password: 'password123' });

// Example: List users
const userList = await users.list();
```

## Type Generation
Types are auto-generated from the OpenAPI spec. To update types:
```sh
npm run generate:types
```

## Build
```sh
npm run build
```

## Publishing
Publishing is automated via semantic-release in CI. To publish manually:
```sh
npm run publish
```

## Contributing
- Open issues or PRs on [GitHub](https://github.com/jurono/sdk-js-api)

## License
MIT
