import { useState, useEffect, useRef } from "react";
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

//Get similar projects based on tech stack
export function useFetchSimilarProjects(project: Idea) {
  const projectList = useRef<Idea[]>([]);
  const [similarProjects, setSimilarProjects] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("ideas").select("*");
      if (error) {
        setError(error.message);
        projectList.current = [];
      } else {
        projectList.current = data;
        setError(null);
      }
    };
    fetchProjects();

    console.log("Project List:", projectList.current);

    const similar = projectList.current
      .filter(
        (p) =>
          p.id !== project.id &&
          p.technologies?.some((stack) => project.technologies?.includes(stack))
      )
      .sort(() => 0.5 - Math.random());

    setSimilarProjects(similar);
  }, [project?.id]);
  return { similarProjects, error };
}

export function useFetchTeamCount(project: Idea) {
  const [teamCount, setTeamCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      const fetchMemberCount = async () => {
        const { data, error } = await supabase
          .from("team_members")
          .select("*, teams(id)")
          .eq("teams.id", project.id);
        if (error) {
          setError(error.message);
          setTeamCount(0);
        } else {
          setTeamCount(data.length);
          setError(null);
        }
      };
      fetchMemberCount();
    }
  }, [project?.id]);
  return { teamCount, error };
}
