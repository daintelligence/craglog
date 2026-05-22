import type { Metadata } from 'next';
import { PublicProfileClient } from './client';

interface Props {
  params: Promise<{ username: string }>;
}

const API_BASE =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchProfile(username: string) {
  try {
    const res = await fetch(`${API_BASE}/api/users/profile/${username}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchProfile(username);
  if (!profile) return { title: 'Profile not found — CragLog' };

  const desc = profile.bio
    ? `${profile.bio} · ${profile.totalAscents} ascents on CragLog`
    : `${profile.totalAscents} ascents · ${profile.uniqueCrags} crags · CragLog`;

  return {
    title: `${profile.name} (@${username}) — CragLog`,
    description: desc,
    openGraph: {
      title: `${profile.name} on CragLog`,
      description: desc,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
    twitter: { card: 'summary' },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await fetchProfile(username);
  return <PublicProfileClient username={username} initialProfile={profile} />;
}
