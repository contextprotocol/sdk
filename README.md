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

const ctx = new Context();
```
## Initializing the SDK
To initialize the SDK, you need to provide the api key:
```typescript
await ctx.init({ apiKey });
```

## Domains
Retrieving info for all your domains:
```typescript
const yourDomain = await ctx.domain();
```

To get information about a domain:
```typescript
const domain = await ctx.domain("domain_name");
```

## Documents

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
1. Create a data object.
```typescript
const data: any = YOUR_AWESOME_JSON_DATA;
const templates: string[] = ["template_path"]; // Optional
````
2. Create a new document under the domain:
```typescript
const newDocument = await domain.createDocument("document_path", data, templates);
```
### Adding a template to a document
Adding a template to a document:
```typescript
await document.addTemplate("template_path");
```
### Creating a template
Creating a template:
```typescript
const myDataType = `interface User{
    name: string;
    age: number;
}`;
const schema = generateJsonSchema(dataName, myDataType);
const template = await domain.createTemplate("template_path", schema);
````

## Public
### Domain
Retrieving all Domain Information
```typescript
const allDomainsInfo = await ctx.public.domains();
const allDomainsInfo = await ctx.public.domains({offset: 1, limit: 10});
```
### Document
Retrieving all documents from public API
```typescript
const allDocuments = await ctx.public.documents();
const allDocuments = await ctx.public.documents({offset: 1, limit: 10, name: "document_name", domain: "domain_name"});
```

# Documentation
For more detailed information on the Context SDK, please refer to the [official documentation](https://docs.ctx.xyz).
# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.