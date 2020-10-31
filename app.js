const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(cors()); // using core so that any other url will able to make request
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gfzth.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true })
.then(() => {     
    app.listen(3000, () => {
        console.log('Server listen at port 3000');
    });
})
.catch(err => console.log(err));

