import { GraphQLClient } from 'graphql-request';
import { auth } from "../lib/firebase";

require('dotenv').config();




// Define a function to fetch GraphQL data, including the token
export const fetchGraphQLData = async (query, variables = {}) => {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
  console.log("API Endpoint: ", API_ENDPOINT);
  const graphQLClient = new GraphQLClient(API_ENDPOINT);
  try {
    // Get current user
    const user = auth.currentUser;
    console.log("Current user: ", user);

    if (user) {
      // Fetch the ID token
      const token = await user.getIdToken();
      console.log("User ID Token: ", token);

      // Set the Authorization header
      graphQLClient.setHeader('Authorization', `Bearer ${token}`);
      console.log("Authorization header set.");
    } else {
      console.log("No user is authenticated.");
    }

    // Make the GraphQL request with the token
    console.log("Fetching data...");
    console.log("URL: ", API_ENDPOINT); 
    console.log("Query: ", query);
    console.log("Variables: ", variables);
    const data = await graphQLClient.request(query, variables);
    console.log("GraphQL data: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};
