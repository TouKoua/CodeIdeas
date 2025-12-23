export interface ProjectIdeas{
  id: string;
  title:string;
  difficulty: string;
  status: string;
  description: string;
};

export interface UserProfile {
  id: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  skills?: string[];
}

export interface Idea {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'completed';
  tech_stack?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  team_size?: number;
  github_link?: string;
  duration?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  idea_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'creator' | 'member';
  joined_at: string;
}