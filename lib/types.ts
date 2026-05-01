export type EventInfo = {
  id: string;
  name: string;
  couple_name: string;
  short_description: string;
  welcome_text: string;
  event_date: string;
  event_time: string;
  event_place: string;
  cover_image_url: string;
  public_slug: string;
};

export type Confirmation = {
  id: string;
  event_id: string;
  visitor_token: string;
  name: string;
  phone: string;
  presence_confirmed: boolean;
  confirmed_at: string;
  duplicate_status: string;
  admin_note?: string | null;
};

export type Gift = {
  id: string;
  event_id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  image_url?: string | null;
  reference_link?: string | null;
  display_order: number;
  status: "DISPONIVEL" | "RESERVADO" | "INATIVO";
  reserved_by_confirmation_id?: string | null;
  reserved_by_visitor_token?: string | null;
  reserved_at?: string | null;
  guest_confirmations?: Pick<Confirmation, "name" | "phone"> | null;
};
