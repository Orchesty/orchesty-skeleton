import { initiateContainer, listen } from '@orchesty/nodejs-sdk';

function prepare(): void {
    // Load core services by:
    initiateContainer();

    // // System event services - imported from @orchesty/connector-common
    // const eventStatusFilterSuccess = new EventStatusFilter(EventEnum.PROCESS_SUCCESS);
    // container.setNode(eventStatusFilterSuccess);
    //
    // const eventStatusFilterError = new EventStatusFilter(EventEnum.PROCESS_FAILED);
    // container.setNode(eventStatusFilterError);
    //
    // const eventStatusFilterLimiter = new EventStatusFilter(EventEnum.LIMIT_OVERFLOW);
    // container.setNode(eventStatusFilterLimiter);
    //
    // const eventStatusFilterTrash = new EventStatusFilter(EventEnum.MESSAGE_IN_TRASH);
    // container.setNode(eventStatusFilterTrash);
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
listen().catch((e: unknown) => {
    const err = e instanceof Error ? e : new Error(typeof e === 'string' ? e : JSON.stringify(e));
    process.stderr.write(`${err.message}\n${err.stack ?? ''}\n`);
    process.exit(1);
});
