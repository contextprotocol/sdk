
# Context SDK

## 🚀 Introduction
The Context SDK is a robust and flexible toolkit designed for developers to interact programmatically with Context Protocol. It allows for efficient management of your Documents through Context's API, streamlining operations such as creation, modification, and fetching data.



## 📥 Installation
Install the Context SDK to your TypeScript project using npm:

```bash
npm install @contextprotocol/sdk
```



## ⚡ Quick Start
This guide provides the basic steps to establish a connection and perform common operations using the Context SDK.

### Setting Up Your Connection
To use the Context SDK, you first need to obtain an API key. You can get your API key by creating an account at [app.ctx.xyz](https://app.ctx.xyz).

Initialize the SDK with your API key to start interacting with Context services:

```typescript
import { Context } from '@contextprotocol/sdk';

const ctx = new Context({ apiKey: "your_api_key_here" }); // Replace with your API key
```



## 🌐 Working with Domains

### Fetch Domain Information
Fetch details of a specific domain or the default domain associated with your API key:

```typescript
// Fetch the default domain
const yourDomain = await ctx.domain();

// Fetch a specific domain
const domain = await ctx.domain("domain_name");  // Returns null if not found
```

### Domain Properties
Access and display properties of a domain:

```typescript
console.log(domain.name);
console.log(domain.documents);
console.log(domain.status);
console.log(domain.createdAt);
console.log(domain.updatedAt);
```



## 📄 Managing Documents

### Fetch Documents
Fetch a specific document or template, from any domain:

```typescript
// Fetch a specific document
const document = await ctx.document("document_path");  // "domain/path/to/file"
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
You can fetch a specific version of a document in two different ways:

```typescript
// By using the version method of the document:
const document = await ctx.document("document_path");
const documentVersion = await document.version("X.Y.Z");

// By specifying the version directly the document path:
const documentInVersionXYZ = await ctx.document("document_path?v=X.Y.Z");
```

### Create a Document
Steps to create a new document within a domain:

```typescript
const data = YOUR_AWESOME_JSON_DATA;  // JSON data for the document
const templates = ["template_path"];  // Optional array of template paths
const metadata = { name: "Document Name", description: "Document Description", readme: "Document Readme as markdown" };  // Optional metadata

const newDocument = await ctx.createDocument("document_path", data, templates, metadata);
```

### Update a Document
Update an existing document:

```typescript
const updatedData = YOUR_UPDATED_AWESOME_JSON_DATA;  // Updated JSON data
const doc = await document.update(updatedData);
```

### Adding Metadata to a Document
You can add metadata to a document using the `addMetadata` method. The metadata object should contain the following (optional) fields: `name`, `description`, and `readme` as shown below:

```typescript
const metadata = { name: "Document Name", description: "Document Description", readme: "Document Readme as markdown" };
await document.addMetadata(metadata);
```

## 📐 Creating Templates

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
const metadata = { name: "Template Name", description: "Template Description", readme: "Markdown document" };  // Optional metadata
const template = await ctx.createTemplate("template_path", schema, [], metadata /* optional */);
```
## Installing templates
Once we have the template, we can install it in a document by using the `install` method:
```typescript
const document = await ctx.document("document_path");
const templateArrayToInstall = ["template_path"];
const newDoc = await document.install(templateArrayToInstall);
```
## Uninstalling templates
To uninstall a template from a document, we can use the `uninstall` method:
```typescript
const document = await ctx.document("document_path");
const templateArrayToUninstall = ["template_path"];
const newDoc = await document.uninstall(templateArrayToUninstall);
```
## 📦 Assets

### Upload new Assets
As a user, you can upload assets to your domain. When uploading an asset, you can specify the document path where the asset will be stored.

```typescript
const ctxDocumentPath = "document/path";
const localFilePath = "file/path.jpg";
const asset = await ctx.createAsset(ctxDocumentPath, localFilePath, metadata /* optional */);
```

### Update an Asset
You can update an existing asset by providing the document path and the local file path of the updated asset. It returns a document with a new version.

```typescript
const localFilePath = "file/path.jpg";
const metadata = { name: "Updated Asset", description: "New description" };
const asset = await ctxDocument.updateAsset(localFilePath, metadata /* optional */);
```



## 🌐 Accessing Context Data

Every data on Context is publicly available, free, and forever for other developers to use locally through our public gateway:

```bash
https://rpc.ctx.xyz/domain/path/to/document
```

For more detailed information and examples, visit the [official Context SDK documentation](https://docs.ctx.xyz).

## 👨‍🔧 Error Handling
When calling a function, you can check if an error occurred by checking the `error` property in the returned object:

```typescript
const document = await ctx.document("document_path");
if("error" in document){
  console.error(document.error); // Error message
  console.error(document.message); // Detailed error message
  console.error(document.statusCode); // HTTP status code
}
```
## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
