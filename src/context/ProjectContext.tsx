import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import type { ReactNode } from "react";
import type { ProjectIdeas } from "../types";

//Project Context type data
type ProjectContextType = {
  projects: ProjectIdeas[];
  loading: boolean;
};

//Create null context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

//Export function for using project context
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};

//Project Provider component
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<ProjectIdeas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //Fetch projects from Supabase
  const FetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        throw error;
      }
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchProjects();
  }, []);

  const value = React.useMemo(
    () => ({ projects, loading }),
    [projects, loading]
  );
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
