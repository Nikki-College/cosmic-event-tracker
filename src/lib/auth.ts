import { supabase } from "@/lib/supabaseClient";

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Login error:", error.message);
  } else {
  }
};
