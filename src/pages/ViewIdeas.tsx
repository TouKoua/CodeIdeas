import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../services/supabaseClient.ts";
import "./ViewIdeas.css";

function ViewIdeas() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase.from("ideas").select("*");
        if (error) {
          throw error;
        }
        setIdeas(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);
}
