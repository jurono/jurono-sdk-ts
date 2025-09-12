# Jurono API SDK Migration Tasks

This document tracks the migration and implementation of the Jurono API SDK in a task-style format. Tasks are updated as work progresses.

## Tasks

- [x] Scaffold resource classes for major API groups (Auth, Users, Organizations, Clients, Mandates, Documents, etc.)
- [ ] Implement Auth resource methods (login, register, me, verify, password reset, etc.)
- [ ] Implement Users resource methods (list, getById, update, delete, profile, comments, etc.)
- [ ] Implement Organizations resource methods (list, create, getById, update, members, invitations, etc.)
- [ ] Implement Clients resource methods (list, create, getById, update, profiles, etc.)
- [ ] Implement Mandates resource methods (list, getById, updatePricing, contract, negotiate, accept, decline, sign, etc.)
- [ ] Implement Documents resource methods (list, upload, getById, download, version, retention, purge, etc.)
- [ ] Implement other resources (Tasks, Notifications, Reports, FeatureFlags, Blog, etc.)
- [x] Generate TypeScript types from OpenAPI DTOs automatically using openapi-typescript
- [ ] Add endpoint method documentation
- [ ] Add tests for resource methods
- [ ] Publish SDK package
