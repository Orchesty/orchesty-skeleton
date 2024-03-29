import { initiateContainer, listen } from '@orchesty/nodejs-sdk';

function prepare(): void {
    // Load core services by:
    initiateContainer();

    // // System event services - imported from @orchesty/nodejs-connectors
    // const eventStatusFilterSuccess = new EventStatusFilter(EventEnum.PROCESS_SUCCESS);
    // container.setCustomNode(eventStatusFilterSuccess);
    //
    // const eventStatusFilterError = new EventStatusFilter(EventEnum.PROCESS_FAILED);
    // container.setCustomNode(eventStatusFilterError);
    //
    // const eventStatusFilterLimiter = new EventStatusFilter(EventEnum.LIMIT_OVERFLOW);
    // container.setCustomNode(eventStatusFilterLimiter);
    //
    // const eventStatusFilterTrash = new EventStatusFilter(EventEnum.MESSAGE_IN_TRASH);
    // container.setCustomNode(eventStatusFilterTrash);
    //
    // // Express.js is available by import:
    // import { expressApp } from '@orchesty/nodejs-sdk';
    //
    // // DIContainer is available by import:
    // import { container } from '@orchesty/nodejs-sdk';
    //
    // // How to add Connector to the DIC
    // const myConnector = new MyConnector();
    // container.setNode(myConnector);
    //
    // // How to add CustomNode to the DIC
    // const myCustomNode = new MyCustomNode();
    // container.setNode(myCustomNode);
    //
    // // How to add Batch to the DIC
    // const myBatch = new MyBatch();
    // container.setNode(myBatch);
    //
    // // How to add Application to the DIC
    // const myApp = new MyApp();
    // container.setApplication(myApp);
}

// Start App by:
prepare();
listen();
