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
      business_hours: {
        Row: {
          id?: string
          day?: string
          is_open?: boolean
          ordering_start?: string
          ordering_end?: string
          pickup_start?: string | null
          pickup_end?: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          day?: string
          is_open?: boolean
          ordering_start?: string
          ordering_end?: string
          pickup_start?: string | null
          pickup_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          day?: string
          is_open?: boolean
          ordering_start?: string
          ordering_end?: string
          pickup_start?: string | null
          pickup_end?: string | null
          created_at?: string
        }
        Delete: {
          id?: string
        }
      }
      special_schedules: {
        Row: {
          id?: string 
          date?: string
          schedule_type?: string
          is_open?: boolean
          ordering_start?: string
          ordering_end?: string
          pickup_start?: string | null
          pickup_end?: string | null
          note?: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          date?: string
          schedule_type?: string
          is_open?: boolean
          ordering_start?: string
          ordering_end?: string
          pickup_start?: string | null
          pickup_end?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          schedule_type?: string
          is_open?: boolean
          ordering_start?: string
          ordering_end?: string
          pickup_start?: string | null
          pickup_end?: string | null
          note?: string | null
          created_at?: string
        }
        Delete: {
          id?: string
        }
      }
      employees: {
        Row: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string 
          manager_id?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          manager_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          manager_id?: string
          created_at?: string
          updated_at?: string
        }
        Delete: {
          id?: string
        }
      }
      roles: {
        Row: {
          id?: number
          name?: string
        }
        Insert: {
          id?: number
          name?: string
        }
        Update: {
          id?: number
          name?: string
        }
        Delete: {
          id?: number
        }
      }
      employee_roles: {
        Row: {
          employee_id?: string
          role_id: number
        }
        Insert: {
          employee_id?: string
          role_id: number
        }
        Update: {
          employee_id?: string
          role_id: number
        }
        Delete: {
          employee_id?: string
          role_id: number
        }
      }
      customers: {
        Row: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          birth_date?: string
          line1?: string
          line2?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          birth_date?: string
          line1?: string
          line2?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          birth_date?: string
          line1?: string
          line2?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id?: number
          name: string
          description?: string
          category_id: number
          price: number
          is_available: boolean
          created_at?: string
          updated_at?: string
          image_urls?: string[]
        }
        Insert: {
          id?: number
          name: string
          description?: string
          price: number
          category_id: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price?: number
          category_id?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string
        }
        Delete: {
          id?: number
        }
      }
      modifiers: {
        Row: {
          id?: number
          menu_item_id: number
          name: string
          is_required?: boolean
          min_selections?: number
          max_selections?: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          menu_item_id: number
          name: string
          is_required?: boolean
          min_selections?: number
          max_selections?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          menu_item_id?: number
          name?: string
          is_required?: boolean
          min_selections?: number
          max_selections?: number
          created_at?: string
          updated_at?: string
        }
        Delete: {
          id?: number
        }
      }
      modifier_options: {
        Row: {
          id?: number
          modifier_id: number
          name: string
          price: number
          created_at?: string
        }
        Insert: {
          id?: number
          modifier_id: number
          name: string
          price: number
          created_at?: string
        }
        Update: {
          id?: number
          modifier_id?: number
          name?: string
          price?: number
          created_at?: string
        }
        Delete: {
          id?: number
        }
      }
      carts: {
        Row: {
          id?: string
          customer_id?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          customer_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id?: string
          cart_id: string
          menu_item_id: string
          quantity: number
          base_price: number
          total_price: number
          special_instructions?: string
        }
        Insert: {
          id?: string
          cart_id: string
          menu_item_id: string
          quantity: number
          base_price: number
          total_price: number
          special_instructions?: string
        }
        Update: {
          id?: string
          cart_id: string
          menu_item_id: string
          quantity: number
          base_price: number
          total_price: number
          special_instructions?: string
        }
      }
      cart_item_modifiers: {
        Row: {
          id?: string
          cart_items_id: string
          modifier_id: string
          created_at?: string
        }
        Insert: {
          id?: string
          cart_item_id: string
          modifier_id: string
          created_at?: string
        }
        Update: {
          id?: string
          cart_item_id?: string
          modifier_id?: string
          created_at?: string
        }
      }
      cart_item_modifier_options: {
        Row: {
          id?: string
          cart_item_modifier_id: string
          modifier_id: number
          modifier_option_id: number
          modifier_option_price: number
          created_at?: string
        }
        Insert: {
          id?: string
          cart_item_modifier_id: string
          modifier_id: number
          modifier_option_id: number
          modifier_option_price: number
          created_at?: string
        }
        Update: {
          id?: string
          cart_item_modifier_id: string
          modifier_id: number
          modifier_option_id: number
          modifier_option_price: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id?: string
          short_id?: string
          customer_id: string
          status: string
          order_type: string
          delivery_service?: string
          delivery_date?: string
          delivery_time?: string
          pickup_date: string
          pickup_time: string
          prep_time_minutes?: number
          prep_time_confirmed_at?: string
          staff_notes?: string
          total: number
          sub_total: number
          service_fee: number
          created_at?: string
          ready_at?: string
          completed_at?: string
          archived?: boolean
        }
        Insert: {
          id?: string
          short_id?: string
          customer_id: string
          status: string
          order_type: string
          delivery_service?: string
          pickup_date: string
          pickup_time: string
          prep_time_minutes?: number
          prep_time_confirmed_at?: string
          staff_notes?: string
          total: number
          sub_total: number
          service_fee: number
          created_at?: string
          ready_at?: string
          completed_at?: string
          archived?: boolean
        }
        Update: {
          id?: string
          short_id?: string
          customer_id: string
          status: string
          order_type: string
          delivery_service?: string
          pickup_date: string
          pickup_time: string
          prep_time_minutes?: number
          prep_time_confirmed_at?: string
          staff_notes?: string
          total: number
          sub_total: number
          service_fee: number
          created_at?: string
          ready_at?: string
          completed_at?: string
          archived?: boolean
        }
      }
      order_items: {
        Row: {
          id?: string
          order_id: string
          quantity: number
          price: number
          item_id: number
          item_name: string
          created_at?: string
          special_instructions?: string
        }
        Insert: {
          id?: string
          order_id: string
          quantity: number
          price: number
          item_id: number
          item_name: string
          created_at?: string
          special_instructions?: string
        }
        Update: {
          id?: string
          order_id: string
          quantity: number
          price: number
          item_id: number
          item_name: string
          created_at?: string
          special_instructions?: string
        }
      }
      order_item_modifiers: {
        Row: {
          id?: string
          order_item_id: string
          modifier_id: string
          modifier_name: string
          created_at?: string
        }
        Insert: {
          id?: string
          order_item_id: string
          modifier_id: string
          modifier_name: string
          created_at?: string
        }
        Update: {
          id?: string
          order_item_id: string
          modifier_id: string
          modifier_name: string
          created_at?: string
        }
      }
      order_item_modifier_options: {
        Row: {
          id?: string
          order_item_modifier_id: string
          option_id: string
          option_name: string
          option_price: number
          created_at?: string
        }
        Insert: {
          id?: string
          order_item_modifier_id: string
          option_id: string
          option_name: string
          option_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_item_modifier_id: string
          option_id: string
          option_name: string
          option_price: number
          created_at?: string
        }
      }
      order_status_history: {
        Row: {
          id?: string
          order_id: string
          status: string
          notes?: string
          staff_id?: string
          created_at?: string
        }
        Insert: {
          id?: string
          order_id: string
          status: string
          notes?: string
          staff_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id: string
          status: string
          notes?: string
          staff_id?: string
          created_at?: string
        }
      }
      order_payments: {
        Row: {
          id?: string
          order_id: string
          payment_intent_id: string
          payment_status: string
          payment_method: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          order_id: string
          payment_intent_id: string
          payment_status: string
          payment_method: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id: string
          payment_intent_id: string
          payment_status: string
          payment_method: string
          amount: number
          created_at?: string
          updated_at?: string
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
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          aud: string | null
          role: string | null
          email: string | null
          encrypted_password: string | null
          email_confirmed_at: string | null
          invited_at: string | null
          confirmation_token: string | null
          confirmation_sent_at: string | null
          recovery_token: string | null
          recovery_sent_at: string | null
          email_change_token_new: string | null
          email_change: string | null
          email_change_sent_at: string | null
          last_sign_in_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          is_super_admin: boolean | null
          created_at: string | null
          updated_at: string | null
          phone: string | null
          phone_confirmed_at: string | null
          phone_change: string | null
          phone_change_token: string | null
          phone_change_sent_at: string | null
          confirmed_at: string | null
          email_change_token_current: string | null
          email_change_confirm_status: number | null
          banned_until: string | null
          reauthentication_token: string | null
          reauthentication_sent_at: string | null
        }
        Insert: {
          id?: string
          aud?: string | null
          role?: string | null
          email?: string | null
          encrypted_password?: string | null
          email_confirmed_at?: string | null
          invited_at?: string | null
          confirmation_token?: string | null
          confirmation_sent_at?: string | null
          recovery_token?: string | null
          recovery_sent_at?: string | null
          email_change_token_new?: string | null
          email_change?: string | null
          email_change_sent_at?: string | null
          last_sign_in_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          is_super_admin?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          phone?: string | null
          phone_confirmed_at?: string | null
          phone_change?: string | null
          phone_change_token?: string | null
          phone_change_sent_at?: string | null
          confirmed_at?: string | null
          email_change_token_current?: string | null
          email_change_confirm_status?: number | null
          banned_until?: string | null
          reauthentication_token?: string | null
          reauthentication_sent_at?: string | null
        }
        Update: {
          id?: string
          aud?: string | null
          role?: string | null
          email?: string | null
          encrypted_password?: string | null
          email_confirmed_at?: string | null
          invited_at?: string | null
          confirmation_token?: string | null
          confirmation_sent_at?: string | null
          recovery_token?: string | null
          recovery_sent_at?: string | null
          email_change_token_new?: string | null
          email_change?: string | null
          email_change_sent_at?: string | null
          last_sign_in_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          is_super_admin?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          phone?: string | null
          phone_confirmed_at?: string | null
          phone_change?: string | null
          phone_change_token?: string | null
          phone_change_sent_at?: string | null
          confirmed_at?: string | null
          email_change_token_current?: string | null
          email_change_confirm_status?: number | null
          banned_until?: string | null
          reauthentication_token?: string | null
          reauthentication_sent_at?: string | null
        }
      }
    }
  }
}