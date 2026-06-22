export type Role = "user" | "artist" | "admin";

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  subscriptionTier: "free" | "pro" | "premium";
  purchasesUsed?: number;
  photo?: string;
}

export interface Artwork {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  artistId: string | { _id: string };
  artistName: string;
  sold: boolean;
  createdAt: string;
}

export interface Comment {
  _id: string;
  artworkId: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  type: "purchase" | "subscription";
  userId: string;
  artistId?: string;
  artworkId?: string;
  artworkTitle?: string;
  tier?: string;
  amount: number;
  createdAt: string;
}

export interface BrowseResult {
  items: Artwork[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalArtists: number;
  totalArtworksSold: number;
  totalRevenue: number;
  categoryBreakdown: { _id: string; count: number }[];
}
