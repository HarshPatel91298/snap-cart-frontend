'use client';
import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { fetchGraphQLData } from '@/lib/graphqlClient';



// Create AuthContext
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a new user in the database
      await createUser(user);

      // Set the user state
      setUser(user);

      return { success: true, message: "Google sign-in successful!" };
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      return { success: false, message: `Google sign-in failed: ${error.message}` };
    }
  };

  const emailandPasswordSignUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User FFFF: ", user);

      // Update the user's display name
      await updateProfile(user, { displayName: name });

      // Send email verification
      await sendEmailValidation(user);

      // Create a new user in the database
      await createUser(user);

      // Set the user state
      setUser(user);

      return { success: true, message: "Sign-up successful!" };
    } catch (error) {
      console.error('Error during sign-up:', error);
      const errorCode = error.code;

      return { success: false, errorCode: errorCode };
    }
  };

  const emailandPasswordSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the user state
      setUser(user);

      return { success: true, errorCode: null, message: "Sign-in successful!" };
    } catch (error) {
      console.error('Error during sign-in:', error);
      return { success: false, errorCode: error.code, message: `Sign-in failed: ${error.message}` };
    }
  };

  // Create a new user in the database
  const createUser = async (user) => {
    const query = `
      mutation CreateUser($newUser: NewUserInput!) {
        createUser(newUser: $newUser) {
          data {
            id
            email
            displayName
            firebaseUID
            photoURL
            emailVerified
            phoneNumber
            createdAt
            creationTime
            lastLoginAt
            lastSignInTime
          }
          message
        }
      }
    `;

    const variables = {
      newUser: {
        email: user.email,
        displayName: user.displayName || '',
        firebaseUID: user.uid,
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || '',
        createdAt: new Date().toISOString(),
        creationTime: user.metadata.creationTime,
        lastLoginAt: user.metadata.lastSignInTime,
        lastSignInTime: user.metadata.lastSignInTime,
      },
    };

    try {
      const response = await fetchGraphQLData(query, variables);

      console.log("Response: ", response);

      if (response.createUser.message === "Email already exists") {
        return { success: false, message: "Email already exists" };
      } else if (response.createUser.data) {
        return { success: true, message: "User created in the database successfully!" };
      } else {
        return { success: false, message: "Failed to create user in database" };
      }

    } catch (error) {
      console.error('GraphQL Error:', error);
      return { success: false, message: `Failed to create user in database: ${error.message}` };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Password reset email sent!" };
    } catch (error) {
      console.error('Error during password reset:', error);
      return { success: false, message: `Password reset failed: ${error.message}` };
    }
  };


  const sendEmailValidation = async (user) => {
    console.log("Send email validation: ", user);

    const actionCodeSettings = {
      url: `http://localhost:3000/login`,// Redirect URL after email verification
      handleCodeInApp: true, // Set to true if you want to handle the verification in-app
    };

    try {
      await sendEmailVerification(user, actionCodeSettings);
      return { success: true, message: "Email validation sent!" };
    } catch (error) {
      console.error('Error during email validation:', error);
      return { success: false, message: `Email validation failed: ${error.message}` };
    }
  };

  const getUserByEmail = async (email) => {
    const query = `
      query GetUserByEmail($email: String!) {
        userByEmail(email: $email) {
          data {
            id
            email
            displayName
            firebaseUID
            photoURL
            emailVerified
            phoneNumber
            createdAt
            creationTime
            lastLoginAt
            lastSignInTime
          }   
          message
        }
      }
    `;

    const variables = { email };

    try {
      const response = await fetchGraphQLData(query, variables);
      console.log('GraphQL response [userByEmail]:', response);
      if (response.userByEmail.data) {
        return { success: true, data: response.userByEmail.data, message: response.userByEmail.message };
      }
      return { success: false, data: null, message: response.userByEmail.message };
    } catch (error) {
      console.error('GraphQL Error:', error);
      return { success: false, data: null, message: `Failed to fetch user: ${error.message}` };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful.");
      setUser(null); // Clear user state on logout
      return { success: true, message: "Sign-out successful!" };
    } catch (error) {
      console.error("Error during sign-out:", error);
      return { success: false, message: `Sign-out failed: ${error.message}` };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null); // Set user or null
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, emailandPasswordSignUp, emailandPasswordSignIn, logout, resetPassword, getUserByEmail, sendEmailValidation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
