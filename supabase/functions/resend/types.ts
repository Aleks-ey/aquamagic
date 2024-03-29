
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
      calendar: {
        Row: {
          category: string | null
          coach: string | null
          created_at: string
          date: string | null
          description: string | null
          end_time: string | null
          id: number
          is_all_day: boolean | null
          location: string | null
          start_time: string | null
          title: string | null
        }
        Insert: {
          category?: string | null
          coach?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: number
          is_all_day?: boolean | null
          location?: string | null
          start_time?: string | null
          title?: string | null
        }
        Update: {
          category?: string | null
          coach?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: number
          is_all_day?: boolean | null
          location?: string | null
          start_time?: string | null
          title?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          contact_id: string
          created_at: string | null
          email: string
          first_name: string
          last_name: string
          phone: string
          registrant_id: string | null
          relation: string
        }
        Insert: {
          contact_id?: string
          created_at?: string | null
          email: string
          first_name: string
          last_name: string
          phone: string
          registrant_id?: string | null
          relation: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          registrant_id?: string | null
          relation?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_registrant_id_fkey"
            columns: ["registrant_id"]
            isOneToOne: false
            referencedRelation: "registrants"
            referencedColumns: ["registrant_id"]
          }
        ]
      }
      medical_information: {
        Row: {
          allergy: string | null
          behavioral_problems: string | null
          cardiovascular_diseases: string | null
          conditions_after_injury_surgery: string | null
          congenital_malformations: string | null
          created_at: string | null
          depression_anxiety: string | null
          disability: string | null
          epilepsy: string | null
          genetic_disorders: string | null
          main_health_complaints: string | null
          medical_info_id: string
          medication: string | null
          mental_problems: string | null
          observations_13_16: string | null
          observations_17_up: string | null
          observations_2_3: string | null
          observations_4_7: string | null
          observations_8_12: string | null
          observations_birth_1: string | null
          other_medical_conditions: string | null
          registrant_id: string | null
          surgery: string | null
          trauma: string | null
        }
        Insert: {
          allergy?: string | null
          behavioral_problems?: string | null
          cardiovascular_diseases?: string | null
          conditions_after_injury_surgery?: string | null
          congenital_malformations?: string | null
          created_at?: string | null
          depression_anxiety?: string | null
          disability?: string | null
          epilepsy?: string | null
          genetic_disorders?: string | null
          main_health_complaints?: string | null
          medical_info_id?: string
          medication?: string | null
          mental_problems?: string | null
          observations_13_16?: string | null
          observations_17_up?: string | null
          observations_2_3?: string | null
          observations_4_7?: string | null
          observations_8_12?: string | null
          observations_birth_1?: string | null
          other_medical_conditions?: string | null
          registrant_id?: string | null
          surgery?: string | null
          trauma?: string | null
        }
        Update: {
          allergy?: string | null
          behavioral_problems?: string | null
          cardiovascular_diseases?: string | null
          conditions_after_injury_surgery?: string | null
          congenital_malformations?: string | null
          created_at?: string | null
          depression_anxiety?: string | null
          disability?: string | null
          epilepsy?: string | null
          genetic_disorders?: string | null
          main_health_complaints?: string | null
          medical_info_id?: string
          medication?: string | null
          mental_problems?: string | null
          observations_13_16?: string | null
          observations_17_up?: string | null
          observations_2_3?: string | null
          observations_4_7?: string | null
          observations_8_12?: string | null
          observations_birth_1?: string | null
          other_medical_conditions?: string | null
          registrant_id?: string | null
          surgery?: string | null
          trauma?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_information_registrant_id_fkey"
            columns: ["registrant_id"]
            isOneToOne: false
            referencedRelation: "registrants"
            referencedColumns: ["registrant_id"]
          }
        ]
      }
      registrants: {
        Row: {
          created_at: string | null
          date_of_birth: string
          email: string | null
          emergency_contact1_id: string | null
          emergency_contact2_id: string | null
          emergency_contact3_id: string | null
          first_name: string
          home_address: string
          last_name: string
          medical_info_id: string | null
          phone: string | null
          registrant_id: string
          schedule_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth: string
          email?: string | null
          emergency_contact1_id?: string | null
          emergency_contact2_id?: string | null
          emergency_contact3_id?: string | null
          first_name: string
          home_address: string
          last_name: string
          medical_info_id?: string | null
          phone?: string | null
          registrant_id?: string
          schedule_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string
          email?: string | null
          emergency_contact1_id?: string | null
          emergency_contact2_id?: string | null
          emergency_contact3_id?: string | null
          first_name?: string
          home_address?: string
          last_name?: string
          medical_info_id?: string | null
          phone?: string | null
          registrant_id?: string
          schedule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrants_emergency_contact1_id_fkey"
            columns: ["emergency_contact1_id"]
            isOneToOne: false
            referencedRelation: "emergency_contacts"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "registrants_emergency_contact2_id_fkey"
            columns: ["emergency_contact2_id"]
            isOneToOne: false
            referencedRelation: "emergency_contacts"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "registrants_emergency_contact3_id_fkey"
            columns: ["emergency_contact3_id"]
            isOneToOne: false
            referencedRelation: "emergency_contacts"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "registrants_medical_info_id_fkey"
            columns: ["medical_info_id"]
            isOneToOne: false
            referencedRelation: "medical_information"
            referencedColumns: ["medical_info_id"]
          },
          {
            foreignKeyName: "registrants_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["schedule_id"]
          }
        ]
      }
      schedules: {
        Row: {
          created_at: string | null
          friday_availability: string | null
          monday_availability: string | null
          registrant_id: string | null
          saturday_availability: string | null
          schedule_id: string
          sunday_availability: string | null
          thursday_availability: string | null
          tuesday_availability: string | null
          wednesday_availability: string | null
        }
        Insert: {
          created_at?: string | null
          friday_availability?: string | null
          monday_availability?: string | null
          registrant_id?: string | null
          saturday_availability?: string | null
          schedule_id?: string
          sunday_availability?: string | null
          thursday_availability?: string | null
          tuesday_availability?: string | null
          wednesday_availability?: string | null
        }
        Update: {
          created_at?: string | null
          friday_availability?: string | null
          monday_availability?: string | null
          registrant_id?: string | null
          saturday_availability?: string | null
          schedule_id?: string
          sunday_availability?: string | null
          thursday_availability?: string | null
          tuesday_availability?: string | null
          wednesday_availability?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_registrant_id_fkey"
            columns: ["registrant_id"]
            isOneToOne: false
            referencedRelation: "registrants"
            referencedColumns: ["registrant_id"]
          }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
