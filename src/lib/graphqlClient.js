import { GraphQLClient } from 'graphql-request';
import { auth } from "../lib/firebase";
require('dotenv').config();

// Define a function to fetch GraphQL data, including the token
export const fetchGraphQLData = async (query, variables = {}) => {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const graphQLClient = new GraphQLClient(API_ENDPOINT);

  try {
    // Get current user
    const user = auth.currentUser;
    if (user) {
      // Fetch the ID token
      const token = await user.getIdToken();
      // Set the Authorization header
      graphQLClient.setHeader('Authorization', `Bearer ${token}`);
    } else {
      console.error("No user found");
    }

    // Make the GraphQL request
    console.log("-------------- Fetching data ------------");
    console.log("Query: ", query);
    console.log("Variables: ", variables);
    const data = await graphQLClient.request(query, variables);
    console.log("Response : ", data);
    console.log("------------------------------------------");
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching data: ", error);
    // Return error without throwing
    return { data: null, error };
  }
};
