const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors')

const app = express();
const port = 4000;

app.use(cors());

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`Listening http://localhost:${port}`);
});
