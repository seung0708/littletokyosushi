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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          base_price: number | null
          category_name: string | null
          created_at: string | null
          description: string
          id: string
          image_urls: string[] | null
          is_available: boolean | null
          name: string
          order_index: number | null
          sub_group: Database["public"]["Enums"]["sub_group"]
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          category_name?: string | null
          created_at?: string | null
          description: string
          id?: string
          image_urls?: string[] | null
          is_available?: boolean | null
          name: string
          order_index?: number | null
          sub_group?: Database["public"]["Enums"]["sub_group"]
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          category_name?: string | null
          created_at?: string | null
          description?: string
          id?: string
          image_urls?: string[] | null
          is_available?: boolean | null
          name?: string
          order_index?: number | null
          sub_group?: Database["public"]["Enums"]["sub_group"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_name_fkey"
            columns: ["category_name"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["name"]
          },
        ]
      }
      modifier_groups: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          max_sel: number
          menu_item_id: string
          min_sel: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          max_sel: number
          menu_item_id: string
          min_sel: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          max_sel?: number
          menu_item_id?: string
          min_sel?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modifier_groups_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      modifier_options: {
        Row: {
          created_at: string | null
          id: string
          modifier_group_id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          modifier_group_id: string
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          modifier_group_id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modifier_options_modifier_group_id_fkey"
            columns: ["modifier_group_id"]
            isOneToOne: false
            referencedRelation: "modifier_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_modifiers: {
        Row: {
          created_at: string | null
          id: string
          modifier_option_id: string
          order_item_id: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          modifier_option_id: string
          order_item_id: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          modifier_option_id?: string
          order_item_id?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_modifiers_modifier_option_id_fkey"
            columns: ["modifier_option_id"]
            isOneToOne: false
            referencedRelation: "modifier_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_modifiers_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          order_id: string
          price: number
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          order_id: string
          price: number
          quantity: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          order_id?: string
          price?: number
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          order_type: Database["public"]["Enums"]["order_type"]
          phone: string
          pickup_at: string | null
          state: string | null
          status: Database["public"]["Enums"]["status"]
          sub_total: number
          total: number
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          order_type?: Database["public"]["Enums"]["order_type"]
          phone: string
          pickup_at?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["status"]
          sub_total?: number
          total?: number
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          phone?: string
          pickup_at?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["status"]
          sub_total?: number
          total?: number
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          auth_id: string
          city: string | null
          created_at: string | null
          full_name: string
          id: string
          phone_number: string | null
          role: Database["public"]["Enums"]["roles"] | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          auth_id: string
          city?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["roles"] | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          auth_id?: string
          city?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["roles"] | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_type: "pickup" | "delivery"
      roles: "admin" | "staff" | "customer"
      status: "pending" | "scheduled" | "confirmed" | "cancelled" | "ready"
      sub_group: "Standard" | "Special"
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
      order_type: ["pickup", "delivery"],
      roles: ["admin", "staff", "customer"],
      status: ["pending", "scheduled", "confirmed", "cancelled", "ready"],
      sub_group: ["Standard", "Special"],
    },
  },
} as const
