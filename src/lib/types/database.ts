export interface Database {
  public: {
    Tables: {
      shops: {
        Row: Shop;
        Insert: Omit<Shop, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Shop, "id" | "created_at" | "updated_at">>;
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, "id" | "created_at">;
        Update: Partial<Omit<MenuItem, "id" | "created_at">>;
      };
      toppings: {
        Row: Topping;
        Insert: Omit<Topping, "id" | "created_at">;
        Update: Partial<Omit<Topping, "id" | "created_at">>;
      };
      visit_steps: {
        Row: VisitStep;
        Insert: Omit<VisitStep, "id" | "created_at">;
        Update: Partial<Omit<VisitStep, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface Shop {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  nearest_station: string | null;
  business_hours: string | null;
  closed_days: string | null;
  sns: string | null;
  description: string | null;
  image_url: string | null;
  map_url: string | null;
  seat_count: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  size: string | null;
  is_default: boolean;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Topping {
  id: string;
  shop_id: string;
  name: string;
  options: string[];
  default_option: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface VisitStep {
  id: string;
  shop_id: string;
  step_number: number;
  title: string;
  description: string;
  tips: string | null;
  created_at: string;
}

export type ShopCommentStatus = "pending" | "reviewed" | "applied" | "rejected";
export type ReportPage = "info" | "menu" | "flow";
export type ReportTargetKind =
  | "field"
  | "menu_item"
  | "topping"
  | "visit_step"
  | "selection"
  | "free";
export type ReportType = "wrong" | "closed" | "update" | "other";

export interface ShopComment {
  id: string;
  shop_id: string;
  body: string;
  status: ShopCommentStatus;
  admin_note: string | null;
  page: ReportPage | null;
  target_kind: ReportTargetKind | null;
  target_id: string | null;
  target_label: string | null;
  report_type: ReportType | null;
  created_at: string;
  updated_at: string;
}
