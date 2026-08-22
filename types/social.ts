// types/social.ts

export interface User {
  id: string;
  display_name: string;
  handle: string;
  profilePictureUrl: string;
  role: 'Admin' | 'Manager' | 'Employee' | 'Founder' | 'Investor' | 'CEO';
  businessId?: string;
  bio: string;
  profile: {
      interests: string[];
      skills: string[];
  };
  wallet: {
      balance: number;
      currency: string;
  };
  businesses: string[];
  memberships: string[];
  followers: string[];
  following: string[];
  state: {
      mood: 'happy' | 'neutral' | 'stressed' | 'excited' | 'bored';
      activity: string;
      last_active_tick: number;
  };
  netWorth: number;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'shop' | 'service' | 'platform' | 'content_creator' | 'nft_project';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'inactive' | 'bankrupt';
  marketing_factor: number;
  businessPlan: string;
  valuation: number;
  cashBalance: number;
  hqLocation: string;
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    userProfilePic: string;
    text: string;
    timestamp: string;
}

export interface PostContent {
    text?: string;
    imageUrl?: string;
    fileUrl?: string;
    poll?: {
        question: string;
        options: { text: string, votes: number }[];
    }
}

export interface Post {
    id: string;
    author_id: string;
    userName: string;
    userProfilePic: string;
    created_tick: number;
    content: PostContent;
    type: 'text' | 'image' | 'video' | 'link' | 'poll';
    tags: string[];
    metrics: {
        likes: number;
        comments: number;
        shares: number;
        reach: number;
    };
    visibility: 'public' | 'followers_only' | 'private';
    likedByUser?: boolean;
    comments: Comment[];
    nftId?: string;
}

export interface CommunityFund {
  id: string;
  balance: number;
  rules: {
    donation_percent_from_revenue: number;
    grant_allocation_policy: string;
    min_grant_amount: number;
  };
  history: {
      tick: number;
      source: 'tax' | 'donation' | 'penalty';
      amount: number;
      note: string;
  }[];
}