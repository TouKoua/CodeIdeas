import type { Idea } from "../types";

export const getDifficultyColor = (difficulty: Idea["difficulty"]) => {
  switch (difficulty) {
    case "beginner":
      return "success";
    case "intermediate":
      return "warning";
    case "advanced":
      return "danger";
    default:
      return "default";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "recruiting":
      return "primary";
    case "working":
      return "warning";
    case "completed":
      return "success";
    default:
      return "default";
  }
};
