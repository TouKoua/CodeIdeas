import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "../types/index";

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
  ) => Promise<User | null>;
  signUpWithGithub: () => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data, error }) => {
              if (error) {
                console.error("Error fetching user profile:", error);
                setUserProfile(null);
              } else {
                setUserProfile(data);
              }
            });
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      },
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setLoading(false);
  };

  const signUp = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
  ) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
        },
      },
    });
    if (error) throw "Sign Up Error: " + error.message;
    setLoading(false);
    return data.user;
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setLoading(false);
  };

  const signUpWithGithub = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    setLoading(false);
  };

  const signUpWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        signUpWithGithub,
        signUpWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
