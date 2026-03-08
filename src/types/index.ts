export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
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
  languages?: string[];
  technologies?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
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
  team_size?: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'creator' | 'member';
  joined_at: string;
}

export interface JoinRequest {
  id: string;
  team: Team;
  user: UserProfile;
  status: 'pending' | 'approved' | 'rejected';
  request_message?: string;
  requested_at: string;
  responded_at?: string;
}