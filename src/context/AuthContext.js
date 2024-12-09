"use client";
import { useContext, createContext, useState, useEffect, use } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { fetchGraphQLData } from "../lib/graphqlClient";

const QUERY_GET_USER_BY_UID = `
  query Query($uid: String!) {
  userByUID(uid: $uid) {
    status
    message
    data {
      id
      userRole
    }
  }
}
`;

// Create AuthContext
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState(null);
  const [dbUser, setDBUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [redirectURL, setRedirectURL] = useState(null);

  const setDatabaseUser = async () => {
    try {
      const user = auth.currentUser;
      if (user && !dbUser) {
        const response = await getUserByUID(user.uid);
        if (response.success) {
          setDBUser(response.data);
        }
      }
    } catch (error) {
      console.error("Error setting database ID:", error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        await setDatabaseUser();
        setAuthLoading(false);
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const setCustomClaims = async () => {
      // Wait until db_id and role are available in the claims
      if (claims && claims.db_id && claims.role) {
        return; // Exit early if claims already have db_id and role
      }
      // Otherwise, fetch claims
      await fetchClaims();
      // Add a delay to avoid rapid requests (e.g., 1-2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    if (user && !claims) {
      // Ensure it's only called when user is present and claims aren't already set
      setCustomClaims();
    }
  }, [user, claims]);

  const fetchClaims = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Force refresh the ID token to get updated claims
        const idToken = await user.getIdToken(true);

        // Decode the ID token to access custom claims
        const decodedToken = await user.getIdTokenResult();
        console.log("Custom Claims:", decodedToken.claims);

        // Update claims state
        setClaims(decodedToken.claims);
      } else {
        console.error("No authenticated user.");
      }
    } catch (error) {
      console.error("Error fetching custom claims:", error);
    }
  };

  const getCustomClaims = async () => {
    try {
      const user = auth.currentUser;
      const decodedToken = await user.getIdTokenResult();
      return decodedToken.claims;
    } catch (error) {
      console.error("Error fetching custom claims:", error);
      return null;
    }
  };

  const setFirebaseUser = async (user) => {
    try {
      setUser(user);
    } catch (error) {
      console.error("Error setting Firebase user:", error);
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await createUser(user); // Ensure user is in the database
      // Set Firebase user state
      await setFirebaseUser(user);

      return { success: true, message: "Google sign-in successful!" };
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      return {
        success: false,
        message: `Google sign-in failed: ${error.message}`,
      };
    }
  };

  const emailandPasswordSignUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

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
      console.error("Error during sign-up:", error);
      const errorCode = error.code;

      return { success: false, errorCode: errorCode };
    }
  };

  const emailandPasswordSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Set the user state
      setUser(user);

      return { success: true, errorCode: null, message: "Sign-in successful!" };
    } catch (error) {
      console.error("Error during sign-in:", error);
      return {
        success: false,
        errorCode: error.code,
        message: `Sign-in failed: ${error.message}`,
      };
    }
  };

  const updateUserProfile = async (user, fullname, email, phoneNumber) => {
    try {
      // Update display name
      await updateProfile(user, { displayName: fullname });
      console.log("Profile updated successfully");

      // Check if email is different

      // Update user details in the database
      await updateUser({
        uid: user.uid,
        displayName: fullname,
        phoneNumber: phoneNumber,
      });

      return { success: true, message: "User profile updated successfully!" };
    } catch (error) {
      console.error("Error during profile update:", error);
      return {
        success: false,
        message: `Profile update failed: ${error.message}`,
      };
    }
  };

  // Update the user's data in the database
  const updateUser = async (user) => {
    const query = `
      mutation UpdateUser($uid: String!, $userData: UpdateUserInput!) {
        updateUser(uid: $uid, userData: $userData) {
          data {
            email
            displayName
            firebaseUID
            emailVerified
            phoneNumber
            
          }
          message
        }
      }
    `;

    const userData = {};
    if (user.displayName) {
      userData.displayName = user.displayName;
    }
    if (user.phoneNumber) {
      userData.phoneNumber = user.phoneNumber;
    }
    if (user.email) {
      userData.email = user.email;
    }
    if (user.emailVerified) {
      userData.emailVerified = user.emailVerified;
    }

    const variables = {
      uid: user.uid, // Use the correct UID for the user
      userData: userData,
    };

    try {
      const response = await fetchGraphQLData(query, variables);
      console.log("GraphQL response [updateUser]:", response);
      if (response.updateUser.data) {
        return {
          success: true,
          message: "User updated in the database successfully!",
        };
      }
      return { success: false, message: response.updateUser.message };
    } catch (error) {
      console.error("GraphQL Error:", error);
      return {
        success: false,
        message: `Failed to update user in database: ${error.message}`,
      };
    }
  };

  // Create a new user in the database
  const createUser = async (user) => {
    console.log("Create user: ", user);
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
            userRole
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
        displayName: user.displayName || "",
        firebaseUID: user.uid,
        photoURL: user.photoURL || "",
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || "",
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
        // Set db_id and role in claims
        setClaims({
          db_id: response.createUser.data.id,
          role: response.createUser.data.userRole,
        });

        return {
          success: true,
          message: "User created in the database successfully!",
        };
      } else {
        return { success: false, message: "Failed to create user in database" };
      }
    } catch (error) {
      console.error("GraphQL Error:", error);
      return {
        success: false,
        message: `Failed to create user in database: ${error.message}`,
      };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Password reset email sent!" };
    } catch (error) {
      console.error("Error during password reset:", error);
      return {
        success: false,
        message: `Password reset failed: ${error.message}`,
      };
    }
  };

  // Validate Password
  const validateUserPassword = async (oldpassword) => {
    try {
      const email = auth.currentUser.email;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        oldpassword
      );
      const user = userCredential.user;
      if (user) {
        return { success: true, message: "Password validation successful!" };
      }
      return {
        success: false,
        errorCode: null,
        message: "Password validation failed!",
      };
    } catch (error) {
      console.error("Error during valiadting password:", error);
      return {
        success: false,
        errorCode: error.code,
        message: `Password validation failed!: ${error.message}`,
      };
    }
  };

  // Set new password
  const setUserPassword = async (password) => {
    try {
      const user = auth.currentUser;
      await updatePassword(user, password);
      return { success: true, message: "Password updated successfully!" };
    } catch (error) {
      console.error("Error during password update:", error);
      return {
        success: false,
        message: `Password update failed: ${error.message}`,
      };
    }
  };

  const sendEmailValidation = async (user) => {
    console.log("Send email validation: ", user);

    const actionCodeSettings = {
      url: `http://localhost:3000/user/login`, // Redirect URL after email verification
      handleCodeInApp: true, // Set to true if you want to handle the verification in-app
    };

    try {
      await sendEmailVerification(user, actionCodeSettings);
      return { success: true, message: "Email validation sent!" };
    } catch (error) {
      console.error("Error during email validation:", error);
      return {
        success: false,
        message: `Email validation failed: ${error.message}`,
      };
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
      console.log("GraphQL response [userByEmail]:", response);
      if (response.userByEmail.data) {
        return {
          success: true,
          data: response.userByEmail.data,
          message: response.userByEmail.message,
        };
      }
      return {
        success: false,
        data: null,
        message: response.userByEmail.message,
      };
    } catch (error) {
      console.error("GraphQL Error:", error);
      return {
        success: false,
        data: null,
        message: `Failed to fetch user: ${error.message}`,
      };
    }
  };

  // Get user by Firebase UID
  const getUserByUID = async (uid) => {
    try {
      const response = await fetchGraphQLData(QUERY_GET_USER_BY_UID, { uid });
      console.log("GraphQL response [userByUID]:", response);
      if (response.userByUID.data) {
        return {
          success: true,
          data: response.userByUID.data,
          message: response.userByUID.message,
        };
      }
      return {
        success: false,
        data: null,
        message: response.userByUID.message,
      };
    } catch (error) {
      console.error("GraphQL Error:", error);
      return {
        success: false,
        data: null,
        message: `Failed to fetch user: ${error.message}`,
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful.");
      setUser(null); // Clear user state on logout
      setDBUser(null); // Clear db_user from state
      setClaims(null); // Clear claims from state
      setRedirectURL(null); // Clear redirectURL from state

      // Clear db_user from localStorage
      localStorage.removeItem("db_user");

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
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        dbUser,
        claims,
        fetchClaims,
        getCustomClaims,
        googleSignIn,
        emailandPasswordSignUp,
        emailandPasswordSignIn,
        logout,
        resetPassword,
        getUserByEmail,
        sendEmailValidation,
        updateUserProfile,
        validateUserPassword,
        setUserPassword,
        redirectURL,
        setRedirectURL,
        getUserByUID,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
