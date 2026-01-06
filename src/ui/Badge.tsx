export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "success";
    case "intermediate":
      return "warning";
    case "advance":
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
