import { useState, useEffect } from "react";
import type { Idea } from "../types";
import supabase from "../services/supabaseClient";

// Get project list from Supabase
export default function useFetchProjectList() {
  const [projects, setProjects] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("ideas").select("*");
      if (error) {
        setError(error.message);
        setProjects([]);
      } else {
        setProjects(data);
        setError(null);
      }
    };
    fetchProjects();
  }, []);
  return { projects, error };
}

//Get a single project matching the id from Supabase
export function useFetchSingleProject(id: string) {
  const [project, setProject] = useState<Idea>({} as Idea);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        setError(error.message);
        setProject({} as Idea);
      } else {
        setProject(data);
        setError(null);
      }
    };
    fetchProjects();
  }, [id]);
  return { project, error };
}

export function useFetchSimilarProjects(project: Idea) {
  const [projectList, setProjectList] = useState<Idea[]>([]);
  const [similarProjects, setSimilarProjects] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      const fetchProjects = async () => {
        const { data, error } = await supabase.from("ideas").select("*");
        if (error) {
          setError(error.message);
          setProjectList([]);
        } else {
          setProjectList(data);
          setError(null);
        }
      };
      fetchProjects();

      const similar = projectList
        ?.filter(
          (p) =>
            p.id !== project.id &&
            p.tech_stack?.some((stack) => project.tech_stack?.includes(stack))
        )
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 3);

      setSimilarProjects(similar);
    }
  }, [project?.id]);
  return { similarProjects, error };
}
