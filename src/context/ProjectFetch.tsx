import supabase from "../services/supabaseClient";

export const fetchAllProjects = async () => {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data;
};
