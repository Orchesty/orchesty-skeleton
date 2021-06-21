import { listen } from 'pipes-nodejs-sdk';

// Express.js is available by import:
// import { expressApp } from 'pipes-nodejs-sdk/lib';

// DIContainer is available by import:
// import { container } from 'pipes-nodejs-sdk/lib';

// How to add Connector to the DIC
// const myConnector = new MyConnector()
// container.setConnector(myConnector.getName(), myConnector);

// How to add CustomNode to the DIC
// const myCustomNode = new MyCustomNode()
// container.setCustomNode(myCustomNode.getName(), myCustomNode);

// How to add Application to the DIC
// const myApp = new MyApp()
// container.setApplication(myApp.getName(), myApp);

// Start App by:
listen();
