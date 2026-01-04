CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_cake_reservations_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_cake_reservations_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: cake_reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cake_reservations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    reservation_date date NOT NULL,
    reservation_time text NOT NULL,
    cake_description text,
    status text DEFAULT 'confirmed'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT cake_reservations_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text])))
);


--
-- Name: cake_reservations cake_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cake_reservations
    ADD CONSTRAINT cake_reservations_pkey PRIMARY KEY (id);


--
-- Name: idx_cake_reservations_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cake_reservations_date ON public.cake_reservations USING btree (reservation_date);


--
-- Name: idx_cake_reservations_date_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cake_reservations_date_time ON public.cake_reservations USING btree (reservation_date, reservation_time);


--
-- Name: cake_reservations update_cake_reservations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_cake_reservations_updated_at BEFORE UPDATE ON public.cake_reservations FOR EACH ROW EXECUTE FUNCTION public.update_cake_reservations_updated_at();


--
-- Name: cake_reservations Anyone can create reservations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create reservations" ON public.cake_reservations FOR INSERT WITH CHECK (true);


--
-- Name: cake_reservations Anyone can view reservations for availability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view reservations for availability" ON public.cake_reservations FOR SELECT USING (true);


--
-- Name: cake_reservations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cake_reservations ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;