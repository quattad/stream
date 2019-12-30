require('dotenv').config();

const { Client } = require('@elastic/elasticsearch');

// // Create elasticsearch client
const esClient = new Client({
    node: `${process.env.ES_CLIENT_BASE_URL}:${process.env.ES_CLIENT_PORT}`,
    log: 'trace',
    sniffOnStart: true
});

esClient.ping({}, {
    requestTimeout: 60000
}, (err) => {
    if (err) {
        console.log("Elasticsearch server start failed with error: " + err);
    } else {
        console.log(`Elasticsearch server started on port: ${process.env.ES_CLIENT_PORT}`);
    };
});

module.exports = esClient;