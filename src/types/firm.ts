export interface FirmOutput {
  firm_name: string;
  website_url: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  city: string;
  state: string;
  vacant_listings_count: number;
  doors_managed: string;
  property_management_software: string;
  leasing_manager_name: string;
  leasing_manager_contact: string;
  services_offered: string[];
  portfolio_focus: string[];
  google_reviews_count: number;
  google_rating: number;
  last_blog_update: string;
  linkedin_url: string;
  instagram_url: string;
  facebook_url: string;
  advertises_24_7_maintenance: boolean;
  advertises_tenant_portal: boolean;
  is_hiring: boolean;
}

export interface FirmRecord {
  output: FirmOutput;
}