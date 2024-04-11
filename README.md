# Context SDK
## Introduction
The Context SDK provides a powerful and flexible way to interact with Context, enabling developers to manage domains and documents programmatically. With this SDK, you can create, modify, and manage domains and their associated documents using Context's API.

## Installation
To start using the Context SDK in your TypeScript project, install it via npm:
```bash
$ npm install @contextprotocol/sdk
```

## Quick Start
This section walks you through setting up a basic connection and performing common operations with the Context SDK.
Setting Up Your Connection
First, import the SDK and create an instance of the Context object using your API key:

```typescript
import { Context } from '@contextprotocol/sdk';

const ctx = new Context(apiKey);
```

## Domains
Retrieving all Domain Information
```typescript
const allDomainsInfo = await ctx.public.domains();
const allDomainsInfo = await ctx.public.domains({offset: 1, limit: 10});
```

Retrieving info for all your domains:
```typescript
const yourDomains = await ctx.domains();
```

To get information about a domain:
```typescript
const domain = await ctx.domain("domain_name");
```

## Documents
Retrieving all documents from public api
```typescript
const allDocuments = await ctx.public.documents();
const allDocuments = await ctx.public.documents({offset: 1, limit: 10});
```

Retrieve all documents within a domain or a specific document:
```typescript
const document = await domain.document("document_path"); // Get a specific document
const documentInVersionXYZ = await domain.document("document_path?v=X.Y.Z"); // Get a specific version of a document
```

Retriving the document data:
```typescript
const documentData = await document.data();
```

Retrieving a document version list:
```typescript
const documentVersions = await document.versions();
```

Get a specific version of a document:
```typescript
const documentVersion = await document.version("X.Y.Z");
```

# Documentation
For more detailed information on the Context SDK, please refer to the [official documentation](https://docs.ctx.xyz).

# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```