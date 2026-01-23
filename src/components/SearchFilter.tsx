import React, { useState } from "react";

interface SearchFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const difficultyOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const popularLanguages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
];

const popularSkills = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Django",
  "Flask",
  "Spring Boot",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "AWS",
  "Docker",
  "Machine Learning",
  "React Native",
  "Flutter",
  "GraphQL",
  "REST API",
  "DevOps",
  "Testing",
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ onApplyFilters }) => {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    []
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulties.includes(difficulty)) {
      setSelectedDifficulties(
        selectedDifficulties.filter((d) => d !== difficulty)
      );
    } else {
      setSelectedDifficulties([...selectedDifficulties, difficulty]);
    }
  };

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const applyFilters = () => {
    onApplyFilters({
      difficulty: selectedDifficulties,
      programmingLanguages: selectedLanguages,
      programmingSkills: selectedSkills,
    });
  };

  const clearFilters = () => {
    setSelectedDifficulties([]);
    setSelectedLanguages([]);
    setSelectedSkills([]);
    onApplyFilters({
      difficulty: [],
      programmingLanguages: [],
      programmingSkills: [],
    });
  };

  const hasActiveFilters =
    selectedDifficulties.length > 0 ||
    selectedLanguages.length > 0 ||
    selectedSkills.length > 0;

  return (
    <div className="filter-section">
      <div className="filter-section-buttons">
        <h3 className="filter-section-title">Filters</h3>
      </div>

      <div className="filter-padding">
        <div className="filter-margin">
          <h4 className="filter-text">Difficulty Level</h4>
          <div className="filter-gap">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleDifficulty(option.value)}
                className={`filter-options ${
                  selectedDifficulties.includes(option.value)
                    ? "filter-choice-active"
                    : "filter-choice-inactive"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-margin">
          <h4 className="filter-text">Programming Languages</h4>
          <div className="filter-gap">
            {popularLanguages.map((language) => (
              <button
                key={language}
                onClick={() => toggleLanguage(language)}
                className={`filter-options ${
                  selectedLanguages.includes(language)
                    ? "filter-choice-active"
                    : "filter-choice-inactive"
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-margin">
          <h4 className="filter-text">Programming Skills</h4>
          <div className="filter-gap">
            {popularSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`filter-options ${
                  selectedSkills.includes(skill)
                    ? "filter-choice-active"
                    : "filter-choice-inactive"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <button onClick={applyFilters}>Apply Filters</button>
        <div className="filter-clear-toggle">
          {hasActiveFilters && (
            <button onClick={clearFilters}>Clear All</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
