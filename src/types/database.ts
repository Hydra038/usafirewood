export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: 'customer' | 'admin';
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'customer' | 'admin';
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'customer' | 'admin';
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          stock_quantity: number;
          sku: string | null;
          wood_type: string;
          unit_type: 'cord' | 'face_cord' | 'bundle' | 'rack';
          is_heat_treated: boolean;
          moisture_content: number | null;
          is_seasoned: boolean;
          is_kiln_dried: boolean;
          weight_lbs: number | null;
          dimensions: string | null;
          is_active: boolean;
          is_featured: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          shipping_address_line1: string;
          shipping_address_line2: string | null;
          shipping_city: string;
          shipping_state: string;
          shipping_zip: string;
          shipping_country: string;
          delivery_type: 'delivery' | 'pickup';
          delivery_distance_miles: number | null;
          delivery_latitude: number | null;
          delivery_longitude: number | null;
          subtotal: number;
          delivery_fee: number;
          tax: number;
          total: number;
          payment_method_id: string | null;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          customer_notes: string | null;
          admin_notes: string | null;
          paid_at: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          name: string;
          type: string;
          instructions: string | null;
          account_username: string | null;
          qr_code_url: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
