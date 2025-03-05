export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          last_purchase: string | null
          name: string
          phone: string
          registration_date: string
          tickets: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_purchase?: string | null
          name: string
          phone: string
          registration_date?: string
          tickets?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_purchase?: string | null
          name?: string
          phone?: string
          registration_date?: string
          tickets?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          name: string
          price: number
          stock: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          name: string
          price: number
          stock?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          price?: number
          stock?: number
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          category: string
          id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
        }
        Insert: {
          category: string
          id?: string
          price: number
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
        }
        Update: {
          category?: string
          id?: string
          price?: number
          product_id?: string
          product_name?: string
          quantity?: number
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          customer: string
          date: string
          id: string
          total: number
        }
        Insert: {
          created_at?: string
          customer: string
          date?: string
          id?: string
          total: number
        }
        Update: {
          created_at?: string
          customer?: string
          date?: string
          id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_fkey"
            columns: ["customer"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_sales: {
        Row: {
          created_at: string
          customer: string
          date: string
          event: string
          event_date: string
          id: string
          ticket_type: string
          tickets: number
          total: number
        }
        Insert: {
          created_at?: string
          customer: string
          date?: string
          event: string
          event_date: string
          id?: string
          ticket_type: string
          tickets: number
          total: number
        }
        Update: {
          created_at?: string
          customer?: string
          date?: string
          event?: string
          event_date?: string
          id?: string
          ticket_type?: string
          tickets?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_sales_customer_fkey"
            columns: ["customer"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
