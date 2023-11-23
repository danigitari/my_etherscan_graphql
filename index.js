const { ApolloServer } = require("apollo-server");
// Import the GraphQL schema
const { importSchema } = require("graphql-import");  
// Import the custom data source
const EtherDataSource = require("./datasource/ethDatasource");
// Import the GraphQL schema from the schema file
const typeDefs = importSchema("./schema.graphql"); 

require("dotenv").config();

// Resolvers map for the GraphQL API
const resolvers = {
  Query: {
    // Resolver to get ether balance for an address
    etherBalanceByAddress: (root, _args, { dataSources }) =>  
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver to get total ether supply
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Resolver to get latest ether price
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Resolver to get average block confirmation time
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create Apollo GraphQL server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    // Register custom data source
    ethDataSource: new EtherDataSource(),  
  }), 
});

// Set no timeout for requests
server.timeout = 0;
// Start the server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`); 
});
