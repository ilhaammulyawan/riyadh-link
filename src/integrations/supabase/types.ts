export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      link_clicks: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string
          country: string | null
          device: string | null
          id: string
          ip: string | null
          link_id: string
          os: string | null
          referrer: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          country?: string | null
          device?: string | null
          id?: string
          ip?: string | null
          link_id: string
          os?: string | null
          referrer?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          country?: string | null
          device?: string | null
          id?: string
          ip?: string | null
          link_id?: string
          os?: string | null
          referrer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          category: string | null
          click_count: number
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          open_in_new_tab: boolean
          original_url: string
          password: string | null
          slug: string
          tags: string[]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          click_count?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          open_in_new_tab?: boolean
          original_url: string
          password?: string | null
          slug: string
          tags?: string[]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          click_count?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          open_in_new_tab?: boolean
          original_url?: string
          password?: string | null
          slug?: string
          tags?: string[]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_address: string | null
          contact_email: string | null
          copyright_text: string | null
          credit_link_label: string | null
          credit_link_url: string | null
          credit_prefix: string | null
          credit_suffix: string | null
          favicon_url: string | null
          footer_description: string | null
          hero_cta: string
          hero_headline: string
          hero_subheadline: string
          id: number
          logo_url: string | null
          meta_description: string | null
          site_name: string
          social_facebook: string | null
          social_instagram: string | null
          social_youtube: string | null
          tagline: string
          updated_at: string
        }
        Insert: {
          contact_address?: string | null
          contact_email?: string | null
          copyright_text?: string | null
          credit_link_label?: string | null
          credit_link_url?: string | null
          credit_prefix?: string | null
          credit_suffix?: string | null
          favicon_url?: string | null
          footer_description?: string | null
          hero_cta?: string
          hero_headline?: string
          hero_subheadline?: string
          id?: number
          logo_url?: string | null
          meta_description?: string | null
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_youtube?: string | null
          tagline?: string
          updated_at?: string
        }
        Update: {
          contact_address?: string | null
          contact_email?: string | null
          copyright_text?: string | null
          credit_link_label?: string | null
          credit_link_url?: string | null
          credit_prefix?: string | null
          credit_suffix?: string | null
          favicon_url?: string | null
          footer_description?: string | null
          hero_cta?: string
          hero_headline?: string
          hero_subheadline?: string
          id?: number
          logo_url?: string | null
          meta_description?: string | null
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_youtube?: string | null
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_stats: {
        Args: never
        Returns: {
          active_links: number
          total_clicks: number
          total_links: number
          total_users: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
