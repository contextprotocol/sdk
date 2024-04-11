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
### Creating a document in a domain
Steps to create a new document under a domain:
1. Create a TCreateDocumentAndVersion object with the document path and data.
```typescript
const createDocumentAndVersion: TCreateDocumentAndVersion = {
    document: { 
        path: "document_path",
        pathHash: "0x1234567890abcdef"
    },
    version: {
        data: YOUR_AWESOME_JSON_DATA,
        templates:[ "document_template_path"] // this field is optional
    }
};
````
2. Create a new document under the domain:
```typescript
const newDocument = await domain.createDocument("document_path", createDocumentAndVersion);
```
### Adding a template to a document
Adding a template to a document:
```typescript
await document.addTemplate("template_path");
```

# Documentation
For more detailed information on the Context SDK, please refer to the [official documentation](https://docs.ctx.xyz).
# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.