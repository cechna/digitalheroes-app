export type UserRole = 'admin' | 'organizer' | 'member';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization?: string | null;
  role: UserRole;
  privacy_accepted_at: string;
  privacy_version: string;
  marketing_consent: boolean;
  email_notifications_consent: boolean;
  created_at: string;
  updated_at: string;
}

export type ActivityType = 'event' | 'meetup' | 'course';
export type ActivityStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ActivityType;
  status: ActivityStatus;
  start_date: string;
  end_date: string;
  is_online: boolean;
  location: string;
  max_participants: number | null;
  cover_image_url?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  current_participants_count?: number;
  is_user_registered?: boolean;
  organizers?: Profile[];
}

export interface ActivityOrganizer {
  activity_id: string;
  user_id: string;
  created_at: string;
}

export type RegistrationStatus = 'confirmed' | 'cancelled';

export interface Registration {
  id: string;
  activity_id: string;
  user_id: string;
  status: RegistrationStatus;
  registered_at: string;
  user?: Profile;
  activity?: Activity;
}

export type MaterialVisibility = 'all_members' | 'activity_attendees';

export interface Material {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  activity_id?: string | null;
  visibility: MaterialVisibility;
  available_from?: string | null;
  is_archived: boolean;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  activity?: Activity | null;
}

export type AnnouncementStatus = 'draft' | 'published' | 'archived';
export type AnnouncementVisibility = 'all_members' | 'activity_attendees';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  external_link?: string | null;
  status: AnnouncementStatus;
  is_pinned: boolean;
  visibility: AnnouncementVisibility;
  activity_id?: string | null;
  published_at?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  activity?: Activity | null;
}

export type CommunicationTargetType = 'all_members' | 'activity_attendees' | 'selected_users';
export type CommunicationStatus = 'draft' | 'sent' | 'archived';

export interface Communication {
  id: string;
  subject: string;
  body: string;
  target_type: CommunicationTargetType;
  target_activity_id?: string | null;
  status: CommunicationStatus;
  send_email: boolean;
  sender_id: string;
  sent_at?: string | null;
  created_at: string;
  // Extra metadata
  sender?: Profile;
  target_activity?: Activity;
  recipients_count?: number;
  read_count?: number;
}

export interface CommunicationRecipient {
  id: string;
  communication_id: string;
  user_id: string;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  communication?: Communication;
}

export type EmailDispatchStatus = 'created' | 'pending' | 'accepted' | 'failed' | 'delivered';

export interface EmailDispatch {
  id: string;
  communication_id: string;
  recipient_id: string;
  recipient_email: string;
  status: EmailDispatchStatus;
  attempts: number;
  error_message?: string | null;
  sent_at?: string | null;
  delivery_confirmed_at?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, unknown> | null;
  ip_address?: string | null;
  created_at: string;
  admin?: Profile;
}
