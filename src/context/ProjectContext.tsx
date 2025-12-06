import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../services/supabaseClient";

type ProjectContextType = {
  projectID: string;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
