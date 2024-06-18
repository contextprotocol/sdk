
# Context SDK
![](./assets/context-sdk.png?raw=true)


The [Context SDK](http://docs.ctx.xyz) is a robust and flexible toolkit designed for developers to interact programmatically with [Context Protocol](https://ctx.xyz).

## What is Context
Context is an abstraction layer designed to integrate Web3 storage technologies, providing distinctive features that enhance data management. Dive into creation with our SDK, which helps users to **organize, read and share public and private data** in a sovereign, trusted and verified way. Saying goodbye to hashes, and embracing domains and documents within the blockchain ecosystem. We empower developers to innovate, providing the tools you need to build groundbreaking applications on top of our platform. 

Every data on Context is publicly available, free, and forever for other developers to use everywhere through our public gateway - i.e. [rpc.ctx.xyz/contextprotocol](https://rpc.ctx.xyz/contextprotocol)

### How it works
- **Domains** → Domains represent verified and curated entities, such as companies, projects, or products.
- **Documents** → Context Documents are files designed to store and organize JSON data. Each Document serves as a repository for specific sets of information, facilitating efficient data management and retrieval.
- **Templates** → Context Templates help organize data by providing a standardized layout for storing information. With them, you can easily create, share, and utilize consistent data structures.
- **Assets** → Context Assets are designed to store and organize any image or file. Each Asset serves as a source for specific data, facilitating efficient data management and retrieval.  
<br />

![](./assets/whats-context.png?raw=true)

*Poolside, Context and Alex as Domains, with Documents inside that contain relations between them. The Template "web3/token" used on the "context/token" Document.*

### Why use Context?
Context Protocol is a Web3 Semantic Layer that brings your data:

- **Sovereignty** On Context you control your Data, no third parties involved.
- **Verified Data & Traceability** Get information accuracy verification through our semantic layer, ensuring trust and reliability.
- **Structured Data Storage** Say goodbye to chaotic data storage! Context offers a structured approach to organizing your data using industry-standard templates on top of web3. 
- **AI Empowerment** Context ensures that AI models are trained with structured and verified data, enhancing overall AI performance. 
- **Brand Control** enabling real-time synchronization of your data ensuring updates are promptly propagated across all platforms and partners.
- **Security Data** is stored on the blockchain.

<br />

## ⚡ Getting started
### Install the SDK
Install the Context SDK to your TypeScript project using npm:

```bash
npm install @contextprotocol/sdk
```

### Setting Up Your Connection
To use Context, you always need a domain. This domain acts as your namespace within Context, where all your documents will be stored. Then, you'll need to obtain an API key for your domain.

You can claim your domain and generate the API key by creating an account at [app.ctx.xyz](https://app.ctx.xyz).

Initialize the SDK:

```typescript
import { Context } from '@contextprotocol/sdk';

const ctx = new Context({ apiKey: "your_api_key_here" }); // Replace with your API key
```


<br />

## 🌐 Working with Domains
Domains represent verified and curated entities, such as companies, projects, or individuals.


### Fetch Domain Information
Fetch details of a specific domain or the default domain associated with your API key:

```typescript
// Fetch your domain
const yourDomain = await ctx.domain();

// Fetch a specific domain
const domain = await ctx.domain("domain_name");
```

### Domain Properties
Access and display properties of a domain:

```typescript
console.log(domain.data.name);
console.log(domain.data.documents);
console.log(domain.data.status);
console.log(domain.data.createdAt);
console.log(domain.data.updatedAt);
```


<br />

## 📄 Managing Documents


### Fetch Documents
Fetch a specific document or template or asset, from any domain:

```typescript
// Fetch a specific document
const document = await ctx.document("document_path");  // "domain/path/to/file"
```

### Document Properties
Access and display properties of a document:

```typescript
console.log(document.data.path);
console.log(document.data.versionNumber);
console.log(document.data.data);
console.log(document.data.metadata);
console.log(document.data.templates);
console.log(document.data.type); // Document | Template | Asset
console.log(document.data.txId);
console.log(document.data.createdAt);
console.log(document.data.updatedAt);
console.log(JSON.stringify(document.data));
```

### List Document Versions
Fetch a list of all versions of a document:

```typescript
const documentVersions = await document.data.versions();
```

### Fetch a Specific Document Version
You can fetch a specific version of a document in two different ways:

```typescript
// By using the version method of the document:
const document = await ctx.document("document_path");
const documentVersion = await document.data.getVersion("X.Y.Z");

// By specifying the version directly the document path:
const documentInVersionXYZ = await ctx.document("document_path?v=X.Y.Z");
```

### Create a Document
Steps to create a new document within your domain:

```typescript
const data = YOUR_AWESOME_JSON_DATA;  // JSON data for the document
const templates = ["template_path"];  // Optional array of template paths
const metadata = { name: "Document Name", description: "Document Description", readme: "ctx:domain/files/my_markdown" };  // Optional metadata

const newDocument = await ctx.createDocument("document_path", data, templates, metadata);
```

### Update a Document
Update an existing document:

```typescript
const updatedData = YOUR_UPDATED_AWESOME_JSON_DATA;  // Updated JSON data
const document = await ctx.document("document_path");
if (!document.success) {
    // Handle error
}
const result = await document.data.update(updatedData);
```

### Adding Metadata to a Document
You can add/update metadata to a document anytime using the `addMetadata` method. The metadata object should contain the following (optional) fields: `name`, `description`, and `readme` (link to a Markdown document) as shown below:

```typescript
const metadata = { name: "Document Name", description: "Document Description", readme: "ctx:domain/files/my_markdown" };
await document.data.addMetadata(metadata);
```

<br />

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
const template = await ctx.createTemplate("template_path", schema);
```
### Installing Templates
Once we have the template, we can install it in a document by using the `install` method:
```typescript
const document = await ctx.document("document_path");
if (!document.success) {
    // Handle error
}
const templateArrayToInstall = ["template_path"];
const newDoc = await document.data.install(templateArrayToInstall);
```
### Uninstalling Templates
To uninstall a template from a document, we can use the `uninstall` method:
```typescript
const document = await ctx.document("document_path");
if (!document.success) {
    // Handle error
}
const templateArrayToUninstall = ["template_path"];
const newDoc = await document.data.uninstall(templateArrayToUninstall);
```

<br />

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
const asset = await document.data.updateAsset(localFilePath, metadata /* optional */);
```


## 👨‍🔧 Error Handling
When calling a function, you can check if an error occurred by checking the `error` property in the returned object:

```typescript
const document = await ctx.document("document_path");
if(document.success === false){
  console.error(document.error.error); // Error message
  console.error(document.error.message); // Detailed error message
  console.error(document.error.statusCode); // HTTP status code
}
```


## Support
If you have any questions or just want to brainstorm about how to integrate Context into your project, reach out to us on [Telegram](https://t.me/contextdao) or by [email](mailto:support@ctx.xyz).


For more detailed information and examples, visit the [official Context SDK documentation](https://docs.ctx.xyz).

## License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/contextprotocol/sdk/blob/main/LICENSE.md) file for details.
