import { GraphQLClient } from 'graphql-request';
import { auth } from "../lib/firebase";

require('dotenv').config();

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:8000/graphql';


// Define a function to fetch GraphQL data, including the token
export const fetchGraphQLData = async (query, variables = {}) => {
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
    } else {
      console.log("No user is authenticated.");
    }

    // Make the GraphQL request with the token
    return graphQLClient.request(query, variables);
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};
