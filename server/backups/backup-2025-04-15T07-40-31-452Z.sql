--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    encrypted_password text NOT NULL,
    role text DEFAULT 'authenticated'::text NOT NULL,
    email_confirmed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE auth.users OWNER TO postgres;

--
-- Name: children; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.children (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    birth_date date NOT NULL,
    photo_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.children OWNER TO postgres;

--
-- Name: parent_children; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parent_children (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent_id uuid,
    child_id uuid,
    is_primary_parent boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.parent_children OWNER TO postgres;

--
-- Name: parent_couples; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parent_couples (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent1_id uuid,
    parent2_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.parent_couples OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'parent'::text NOT NULL,
    first_name text,
    last_name text,
    is_approved boolean DEFAULT false,
    must_change_password boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT valid_role CHECK ((role = ANY (ARRAY['admin'::text, 'gestionnaire'::text, 'nounou'::text, 'parent'::text])))
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(20),
    address text,
    city character varying(100),
    postal_code character varying(10),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.users (id, email, encrypted_password, role, email_confirmed_at, created_at, updated_at) FROM stdin;
8ca6f33f-8fcd-45cb-a8c1-49c4b9d01eaf	admin@supernounou.fr	$2a$06$ongWXPLjYevBHsfQ2x.2O.dnFT2AkEVIl/CCWAqNEbPfa4FgqVoIq	authenticated	2025-04-08 09:19:18.964949+00	2025-04-08 09:19:18.964949+00	2025-04-08 09:19:18.964949+00
\.


--
-- Data for Name: children; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.children (id, first_name, last_name, birth_date, photo_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: parent_children; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parent_children (id, parent_id, child_id, is_primary_parent, created_at) FROM stdin;
\.


--
-- Data for Name: parent_couples; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parent_couples (id, parent1_id, parent2_id, created_at) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, email, role, first_name, last_name, is_approved, must_change_password, created_at, updated_at) FROM stdin;
8ca6f33f-8fcd-45cb-a8c1-49c4b9d01eaf	admin@supernounou.fr	admin	Admin	System	t	f	2025-04-08 09:19:18.964949+00	2025-04-08 09:19:18.964949+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role, first_name, last_name, phone, address, city, postal_code, is_active, created_at, updated_at) FROM stdin;
987a5391-0d37-4b39-b039-6f1420fe3a13	admin@supernounou.fr	$2b$10$npBx13tbqmf2W4jgFwgnSujYyiAWeJSjApqcYWv7wL0URLDihlVfW	admin	Admin	System	\N	\N	\N	\N	t	2025-04-08 12:32:51.738248+00	2025-04-08 12:44:48.253199+00
37925e8c-d818-4745-8e39-f311bef2fdcc	julien.martin@supernounou.fr	$2b$10$DxmKij5LSzIuaQ.CTJUdx.VpAIkfABoGPc2UBm.S/A44S/CYx0FIi	gestionnaire	Julien	MARTIN	\N	\N	\N	\N	t	2025-04-11 07:13:21.686803+00	2025-04-11 07:13:21.686803+00
a0bda6b2-a28f-4e7c-866d-48e6b8588d41	miriam.aguilar@supernounou.fr	$2b$10$iEzTEe4X5HQq.fCfaXeFBevfkOU9HEvgYpPTL73ikSkkJkJETPOJu	gestionnaire	Miriam	Aguilar Morillo	\N	\N	\N	\N	t	2025-04-14 22:24:04.917922+00	2025-04-14 22:24:04.917922+00
\.


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: children children_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_pkey PRIMARY KEY (id);


--
-- Name: parent_children parent_children_parent_id_child_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_children
    ADD CONSTRAINT parent_children_parent_id_child_id_key UNIQUE (parent_id, child_id);


--
-- Name: parent_children parent_children_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_children
    ADD CONSTRAINT parent_children_pkey PRIMARY KEY (id);


--
-- Name: parent_couples parent_couples_parent1_id_parent2_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_couples
    ADD CONSTRAINT parent_couples_parent1_id_parent2_id_key UNIQUE (parent1_id, parent2_id);


--
-- Name: parent_couples parent_couples_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_couples
    ADD CONSTRAINT parent_couples_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: parent_children parent_children_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_children
    ADD CONSTRAINT parent_children_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE;


--
-- Name: parent_children parent_children_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_children
    ADD CONSTRAINT parent_children_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: parent_couples parent_couples_parent1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_couples
    ADD CONSTRAINT parent_couples_parent1_id_fkey FOREIGN KEY (parent1_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: parent_couples parent_couples_parent2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_couples
    ADD CONSTRAINT parent_couples_parent2_id_fkey FOREIGN KEY (parent2_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

