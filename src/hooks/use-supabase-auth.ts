import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export const useSupabaseAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshSession } = useAuth();

  const signIn = async (
    email: string,
    password: string,
    redirectTo?: string
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      await refreshSession();

      if (redirectTo) {
        router.push(redirectTo);
      }

      return { success: true, data };
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      return { success: true, data };
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (redirectTo: string = "/") => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
      await refreshSession();
      window.location.href = redirectTo;
      return { success: true };
    } catch (err: any) {
      setError(err.message || "An error occurred during sign out");
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        throw resetError;
      }

      return { success: true };
    } catch (err: any) {
      setError(
        err.message || "An error occurred while trying to reset your password"
      );
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    isLoading,
    error,
  };
};
