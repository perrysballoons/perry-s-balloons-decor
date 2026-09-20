import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  sort_order: number;
};

export type Decoration = {
  id: string;
  category_id: string | null;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  tag_es: string;
  tag_en: string;
  price: number;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name_es, name_en, sort_order")
      .order("sort_order");
    if (error) throw error;
    return data as Category[];
  },
});

function mapRows(rows: unknown[]): Decoration[] {
  return (rows as Decoration[]).map((d) => ({ ...d, price: Number(d.price) }));
}

export const publicDecorationsQuery = queryOptions({
  queryKey: ["decorations", "public"],
  queryFn: async (): Promise<Decoration[]> => {
    const { data, error } = await supabase
      .from("decorations")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return mapRows(data ?? []);
  },
});

export const adminDecorationsQuery = queryOptions({
  queryKey: ["decorations", "admin"],
  queryFn: async (): Promise<Decoration[]> => {
    const { data, error } = await supabase.from("decorations").select("*").order("sort_order");
    if (error) throw error;
    return mapRows(data ?? []);
  },
});
