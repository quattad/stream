const esClient = require('./esClient');

// create a new index called scotch.io-tutorial. If the index has already been created, this function fails safely
const createIndex = async (indexName) => {
        try {
            const res = await esClient.indices.create({
                index: indexName
            });

            if (!res.data.error) {
                console.log("Created new index " + res)
            };

        } catch (err) {
            throw new Error(err);
        }
    };

module.exports = createIndex;