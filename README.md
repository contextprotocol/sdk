
# Context SDK

<p align="center">
  <a href="https://ctx.xyz">
    <img alt="Context Protocol" style="width: 400px" src="https://rpc.ctx.xyz/contextprotocol/assets/ctx-logo-white"/>
  </a>
</p>

<p align="center">
  <a href="https://ctx.xyz" style="color: #a77dff">Homepage</a> | <a href="https://docs.ctx.xyz/" style="color: #a77dff">Docs</a> | <a href="https://app.ctx.xyz" style="color: #a77dff">WebApp</a>
</p>


<p align="center">AI-Ready, Decentralized Semantic Name Service to organize and verify real-world data in Web3 Storage</p>

## Introduction
The <code>Context SDK</code> is a robust and flexible toolkit designed for developers to interact programmatically with [Context Protocol](https://ctx.xyz) - On-Chain DNS for the New Internet.

## What is Context
Context aims to completely replace the legacy Domain Name System (DNS), creating a new, decentralized foundation for internet naming and trust.

An abstraction layer designed to integrate Web3 storage technologies, providing distinctive features that enhance data management. Dive into creation with our SDK, which helps users to **organize, read and share public and private data** in a sovereign, trusted and verified way. Saying goodbye to hashes, and embracing domains and documents within the blockchain ecosystem. We empower developers to innovate, providing the tools you need to build groundbreaking applications on top of our platform. 

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

## Getting started
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

Fetch details of a specific domain or the default domain associated with your API key:

```typescript
// Fetch your domain
const yourDomain = await ctx.domain();

//Fetch document
const document = await ctx.document("document_path");  // "domain/path/to/file"

// Create a new document
const newDocument = await ctx.createDocument("document_path", data, templates, metadata);
```


<br />


## Support
If you have any questions or just want to brainstorm about how to integrate Context into your project, reach out to us on [Telegram](https://t.me/contextdao) or by [email](mailto:support@ctx.xyz).


For more detailed information and examples, visit the [official Context SDK documentation](https://docs.ctx.xyz).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.