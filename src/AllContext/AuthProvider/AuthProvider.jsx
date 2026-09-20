import React, { useEffect, useState } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import { authClient, signIn as betterSignIn, signUp as betterSignUp, signOut as betterSignOut } from "../../lib/auth-client";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionRes = await authClient.getSession();
        if (sessionRes?.data?.user) {
          const sessionUser = {
            ...sessionRes.data.user,
            email: sessionRes.data.user.email,
            displayName: sessionRes.data.user.name || sessionRes.data.user.email?.split("@")[0],
            photoURL: sessionRes.data.user.image || "",
            role: sessionRes.data.user.role || "user",
            accessToken: sessionRes.data.session?.token || "",
          };
          setUser(sessionUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn("Session check warning:", err?.message || err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const createUser = async (email, password, displayName = "", photoURL = "") => {
    setLoading(true);
    try {
      const res = await betterSignUp.email({
        email,
        password,
        name: displayName || email.split("@")[0],
        image: photoURL,
      });

      const newUser = {
        email,
        displayName: displayName || email.split("@")[0],
        photoURL,
        role: res?.data?.user?.role || "user",
        accessToken: res?.data?.token || "",
      };

      setUser(newUser);
      setLoading(false);
      return { user: newUser };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await betterSignIn.email({
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res.error.message || "Invalid credentials");
      }

      const loggedUser = {
        email,
        displayName: res?.data?.user?.name || email.split("@")[0],
        photoURL: res?.data?.user?.image || "",
        role: res?.data?.user?.role || "user",
        accessToken: res?.data?.token || "",
      };

      setUser(loggedUser);
      setLoading(false);
      return { user: loggedUser };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await betterSignOut();
    } catch (err) {
      console.error("SignOut error:", err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
        errorCallbackURL: `${window.location.origin}/login`,
      });
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const authInfo = {
    createUser,
    user,
    setUser,
    loading,
    signIn,
    logOut,
    signInWithGoogle,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
