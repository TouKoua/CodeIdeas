// Tags/Pills helper functions (generic, reusable)
export const addTag = (
  input: string,
  tags: string[],
  setTags: (tags: string[]) => void,
  setInput: (input: string) => void
) => {
  const trimmedInput = input.trim();
  if (trimmedInput && !tags.includes(trimmedInput)) {
    setTags([...tags, trimmedInput]);
    setInput("");
  }
};

export const removeTag = (
  tag: string,
  tags: string[],
  setTags: (tags: string[]) => void
) => {
  setTags(tags.filter((t) => t !== tag));
};

export const handleTagKeyPress = (
  e: React.KeyboardEvent,
  input: string,
  tags: string[],
  setTags: (tags: string[]) => void,
  setInput: (input: string) => void
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag(input, tags, setTags, setInput);
  }
};