import { useState, useEffect } from "react";
import type { Idea, JoinRequest, Team, TeamMember } from "../types";
import supabase from "../services/supabaseClient";
import type { User } from "@supabase/supabase-js";

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
  const [project, setProject] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("ideas")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        setProject(data || null);
      } catch (err: any) {
        setError(err.message);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  return { project, loading, error };
}

//Get similar projects based on tech stack
export function useFetchSimilarProjects(
  projectId: string,
  technologies: string[] | undefined,
) {
  const [similarProjects, setSimilarProjects] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilterProjects = async () => {
      if (!projectId || !technologies || technologies.length === 0) return;

      try {
        const { data, error: fetchError } = await supabase
          .from("ideas")
          .select("*");

        if (fetchError) {
          setError(fetchError.message);
          setSimilarProjects([]);
        } else {
          const similar = data
            .filter(
              (p) =>
                p.id !== projectId &&
                p.technologies?.some((tech: string) =>
                  technologies.includes(tech),
                ),
            )
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          setSimilarProjects(similar);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
        setSimilarProjects([]);
      }
    };

    fetchAndFilterProjects();
  }, [projectId, JSON.stringify(technologies)]);

  return { similarProjects, error };
}

// Get user's ideas from Supabase
export async function fetchUserIdeas(user: User | null) {
  if (!user) return [];
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("creator_id", user.id);
  if (error) {
    console.error("Error fetching user's ideas:", error);
    return [];
  }
  return data;
}

export function useFetchTeamCount(team: Team) {
  const [teamCount, setTeamCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (team) {
      const fetchMemberCount = async () => {
        const { data, error } = await supabase
          .from("teams")
          .select("*, teams(id)")
          .eq("teams.id", team.id);
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
  }, [team?.id]);
  return { teamCount, error };
}

export function useFetchTeamJoinRequests(teamId: string) {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchJoinRequests = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("join_requests")
          .select("*, user_profiles(*)")
          .eq("team_id", teamId);

        if (fetchError) {
          setError(fetchError.message);
          setJoinRequests([]);
        } else {
          const pending = data.filter(
            (request) => request.status === "pending",
          );
          const enrichedPending = pending.map((request) => ({
            ...request,
            user: request.user_profiles,
          }));
          setJoinRequests(enrichedPending);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
        setJoinRequests([]);
      }
    };

    fetchJoinRequests();
  }, [teamId]);

  return { joinRequests, error };
}

export function useFetchUserPendingRequests(userID: string) {
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userID) return;

    const fetchPendingRequests = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("join_requests")
          .select("*, teams(*)")
          .eq("user_id", userID)
          .eq("status", "pending");

        if (fetchError) {
          setError(fetchError.message);
          setPendingRequests([]);
        } else {
          const enrichedPending = data.map((request) => ({
            ...request,
            team: request.teams,
          }));
          setPendingRequests(enrichedPending);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
        setPendingRequests([]);
      }
    };

    fetchPendingRequests();
  }, [userID]);

  return { pendingRequests, error };
}

export function useTeamByIdeaId(ideaId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ideaId) return;
    const fetchTeam = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("teams")
          .select("*")
          .eq("idea_id", ideaId);

        if (fetchError) {
          setError(fetchError.message);
          setTeam(null);
        } else {
          setTeam(data[0] || null);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
        setTeam(null);
      }
    };

    fetchTeam();
  }, [ideaId]);

  return { team, error };
}

export function useFetchUserTeams(userId: string) {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchTeam = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("team_members")
          .select("teams(*)")
          .eq("user_id", userId);

        if (fetchError) {
          setError(fetchError.message);
          setTeams(null);
        } else {
          const teamList = data.flatMap((member) => member.teams);
          setTeams(teamList);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
        setTeams(null);
      }
    };

    fetchTeam();
  }, [userId]);

  return { teams, error };
}

export function useFetchTeamMembers(teamId: string) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;
    const fetchTeamMembers = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("team_members")
          .select("*")
          .eq("team_id", teamId);
        if (fetchError) {
          setError(fetchError.message);
          setTeamMembers(null);
        } else {
          setTeamMembers(data);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
        setTeamMembers(null);
      }
    };

    fetchTeamMembers();
  }, [teamId]);

  return { teamMembers, error };
}
