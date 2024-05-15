# Context SDK
## Introduction
The Context SDK is a robust and flexible toolkit designed for developers to interact programmatically with Context Protocol. It allows for efficient management of your Documents through Context's API, streamlining operations such as creation, modification, and fetching data.

## Installation
Install the Context SDK to your TypeScript project using npm:

```bash
npm install @contextprotocol/sdk
```

## Quick Start
This guide provides the basic steps to establish a connection and perform common operations using the Context SDK.

### Setting Up Your Connection
To use the Context SDK, you first need to obtain an API key. You can get your API key by creating an account at [app.ctx.xyz](https://app.ctx.xyz).

Initialize the SDK with your API key to start interacting with Context services:

```typescript
import { Context } from '@contextprotocol/sdk';

const ctx = new Context({ apiKey: "your_api_key_here" }); // Replace with your API key
```

## Working with Domains

### Fetch Domain Information
Fetch details of a specific domain or the default domain associated with your API key:

```typescript
// Fetch the default domain
const yourDomain = await ctx.domain();

// Fetch a specific domain
const domain = await ctx.domain("domain_name");  // Returns null if not found
```

### Domain Properties
Access properties of a Domain:

```typescript
console.log(domain.name);
console.log(domain.documents);
console.log(domain.owner);
console.log(domain.createdAt);
console.log(domain.updatedAt);
```

## Managing Documents

### Fetch Documents
Fetch a specific document, from any domain:

```typescript
// Fetch a specific document
const document = await ctx.document("document_path");  // Returns null if not found

// Fetch a specific version of a document
const document = await ctx.document("document_path");
const documentInVersionXYZ = await ctx.document("document_path?v=X.Y.Z"); // Get a specific version of a document
```

### Document Properties
Access and display properties of a document:

```typescript
console.log(document.path);
console.log(document.versionNumber);
console.log(document.data);
console.log(document.createdAt);
console.log(document.updatedAt);
console.log(JSON.stringify(document));
```

### List Document Versions
Fetch a list of all versions of a document:

```typescript
const documentVersions = await document.versions();
```

### Fetch a Specific Document Version
Fetch a specific version of a document:

```typescript
const documentVersion = await document.version("X.Y.Z");
```

### Create a Document
Steps to create a new document within a domain:

```typescript
const data = YOUR_AWESOME_JSON_DATA;  // JSON data for the document
const templates = ["template_path"];  // Optional array of template paths

const newDocument = await ctx.createDocument("document_path", data, templates, false);
```

### Update a Document
Update an existing document:

```typescript
const updatedData = YOUR_UPDATED_AWESOME_JSON_DATA;  // Updated JSON data
const templatesToInstall = ["template_path"];  // Optional array of templates
const versionNumber = "X.Y.Z";  // Optional specific version

await document.update(updatedData, templatesToInstall, versionNumber);
```

### Creating Templates

### Define a JSON Schema for a Template
Create a JSON schema directly or from a TypeScript interface:

```typescript
// Direct JSON Schema definition
const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {"type": "string", "description": "The name of the organization."},
    "description": {"type": "string", "description": "A brief description of the organization."},
    "website": {"type": "string", "description": "The URL of the organization's website.", "format": "uri"}
  },
  "required": ["name"],
};

// Generate JSON schema from a TypeScript interface
const dataName = 'User';
const myDataType = `interface ${dataName} {
  name: string;
  age: number;
}`;
const schema = generateJsonSchema(dataName, myDataType);
```

### Create a New Template
Use the defined schema to create a new template:

```typescript
const template = await ctx.createDocument("template_path", schema, [], true);
```


## Example Workflow

### 1. Create a Document
First, create a document within your Domain using some initial data.

```typescript
import { Context } from '@contextprotocol/sdk';

const ctx = new Context({ apiKey: 'your_api_key_here' });

async function createDocument() {
    const data = {
        title: "Initial Document",
        content: "This is the initial content of the document."
    };

    const document = await ctx.createDocument("newDocumentPath", data, [], false);
    console.log(`Document created on: ${document.path}`);

    return document;
}
```

### 2. Define and Add a Schema
Next, define a JSON schema and use it to create a new template on your domain.

```typescript
async function createTemplate() {
    const schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "The title of the document."
            },
            "content": {
                "type": "string",
                "description": "The content of the document."
            }
        },
        "required": ["title", "content"],
        "additionalProperties": false
    };

    const template = await ctx.createDocument("templatePath", schema, [], true);
    console.log(`Template created on: ${template.path}`);

    return template;
}
```

### 3. Update the Document
Finally, update the previously created document with new data and apply the newly created template.

```typescript
async function updateDocument(documentPath, templatePath) {
    const updatedData = {
        title: "Updated Document",
        content: "This is the updated content of the document."
    };
    const templatesToInstall = [templatePath];  // Use the path of the newly created template

    const doc = await ctx.document(documentPath)
    const updatedDoc = await doc.update(updatedData, templatesToInstall);
    console.log("Document updated successfully.");
}
```

## Creating Asset Documents
```typescript
const ctxDocumentPath = "document/path";
const localFilePath = "file/path.jpg";
const asset = await myDomain.createAsset(ctxDocumentPath, localFilePath, metadata /* optional */);
```

## Documentation
For more detailed information, visit the [official Context SDK documentation](https://docs.ctx.xyz).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
