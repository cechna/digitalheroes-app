-- ==============================================================================
-- DIGITAL HEROES - Schema Database & Row Level Security (RLS)
-- Version: 1.0.0
-- Timezone: Europe/Rome
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set default timezone
SET timezone = 'Europe/Rome';

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ROLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    organization TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'organizer', 'member')),
    privacy_accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    privacy_version TEXT NOT NULL DEFAULT '1.0',
    marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
    email_notifications_consent BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast role & email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ------------------------------------------------------------------------------
-- 2. ACTIVITIES (Events, Meetups, Courses)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'event' CHECK (type IN ('event', 'meetup', 'course')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    location TEXT NOT NULL,
    max_participants INTEGER CHECK (max_participants IS NULL OR max_participants > 0),
    cover_image_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_start_date ON public.activities(start_date);
CREATE INDEX IF NOT EXISTS idx_activities_slug ON public.activities(slug);

-- ------------------------------------------------------------------------------
-- 3. ACTIVITY ORGANIZERS (Assign organizers to specific activities)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_organizers (
    activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (activity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_activity_organizers_user ON public.activity_organizers(user_id);

-- ------------------------------------------------------------------------------
-- 4. REGISTRATIONS (Iscrizioni alle attività)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    CONSTRAINT unique_active_registration UNIQUE (activity_id, user_id, status)
);

CREATE INDEX IF NOT EXISTS idx_registrations_activity_status ON public.registrations(activity_id, status);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.registrations(user_id);

-- ------------------------------------------------------------------------------
-- 5. MATERIALS (Documenti, slide, fogli di calcolo, archivi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'generale',
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    visibility TEXT NOT NULL DEFAULT 'all_members' CHECK (visibility IN ('all_members', 'activity_attendees')),
    available_from TIMESTAMPTZ,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_activity ON public.materials(activity_id);
CREATE INDEX IF NOT EXISTS idx_materials_visibility ON public.materials(visibility);
CREATE INDEX IF NOT EXISTS idx_materials_archived ON public.materials(is_archived);

-- ------------------------------------------------------------------------------
-- 6. ANNOUNCEMENTS (Bacheca e aggiornamenti)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    external_link TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    visibility TEXT NOT NULL DEFAULT 'all_members' CHECK (visibility IN ('all_members', 'activity_attendees')),
    activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON public.announcements(is_pinned DESC, published_at DESC);

-- ------------------------------------------------------------------------------
-- 7. COMMUNICATIONS (Messaggi inviati dagli organizzatori)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('all_members', 'activity_attendees', 'selected_users')),
    target_activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'archived')),
    send_email BOOLEAN NOT NULL DEFAULT FALSE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_communications_sender ON public.communications(sender_id);
CREATE INDEX IF NOT EXISTS idx_communications_status ON public.communications(status);

-- ------------------------------------------------------------------------------
-- 8. COMMUNICATION RECIPIENTS (Stato lettura casella interna)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.communication_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_id UUID NOT NULL REFERENCES public.communications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_communication_recipient UNIQUE (communication_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_comm_recipients_user ON public.communication_recipients(user_id, is_read);

-- ------------------------------------------------------------------------------
-- 9. EMAIL DISPATCHES (Tracciamento accurato invii transazionali)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_id UUID NOT NULL REFERENCES public.communications(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('created', 'pending', 'accepted', 'failed', 'delivered')),
    attempts INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    delivery_confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_email_dispatch UNIQUE (communication_id, recipient_id)
);

CREATE INDEX IF NOT EXISTS idx_email_dispatches_status ON public.email_dispatches(status);

-- ------------------------------------------------------------------------------
-- 10. AUDIT LOGS (Registro operazioni amministrative)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 11. HELPER FUNCTIONS FOR SECURITY & CONCURRENCY
-- ------------------------------------------------------------------------------

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = p_user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is organizer or admin for a specific activity
CREATE OR REPLACE FUNCTION public.is_organizer_for_activity(p_activity_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_admin(p_user_id) THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.activity_organizers
        WHERE activity_id = p_activity_id AND user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic activity registration with race-condition prevention and capacity lock
CREATE OR REPLACE FUNCTION public.register_for_activity_atomic(
    p_activity_id UUID,
    p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_status TEXT;
    v_max_participants INTEGER;
    v_current_count INTEGER;
    v_existing_id UUID;
    v_existing_status TEXT;
BEGIN
    -- 1. Lock the activity row to serialize concurrent registrations
    SELECT status, max_participants 
    INTO v_status, v_max_participants
    FROM public.activities
    WHERE id = p_activity_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'ATTIVITA_NON_TROVATA');
    END IF;

    IF v_status <> 'published' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ATTIVITA_NON_DISPONIBILE');
    END IF;

    -- 2. Check if user already registered
    SELECT id, status INTO v_existing_id, v_existing_status
    FROM public.registrations
    WHERE activity_id = p_activity_id AND user_id = p_user_id;

    IF FOUND AND v_existing_status = 'confirmed' THEN
        RETURN jsonb_build_object('success', false, 'error', 'GIA_ISCRITTO');
    END IF;

    -- 3. Check capacity if max_participants is specified
    IF v_max_participants IS NOT NULL THEN
        SELECT COUNT(*) INTO v_current_count
        FROM public.registrations
        WHERE activity_id = p_activity_id AND status = 'confirmed';

        IF v_current_count >= v_max_participants THEN
            RETURN jsonb_build_object('success', false, 'error', 'CAPACITA_MASSIMA_RAGGIUNTA');
        END IF;
    END IF;

    -- 4. Insert or reactivate registration
    IF FOUND THEN
        UPDATE public.registrations
        SET status = 'confirmed', registered_at = NOW(), cancelled_at = NULL
        WHERE id = v_existing_id;
    ELSE
        INSERT INTO public.registrations (activity_id, user_id, status, registered_at)
        VALUES (p_activity_id, p_user_id, 'confirmed', NOW());
    END IF;

    RETURN jsonb_build_object('success', true, 'message', 'ISCRIZIONE_CONFERMATA');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES
-- Anyone can view their own profile; admins can view all profiles; organizers can view profiles of their attendees.
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        id = auth.uid() OR 
        public.is_admin() OR 
        EXISTS (
            SELECT 1 FROM public.activity_organizers ao
            JOIN public.registrations r ON r.activity_id = ao.activity_id
            WHERE ao.user_id = auth.uid() AND r.user_id = profiles.id
        )
    );

-- Users can update only their non-privileged fields (role cannot be changed by user)
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.is_admin())
    WITH CHECK (
        -- If not admin, the role must remain unchanged
        (public.is_admin()) OR (id = auth.uid() AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    );

-- ACTIVITIES
-- Anyone authenticated can view published activities; organizers/admins can view draft/cancelled.
CREATE POLICY "activities_select" ON public.activities
    FOR SELECT TO authenticated
    USING (
        status = 'published' OR 
        status = 'completed' OR 
        public.is_organizer_for_activity(id)
    );

CREATE POLICY "activities_insert" ON public.activities
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_admin() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
    );

CREATE POLICY "activities_update_delete" ON public.activities
    FOR ALL TO authenticated
    USING (public.is_organizer_for_activity(id));

-- REGISTRATIONS
-- Users can view their own registrations; organizers can view registrations for their activities; admins view all.
CREATE POLICY "registrations_select" ON public.registrations
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR 
        public.is_organizer_for_activity(activity_id)
    );

CREATE POLICY "registrations_insert_own" ON public.registrations
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid() OR public.is_organizer_for_activity(activity_id));

CREATE POLICY "registrations_update_own" ON public.registrations
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid() OR public.is_organizer_for_activity(activity_id));

-- MATERIALS
-- Member can select if: visibility = 'all_members' and available_from <= NOW(), OR registered attendee of the activity, OR organizer/admin.
CREATE POLICY "materials_select" ON public.materials
    FOR SELECT TO authenticated
    USING (
        NOT is_archived AND (
            public.is_admin() OR
            (activity_id IS NOT NULL AND public.is_organizer_for_activity(activity_id)) OR
            (
                (available_from IS NULL OR available_from <= NOW()) AND (
                    visibility = 'all_members' OR
                    (activity_id IS NOT NULL AND EXISTS (
                        SELECT 1 FROM public.registrations
                        WHERE activity_id = materials.activity_id 
                          AND user_id = auth.uid() 
                          AND status = 'confirmed'
                    ))
                )
            )
        )
    );

CREATE POLICY "materials_manage" ON public.materials
    FOR ALL TO authenticated
    USING (
        public.is_admin() OR
        (activity_id IS NOT NULL AND public.is_organizer_for_activity(activity_id))
    );

-- ANNOUNCEMENTS
CREATE POLICY "announcements_select" ON public.announcements
    FOR SELECT TO authenticated
    USING (
        public.is_admin() OR
        (activity_id IS NOT NULL AND public.is_organizer_for_activity(activity_id)) OR
        (
            status = 'published' AND (
                visibility = 'all_members' OR
                (activity_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM public.registrations
                    WHERE activity_id = announcements.activity_id 
                      AND user_id = auth.uid() 
                      AND status = 'confirmed'
                ))
            )
        )
    );

CREATE POLICY "announcements_manage" ON public.announcements
    FOR ALL TO authenticated
    USING (
        public.is_admin() OR
        (activity_id IS NOT NULL AND public.is_organizer_for_activity(activity_id))
    );

-- COMMUNICATIONS & RECIPIENTS
CREATE POLICY "communications_sender" ON public.communications
    FOR ALL TO authenticated
    USING (
        public.is_admin() OR
        (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'organizer')))
    );

CREATE POLICY "recipients_select" ON public.communication_recipients
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR 
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.communications c
            WHERE c.id = communication_recipients.communication_id AND c.sender_id = auth.uid()
        )
    );

CREATE POLICY "recipients_update_read" ON public.communication_recipients
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- EMAIL DISPATCHES & AUDIT LOGS (Admin / privileged only)
CREATE POLICY "email_dispatches_admin" ON public.email_dispatches
    FOR ALL TO authenticated
    USING (public.is_admin());

CREATE POLICY "audit_logs_admin" ON public.audit_logs
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 13. PROCEDURE TO CREATE FIRST ADMIN
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.setup_first_admin(
    p_user_email TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Only promotes if no admin currently exists or if called by existing admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
        UPDATE public.profiles
        SET role = 'admin'
        WHERE email = p_user_email;
    ELSE
        RAISE EXCEPTION 'Esiste già un amministratore nel sistema.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
