export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: number
          created_at?: string
          name: string
          description?: string
          price: number
          category_id: string
          image_urls?: string[]
          is_available: boolean
          modifiers?: Json[]
          categories?: {
            id: string
            name: string
          }
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string
          price: number
          category_id: string
          image_url?: string
          is_available?: boolean
          modifiers?: Json[]
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          price?: number
          category_id?: string
          image_url?: string
          is_available?: boolean
          modifiers?: Json[]
        }
      }
      orders: {
        Row: {
          id: string
          created_at?: string
          customer_id: string
          status: string
          total: number
          payment_intent?: string
          prep_time?: number
          completed_at?: string
          archived?: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          status?: string
          total: number
          payment_intent?: string
          prep_time?: number
          completed_at?: string
          archived?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          status?: string
          total?: number
          payment_intent?: string
          prep_time?: number
          completed_at?: string
          archived?: boolean
        }
      }
      order_items: {
        Row: {
          id: string
          created_at?: string
          order_id: string
          menu_item_id: string
          quantity: number
          base_price: number
          total_price: number
          notes?: string
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          menu_item_id: string
          quantity: number
          base_price: number
          total_price: number
          notes?: string
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          base_price?: number
          total_price?: number
          notes?: string
        }
      }
      order_item_modifiers: {
        Row: {
          id: string
          created_at?: string
          order_item_id: string
          modifier_id: string
          name: string
        }
        Insert: {
          id?: string
          created_at?: string
          order_item_id: string
          modifier_id: string
          name: string
        }
        Update: {
          id?: string
          created_at?: string
          order_item_id?: string
          modifier_id?: string
          name?: string
        }
      }
      order_item_modifier_options: {
        Row: {
          id: string
          created_at?: string
          order_item_modifier_id: string
          option_id: string
          name: string
          price: number
        }
        Insert: {
          id?: string
          created_at?: string
          order_item_modifier_id: string
          option_id: string
          name: string
          price: number
        }
        Update: {
          id?: string
          created_at?: string
          order_item_modifier_id?: string
          option_id?: string
          name?: string
          price?: number
        }
      }
      customers: {
        Row: {
          id: string
          created_at?: string
          email?: string
          phone?: string
          first_name?: string
          last_name?: string
        }
        Insert: {
          id?: string
          created_at?: string
          email?: string
          phone?: string
          first_name?: string
          last_name?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          phone?: string
          first_name?: string
          last_name?: string
        }
      }
      carts: {
        Row: {
          id: string
          created_at?: string
          customer_id?: string
          expires_at?: string
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id?: string
          expires_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          expires_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          created_at?: string
          cart_id: string
          menu_item_id: string
          quantity: number
          notes?: string
        }
        Insert: {
          id?: string
          created_at?: string
          cart_id: string
          menu_item_id: string
          quantity: number
          notes?: string
        }
        Update: {
          id?: string
          created_at?: string
          cart_id?: string
          menu_item_id?: string
          quantity?: number
          notes?: string
        }
      }
      cart_item_modifiers: {
        Row: {
          id: string
          created_at?: string
          cart_item_id: string
          modifier_id: string
          name: string
        }
        Insert: {
          id?: string
          created_at?: string
          cart_item_id: string
          modifier_id: string
          name: string
        }
        Update: {
          id?: string
          created_at?: string
          cart_item_id?: string
          modifier_id?: string
          name?: string
        }
      }
      cart_item_modifier_options: {
        Row: {
          id: string
          created_at?: string
          cart_item_modifier_id: string
          option_id: string
          name: string
          price: number
        }
        Insert: {
          id?: string
          created_at?: string
          cart_item_modifier_id: string
          option_id: string
          name: string
          price: number
        }
        Update: {
          id?: string
          created_at?: string
          cart_item_modifier_id?: string
          option_id?: string
          name?: string
          price?: number
        }
      }
      order_refunds: {
        Row: {
          id: string
          created_at?: string
          order_id: string
          amount: number
          reason?: string
          status: string
          payment_intent?: string
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          amount: number
          reason?: string
          status?: string
          payment_intent?: string
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          amount?: number
          reason?: string
          status?: string
          payment_intent?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
