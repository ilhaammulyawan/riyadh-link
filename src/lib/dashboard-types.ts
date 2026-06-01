export type LinkRow = {
  id: string;
  user_id: string;
  slug: string;
  original_url: string;
  title: string | null;
  password: string | null;
  is_active: boolean;
  open_in_new_tab: boolean;
  expires_at: string | null;
  category: string | null;
  tags: string[];
  click_count: number;
  created_at: string;
  updated_at: string;
};
