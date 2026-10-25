export type SocialLink = { label: string; url: string };

export type Profile = {
  name: string;
  role: string;
  headline: string;
  bio: string;
  email: string;
  photo_url: string | null;
  social_links: SocialLink[];
};

export type Project = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string | null;
  image_url: string | null;
  position: number;
  visible: boolean;
};

export type Skill = { id: number; group_name: string; name: string; position: number };

export type SkillGroup = { group: string; skills: string[] };

export type ActionState = { ok: boolean; message: string } | null;
