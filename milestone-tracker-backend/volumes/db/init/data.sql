--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.6 (Debian 14.6-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS "update public" ON public.users;
DROP POLICY IF EXISTS "public select" ON public.proposals_users;
DROP POLICY IF EXISTS public ON public.users;
DROP POLICY IF EXISTS public ON public.soms;
DROP POLICY IF EXISTS public ON public.som_reviews;
DROP POLICY IF EXISTS public ON public.signoffs;
DROP POLICY IF EXISTS public ON public.proposals;
DROP POLICY IF EXISTS public ON public.poas;
DROP POLICY IF EXISTS "insert admin" ON public.proposals_users;
DROP POLICY IF EXISTS "delete admin" ON public.signoffs;
DROP POLICY IF EXISTS "delete admin" ON public.challenges_users;
DROP POLICY IF EXISTS "admin / signoff" ON public.signoffs;
DROP POLICY IF EXISTS admin ON public.signoffs;
DROP POLICY IF EXISTS "Select public" ON public.challenges_users;
DROP POLICY IF EXISTS "Public visible" ON public.challenges;
DROP POLICY IF EXISTS "Public select" ON public.funds;
DROP POLICY IF EXISTS "Public list" ON public.poas_reviews;
DROP POLICY IF EXISTS "Proposal owner insert" ON public.soms;
DROP POLICY IF EXISTS "Proposal owner" ON public.poas;
DROP POLICY IF EXISTS "IO member" ON public.som_reviews;
DROP POLICY IF EXISTS "IO member" ON public.poas_reviews;
DROP POLICY IF EXISTS "Delete admin" ON public.proposals_users;
DROP POLICY IF EXISTS "CT member (real)" ON public.som_reviews;
DROP POLICY IF EXISTS "CT member" ON public.poas_reviews;
DROP POLICY IF EXISTS "Admin insert" ON public.challenges_users;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.soms DROP CONSTRAINT IF EXISTS soms_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.soms DROP CONSTRAINT IF EXISTS soms_proposal_id_fkey;
ALTER TABLE IF EXISTS ONLY public.soms DROP CONSTRAINT IF EXISTS soms_challenge_id_fkey;
ALTER TABLE IF EXISTS ONLY public.som_reviews DROP CONSTRAINT IF EXISTS som_reviews_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.som_reviews DROP CONSTRAINT IF EXISTS som_reviews_som_id_fkey;
ALTER TABLE IF EXISTS ONLY public.som_reviews DROP CONSTRAINT IF EXISTS som_reviews_challenge_id_fkey;
ALTER TABLE IF EXISTS ONLY public.signoffs DROP CONSTRAINT IF EXISTS signoffs_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.signoffs DROP CONSTRAINT IF EXISTS signoffs_som_id_fkey;
ALTER TABLE IF EXISTS ONLY public.signoffs DROP CONSTRAINT IF EXISTS signoffs_poa_id_fkey;
ALTER TABLE IF EXISTS ONLY public.proposals_users DROP CONSTRAINT IF EXISTS proposals_users_user_idd_fkey;
ALTER TABLE IF EXISTS ONLY public.proposals_users DROP CONSTRAINT IF EXISTS proposals_users_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.proposals_users DROP CONSTRAINT IF EXISTS proposals_users_proposal_id_fkey;
ALTER TABLE IF EXISTS ONLY public.proposals DROP CONSTRAINT IF EXISTS proposals_challenge_id_fkey;
ALTER TABLE IF EXISTS ONLY public.poas DROP CONSTRAINT IF EXISTS poas_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.poas DROP CONSTRAINT IF EXISTS poas_som_id_fkey;
ALTER TABLE IF EXISTS ONLY public.poas_reviews DROP CONSTRAINT IF EXISTS poas_reviews_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.poas_reviews DROP CONSTRAINT IF EXISTS poas_reviews_poas_id_fkey;
ALTER TABLE IF EXISTS ONLY public.poas DROP CONSTRAINT IF EXISTS poas_proposal_id_fkey;
ALTER TABLE IF EXISTS ONLY public.poas DROP CONSTRAINT IF EXISTS poas_challenge_id_fkey;
ALTER TABLE IF EXISTS ONLY public.challenges_users DROP CONSTRAINT IF EXISTS challenges_users_user_idd_fkey;
ALTER TABLE IF EXISTS ONLY public.challenges_users DROP CONSTRAINT IF EXISTS challenges_users_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.challenges_users DROP CONSTRAINT IF EXISTS challenges_users_challenge_id_fkey;
ALTER TABLE IF EXISTS ONLY public.challenges DROP CONSTRAINT IF EXISTS challenges_fund_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users__auth_user_id_key;
ALTER TABLE IF EXISTS ONLY public.soms DROP CONSTRAINT IF EXISTS soms_pkey;
ALTER TABLE IF EXISTS ONLY public.som_reviews DROP CONSTRAINT IF EXISTS som_reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.signoffs DROP CONSTRAINT IF EXISTS signoffs_pkey;
ALTER TABLE IF EXISTS ONLY public.proposals_users DROP CONSTRAINT IF EXISTS proposals_users_pkey;
ALTER TABLE IF EXISTS ONLY public.proposals DROP CONSTRAINT IF EXISTS proposals_pkey;
ALTER TABLE IF EXISTS ONLY public.poas_reviews DROP CONSTRAINT IF EXISTS poas_review_pkey;
ALTER TABLE IF EXISTS ONLY public.poas DROP CONSTRAINT IF EXISTS poas_pkey;
ALTER TABLE IF EXISTS ONLY public.funds DROP CONSTRAINT IF EXISTS funds_pkey;
ALTER TABLE IF EXISTS ONLY public.challenges_users DROP CONSTRAINT IF EXISTS challenges_users_pkey;
ALTER TABLE IF EXISTS ONLY public.challenges DROP CONSTRAINT IF EXISTS challenges_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.soms;
DROP TABLE IF EXISTS public.som_reviews;
DROP TABLE IF EXISTS public.signoffs;
DROP TABLE IF EXISTS public.proposals_users;
DROP TABLE IF EXISTS public.proposals;
DROP TABLE IF EXISTS public.poas_reviews;
DROP TABLE IF EXISTS public.poas;
DROP TABLE IF EXISTS public.funds;
DROP TABLE IF EXISTS public.challenges_users;
DROP TABLE IF EXISTS public.challenges;
DROP FUNCTION IF EXISTS public.getmilestones();
DROP FUNCTION IF EXISTS public.create_user();
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: create_user(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.create_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$begin
  insert into public.users(user_id, _auth_user_id, email, role)
  values (new.id, new.id, new.email, 0);
  return new;
end;$$;


-- ALTER FUNCTION public.create_user() OWNER TO supabase_admin;

--
-- Name: getmilestones(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.getmilestones() RETURNS TABLE(title character varying, project_id bigint, budget bigint, id bigint, proposal_id bigint, milestone bigint)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY
            SELECT DISTINCT ON (soms.proposal_id, soms.milestone)
            proposals.title, proposals.project_id, proposals.budget,
            soms.id, soms.proposal_id, soms.milestone
            FROM soms
            LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
            ORDER BY soms.proposal_id, soms.milestone, soms.created_at DESC;
    end;
$$;


-- ALTER FUNCTION public.getmilestones() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: challenges; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.challenges (
    id bigint NOT NULL,
    title character varying,
    created_at timestamp with time zone DEFAULT now(),
    fund_id bigint
);


-- ALTER TABLE public.challenges OWNER TO supabase_admin;

--
-- Name: challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.challenges ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.challenges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: challenges_users; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.challenges_users (
    id bigint NOT NULL,
    challenge_id bigint,
    user_id uuid,
    user_idd bigint
);


-- ALTER TABLE public.challenges_users OWNER TO supabase_admin;

--
-- Name: challenges_users_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.challenges_users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.challenges_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: funds; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.funds (
    id bigint NOT NULL,
    title character varying,
    created_at timestamp with time zone DEFAULT now()
);


-- ALTER TABLE public.funds OWNER TO supabase_admin;

--
-- Name: funds_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.funds ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.funds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: poas; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.poas (
    id bigint NOT NULL,
    content text,
    proposal_id bigint,
    created_at timestamp with time zone DEFAULT now(),
    som_id bigint,
    challenge_id bigint,
    user_id uuid
);


-- ALTER TABLE public.poas OWNER TO supabase_admin;

--
-- Name: poas_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.poas ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.poas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: poas_reviews; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.poas_reviews (
    id bigint NOT NULL,
    content_approved boolean,
    content_comment text,
    poas_id bigint,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid DEFAULT auth.uid()
);


-- ALTER TABLE public.poas_reviews OWNER TO supabase_admin;

--
-- Name: poas_review_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.poas_reviews ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.poas_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proposals; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.proposals (
    id bigint NOT NULL,
    title character varying,
    url character varying,
    project_id bigint,
    completion_date timestamp without time zone,
    created_at timestamp with time zone DEFAULT now(),
    challenge_id bigint,
    budget bigint
);


-- ALTER TABLE public.proposals OWNER TO supabase_admin;

--
-- Name: proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.proposals ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.proposals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proposals_users; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.proposals_users (
    id bigint NOT NULL,
    proposal_id bigint,
    user_id uuid,
    user_idd bigint
);


-- ALTER TABLE public.proposals_users OWNER TO supabase_admin;

--
-- Name: proposals_users_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.proposals_users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.proposals_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: allocations; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.allocations (
    id bigint NOT NULL,
    proposal_id bigint,
    user_id uuid,
    user_idd bigint
);


-- ALTER TABLE public.allocations OWNER TO supabase_admin;

--
-- Name: allocations_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.allocations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.allocations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: signoffs; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.signoffs (
    id bigint NOT NULL,
    som_id bigint,
    poa_id bigint,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid DEFAULT auth.uid()
);


-- ALTER TABLE public.signoffs OWNER TO supabase_admin;

--
-- Name: signoffs_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.signoffs ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.signoffs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: som_reviews; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.som_reviews (
    id bigint NOT NULL,
    outputs_approves boolean,
    outputs_comment text,
    success_criteria_approves boolean,
    success_criteria_comment text,
    evidence_approves boolean,
    evidence_comment text,
    som_id bigint,
    created_at timestamp with time zone DEFAULT now(),
    challenge_id bigint,
    user_id uuid DEFAULT auth.uid()
);


-- ALTER TABLE public.som_reviews OWNER TO supabase_admin;

--
-- Name: som_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.som_reviews ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.som_reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: soms; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.soms (
    id bigint NOT NULL,
    outputs text,
    success_criteria text,
    evidence text,
    month text,
    cost bigint,
    completion bigint,
    proposal_id bigint,
    created_at timestamp with time zone DEFAULT now(),
    milestone bigint,
    title character varying,
    challenge_id bigint,
    user_id uuid DEFAULT auth.uid()
);




-- ALTER TABLE public.soms OWNER TO supabase_admin;

--
-- Name: soms_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.soms ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.soms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    user_id uuid,
    role bigint,
    created_at timestamp with time zone DEFAULT now(),
    username character varying,
    email character varying,
    _auth_user_id uuid
);


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.challenges (id, title, created_at, fund_id) FROM stdin;
1	Dapps, Products & Integrations	2022-10-07 19:32:55.117372+00	1
2	The Great Migration (from Ethereum)	2022-11-10 14:19:40.645101+00	1
3	Cross-Chain Collaboration	2022-11-10 14:19:58.366977+00	1
4	DAOs <3 Cardano	2022-11-10 14:20:21.012715+00	1
5	Grow Africa, Grow Cardano	2022-11-10 14:20:40.23063+00	1
6	Legal & Financial Implementations	2022-11-10 14:20:54.863976+00	1
7	Developer Ecosystem	2022-11-10 14:21:19.367882+00	1
\.


--
-- Data for Name: funds; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.funds (id, title, created_at) FROM stdin;
1	Fund 9	2022-10-07 19:32:37.42443+00
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.proposals (id, title, url, project_id, completion_date, created_at, challenge_id, budget) FROM stdin;
1	Proposal 1	https://cardano.ideascale.com/a/dtd/422294-48088	900002	2023-03-01 00:00:00	2022-11-10 16:35:28.580163+00	1	22000
2	Proposal 2	https://cardano.ideascale.com/a/dtd/419167-48088	900003	2023-06-30 00:00:00	2022-11-10 16:35:28.580163+00	2	120000
3	Proposal 3	https://cardano.ideascale.com/a/dtd/418759-48088	900005	2023-04-01 00:00:00	2022-11-10 16:35:28.580163+00	3	55100
4	Proposal 4	https://cardano.ideascale.com/a/dtd/422294-48088	900006	2023-03-01 00:00:00	2022-11-10 16:35:28.580163+00	1	12000
5	Proposal 5	https://cardano.ideascale.com/a/dtd/419167-48088	900007	2023-06-30 00:00:00	2022-11-10 16:35:28.580163+00	2	160000
6	Proposal 6	https://cardano.ideascale.com/a/dtd/418759-48088	900008	2023-04-01 00:00:00	2022-11-10 16:35:28.580163+00	3	85100
\.


-- ALTER TABLE public.users OWNER TO supabase_admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- Name: challenges_users challenges_users_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.challenges_users
    ADD CONSTRAINT challenges_users_pkey PRIMARY KEY (id);


--
-- Name: funds funds_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.funds
    ADD CONSTRAINT funds_pkey PRIMARY KEY (id);


--
-- Name: poas poas_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.poas
    ADD CONSTRAINT poas_pkey PRIMARY KEY (id);


--
-- Name: poas_reviews poas_review_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.poas_reviews
    ADD CONSTRAINT poas_review_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: proposals_users proposals_users_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.proposals_users
    ADD CONSTRAINT proposals_users_pkey PRIMARY KEY (id);


--
-- Name: allocations allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_pkey PRIMARY KEY (id);


--
-- Name: signoffs signoffs_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.signoffs
    ADD CONSTRAINT signoffs_pkey PRIMARY KEY (id);


--
-- Name: som_reviews som_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.som_reviews
    ADD CONSTRAINT som_reviews_pkey PRIMARY KEY (id);


--
-- Name: soms soms_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.soms
    ADD CONSTRAINT soms_pkey PRIMARY KEY (id);


--
-- Name: users users__auth_user_id_key; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users__auth_user_id_key UNIQUE (_auth_user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: challenges challenges_fund_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_fund_id_fkey FOREIGN KEY (fund_id) REFERENCES public.funds(id);


--
-- Name: challenges_users challenges_users_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.challenges_users
    ADD CONSTRAINT challenges_users_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id);


--
-- Name: challenges_users challenges_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.challenges_users
    ADD CONSTRAINT challenges_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: challenges_users challenges_users_user_idd_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.challenges_users
    ADD CONSTRAINT challenges_users_user_idd_fkey FOREIGN KEY (user_idd) REFERENCES public.users(id);


--
-- Name: poas poas_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.poas
    ADD CONSTRAINT poas_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id);


--
-- Name: poas poas_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.poas
    ADD CONSTRAINT poas_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(id);


--
-- Name: poas_reviews poas_reviews_poas_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.poas_reviews
    ADD CONSTRAINT poas_reviews_poas_id_fkey FOREIGN KEY (poas_id) REFERENCES public.poas(id);


--
-- Name: poas_reviews poas_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.poas_reviews
    ADD CONSTRAINT poas_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(_auth_user_id);


--
-- Name: poas poas_som_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.poas
    ADD CONSTRAINT poas_som_id_fkey FOREIGN KEY (som_id) REFERENCES public.soms(id);


--
-- Name: poas poas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.poas
    ADD CONSTRAINT poas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(_auth_user_id);


--
-- Name: proposals proposals_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id);


--
-- Name: proposals_users proposals_users_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.proposals_users
    ADD CONSTRAINT proposals_users_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(id);


--
-- Name: proposals_users proposals_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.proposals_users
    ADD CONSTRAINT proposals_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: proposals_users proposals_users_user_idd_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.proposals_users
    ADD CONSTRAINT proposals_users_user_idd_fkey FOREIGN KEY (user_idd) REFERENCES public.users(id);


--
-- Name: allocations allocations_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(id);


--
-- Name: allocations allocations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: allocations allocations_user_idd_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_user_idd_fkey FOREIGN KEY (user_idd) REFERENCES public.users(id);


--
-- Name: signoffs signoffs_poa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.signoffs
    ADD CONSTRAINT signoffs_poa_id_fkey FOREIGN KEY (poa_id) REFERENCES public.poas(id);


--
-- Name: signoffs signoffs_som_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.signoffs
    ADD CONSTRAINT signoffs_som_id_fkey FOREIGN KEY (som_id) REFERENCES public.soms(id);


--
-- Name: signoffs signoffs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.signoffs
    ADD CONSTRAINT signoffs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(_auth_user_id);


--
-- Name: som_reviews som_reviews_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.som_reviews
    ADD CONSTRAINT som_reviews_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id);


--
-- Name: som_reviews som_reviews_som_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.som_reviews
    ADD CONSTRAINT som_reviews_som_id_fkey FOREIGN KEY (som_id) REFERENCES public.soms(id);


--
-- Name: som_reviews som_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.som_reviews
    ADD CONSTRAINT som_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(_auth_user_id);


--
-- Name: soms soms_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.soms
    ADD CONSTRAINT soms_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id);


--
-- Name: soms soms_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.soms
    ADD CONSTRAINT soms_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(id);


--
-- Name: soms soms_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.soms
    ADD CONSTRAINT soms_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(_auth_user_id);


--
-- Name: users users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: challenges_users Admin insert; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Admin insert" ON public.challenges_users FOR INSERT WITH CHECK ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3)))));


--
-- Name: poas_reviews CT member; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "CT member" ON public.poas_reviews FOR INSERT WITH CHECK ((EXISTS ( SELECT challenges_users.user_id
   FROM public.challenges_users
  WHERE ((challenges_users.user_id = auth.uid()) AND (challenges_users.challenge_id IN ( SELECT poas.challenge_id
           FROM public.poas
          WHERE (poas.id = poas_reviews.poas_id)))))));


--
-- Name: som_reviews CT member (real); Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "CT member (real)" ON public.som_reviews FOR INSERT WITH CHECK (((EXISTS ( SELECT challenges_users.user_id
   FROM public.challenges_users
  WHERE ((challenges_users.user_id = auth.uid()) AND (challenges_users.challenge_id IN ( SELECT soms.challenge_id
           FROM public.soms
          WHERE (soms.id = som_reviews.som_id)))))) OR (EXISTS ( SELECT users.user_id
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3))))));


--
-- Name: proposals_users Delete admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Delete admin" ON public.proposals_users FOR DELETE USING ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3)))));


--
-- Name: allocations Delete admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Delete admin" ON public.allocations FOR DELETE USING ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3)))));


--
-- Name: poas_reviews IO member; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "IO member" ON public.poas_reviews FOR INSERT WITH CHECK ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 2)))));


--
-- Name: som_reviews IO member; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "IO member" ON public.som_reviews FOR INSERT WITH CHECK ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 2)))));


--
-- Name: poas Proposal owner; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Proposal owner" ON public.poas FOR INSERT WITH CHECK (((EXISTS ( SELECT proposals_users.user_id
   FROM public.proposals_users
  WHERE ((proposals_users.user_id = auth.uid()) AND (proposals_users.proposal_id = poas.proposal_id)))) OR (EXISTS ( SELECT users.user_id
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3))))));


--
-- Name: soms Proposal owner insert; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Proposal owner insert" ON public.soms FOR INSERT WITH CHECK (((EXISTS ( SELECT proposals_users.user_id
   FROM public.proposals_users
  WHERE ((proposals_users.user_id = auth.uid()) AND (proposals_users.proposal_id = soms.proposal_id)))) OR (EXISTS ( SELECT users.user_id
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3))))));


--
-- Name: poas_reviews Public list; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Public list" ON public.poas_reviews FOR SELECT USING (true);


--
-- Name: funds Public select; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Public select" ON public.funds FOR SELECT USING (true);


--
-- Name: challenges Public visible; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Public visible" ON public.challenges FOR SELECT USING (true);


--
-- Name: challenges_users Select public; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Select public" ON public.challenges_users FOR SELECT USING (true);


--
-- Name: signoffs admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY admin ON public.signoffs FOR UPDATE USING ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3))))) WITH CHECK ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3)))));


--
-- Name: signoffs admin / signoff; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "admin / signoff" ON public.signoffs FOR INSERT WITH CHECK ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND ((users.role = 4) OR (users.role = 3))))));


--
-- Name: challenges; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: challenges_users; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.challenges_users ENABLE ROW LEVEL SECURITY;

--
-- Name: challenges_users delete admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "delete admin" ON public.challenges_users FOR DELETE USING ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3)))));


--
-- Name: signoffs delete admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "delete admin" ON public.signoffs FOR DELETE USING ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3)))));


--
-- Name: funds; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;

--
-- Name: proposals_users insert admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "insert admin" ON public.proposals_users FOR INSERT WITH CHECK ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3)))));


--
-- Name: allocations insert admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "insert admin" ON public.allocations FOR INSERT WITH CHECK ((EXISTS ( SELECT users.user_id,
    users.role
   FROM public.users
  WHERE ((users.user_id = auth.uid()) AND (users.role = 3)))));


--
-- Name: poas; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.poas ENABLE ROW LEVEL SECURITY;

--
-- Name: poas_reviews; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.poas_reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: proposals; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

--
-- Name: proposals_users; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.proposals_users ENABLE ROW LEVEL SECURITY;

--
-- Name: allocations; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;

--
-- Name: poas public; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY public ON public.poas FOR SELECT USING (true);


--
-- Name: proposals public; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY public ON public.proposals FOR SELECT USING (true);


--
-- Name: signoffs public; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY public ON public.signoffs FOR SELECT USING (true);


--
-- Name: som_reviews public; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY public ON public.som_reviews FOR SELECT USING (true);


--
-- Name: soms public; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY public ON public.soms FOR SELECT USING (true);


--
-- Name: users public; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY public ON public.users FOR SELECT USING (true);


--
-- Name: proposals_users public select; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "public select" ON public.proposals_users FOR SELECT USING (true);


--
-- Name: allocations public select; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "public select" ON public.allocations FOR SELECT USING (true);


--
-- Name: signoffs; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.signoffs ENABLE ROW LEVEL SECURITY;

--
-- Name: som_reviews; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.som_reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: soms; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.soms ENABLE ROW LEVEL SECURITY;

--
-- Name: users update public; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "update public" ON public.users FOR UPDATE USING ((EXISTS ( SELECT users_1.user_id,
    users_1.role
   FROM public.users users_1
  WHERE ((users_1.user_id = auth.uid()) AND (users_1.role = 3))))) WITH CHECK ((EXISTS ( SELECT users_1.user_id,
    users_1.role
   FROM public.users users_1
  WHERE ((users_1.user_id = auth.uid()) AND (users_1.role = 3)))));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION create_user(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.create_user() TO postgres;
GRANT ALL ON FUNCTION public.create_user() TO anon;
GRANT ALL ON FUNCTION public.create_user() TO authenticated;
GRANT ALL ON FUNCTION public.create_user() TO service_role;


--
-- Name: FUNCTION getmilestones(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.getmilestones() TO postgres;
GRANT ALL ON FUNCTION public.getmilestones() TO anon;
GRANT ALL ON FUNCTION public.getmilestones() TO authenticated;
GRANT ALL ON FUNCTION public.getmilestones() TO service_role;


--
-- Name: TABLE challenges; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.challenges TO postgres;
GRANT ALL ON TABLE public.challenges TO anon;
GRANT ALL ON TABLE public.challenges TO authenticated;
GRANT ALL ON TABLE public.challenges TO service_role;


--
-- Name: SEQUENCE challenges_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.challenges_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.challenges_id_seq TO anon;
GRANT ALL ON SEQUENCE public.challenges_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.challenges_id_seq TO service_role;


--
-- Name: TABLE challenges_users; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.challenges_users TO postgres;
GRANT ALL ON TABLE public.challenges_users TO anon;
GRANT ALL ON TABLE public.challenges_users TO authenticated;
GRANT ALL ON TABLE public.challenges_users TO service_role;


--
-- Name: SEQUENCE challenges_users_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.challenges_users_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.challenges_users_id_seq TO anon;
GRANT ALL ON SEQUENCE public.challenges_users_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.challenges_users_id_seq TO service_role;


--
-- Name: TABLE funds; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.funds TO postgres;
GRANT ALL ON TABLE public.funds TO anon;
GRANT ALL ON TABLE public.funds TO authenticated;
GRANT ALL ON TABLE public.funds TO service_role;


--
-- Name: SEQUENCE funds_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.funds_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.funds_id_seq TO anon;
GRANT ALL ON SEQUENCE public.funds_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.funds_id_seq TO service_role;


--
-- Name: TABLE poas; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.poas TO postgres;
GRANT ALL ON TABLE public.poas TO anon;
GRANT ALL ON TABLE public.poas TO authenticated;
GRANT ALL ON TABLE public.poas TO service_role;


--
-- Name: SEQUENCE poas_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.poas_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.poas_id_seq TO anon;
GRANT ALL ON SEQUENCE public.poas_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.poas_id_seq TO service_role;


--
-- Name: TABLE poas_reviews; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.poas_reviews TO postgres;
GRANT ALL ON TABLE public.poas_reviews TO anon;
GRANT ALL ON TABLE public.poas_reviews TO authenticated;
GRANT ALL ON TABLE public.poas_reviews TO service_role;


--
-- Name: SEQUENCE poas_review_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.poas_review_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.poas_review_id_seq TO anon;
GRANT ALL ON SEQUENCE public.poas_review_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.poas_review_id_seq TO service_role;


--
-- Name: TABLE proposals; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.proposals TO postgres;
GRANT ALL ON TABLE public.proposals TO anon;
GRANT ALL ON TABLE public.proposals TO authenticated;
GRANT ALL ON TABLE public.proposals TO service_role;


--
-- Name: SEQUENCE proposals_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.proposals_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.proposals_id_seq TO anon;
GRANT ALL ON SEQUENCE public.proposals_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.proposals_id_seq TO service_role;


--
-- Name: TABLE proposals_users; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.proposals_users TO postgres;
GRANT ALL ON TABLE public.proposals_users TO anon;
GRANT ALL ON TABLE public.proposals_users TO authenticated;
GRANT ALL ON TABLE public.proposals_users TO service_role;


--
-- Name: SEQUENCE proposals_users_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.proposals_users_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.proposals_users_id_seq TO anon;
GRANT ALL ON SEQUENCE public.proposals_users_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.proposals_users_id_seq TO service_role;


--
-- Name: TABLE allocations; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.allocations TO postgres;
GRANT ALL ON TABLE public.allocations TO anon;
GRANT ALL ON TABLE public.allocations TO authenticated;
GRANT ALL ON TABLE public.allocations TO service_role;


--
-- Name: SEQUENCE allocations_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.allocations_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.allocations_id_seq TO anon;
GRANT ALL ON SEQUENCE public.allocations_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.allocations_id_seq TO service_role;


--
-- Name: TABLE signoffs; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.signoffs TO postgres;
GRANT ALL ON TABLE public.signoffs TO anon;
GRANT ALL ON TABLE public.signoffs TO authenticated;
GRANT ALL ON TABLE public.signoffs TO service_role;


--
-- Name: SEQUENCE signoffs_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.signoffs_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.signoffs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.signoffs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.signoffs_id_seq TO service_role;


--
-- Name: TABLE som_reviews; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.som_reviews TO postgres;
GRANT ALL ON TABLE public.som_reviews TO anon;
GRANT ALL ON TABLE public.som_reviews TO authenticated;
GRANT ALL ON TABLE public.som_reviews TO service_role;


--
-- Name: SEQUENCE som_reviews_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.som_reviews_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.som_reviews_id_seq TO anon;
GRANT ALL ON SEQUENCE public.som_reviews_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.som_reviews_id_seq TO service_role;


--
-- Name: TABLE soms; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.soms TO postgres;
GRANT ALL ON TABLE public.soms TO anon;
GRANT ALL ON TABLE public.soms TO authenticated;
GRANT ALL ON TABLE public.soms TO service_role;


--
-- Name: SEQUENCE soms_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.soms_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.soms_id_seq TO anon;
GRANT ALL ON SEQUENCE public.soms_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.soms_id_seq TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.users TO postgres;
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.users_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.users_id_seq TO anon;
GRANT ALL ON SEQUENCE public.users_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.users_id_seq TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- PostgreSQL database dump complete
--

--
-- Add required Postegres FUNCTIONS AND TRIGGERS
--

-- getMilestones FUNCTION

CREATE OR REPLACE FUNCTION public.getMilestones() RETURNS TABLE(title varchar, project_id bigint, budget bigint, id bigint, proposal_id bigint, milestone bigint) AS $$
    BEGIN
        RETURN QUERY
            SELECT DISTINCT ON (soms.proposal_id, soms.milestone)
            proposals.title, proposals.project_id, proposals.budget,
            soms.id, soms.proposal_id, soms.milestone
            FROM soms
            LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
            ORDER BY soms.proposal_id, soms.milestone, soms.created_at DESC;
    end;
$$ LANGUAGE plpgsql;


-- createUser FUNCTION

create or replace function public.create_user()
returns trigger as $$
begin
  insert into public.users(user_id, _auth_user_id, email, role)
  values (new.id, new.id, new.email, 0);
  return new;
end;
$$ language plpgsql;

-- trigger

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_user();

-- SEED USERS

INSERT INTO auth.users (id, email, encrypted_password, instance_id, aud, role, confirmation_sent_at, raw_app_meta_data, created_at, updated_at, confirmed_at, invited_at, confirmation_token, recovery_token, email_change, raw_user_meta_data, email_change_token)
  VALUES
    (gen_random_uuid(), 'admin@example.org', '$2a$10$I/tkOhdTJFF63NhXLCcoI.Izp8nIns0OIn73dct3k7bNKoFUjCEWu', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '2022-11-25 12:01:31.354313+00', '{"provider":"email","providers":["email"]}', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '', '', '', '{}', ''),
    (gen_random_uuid(), 'challenge-team-1@example.org', '$2a$10$I/tkOhdTJFF63NhXLCcoI.Izp8nIns0OIn73dct3k7bNKoFUjCEWu', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '2022-11-25 12:01:31.354313+00', '{"provider":"email","providers":["email"]}', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '', '', '', '{}', ''),
    (gen_random_uuid(), 'challenge-team-2@example.org', '$2a$10$I/tkOhdTJFF63NhXLCcoI.Izp8nIns0OIn73dct3k7bNKoFUjCEWu', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '2022-11-25 12:01:31.354313+00', '{"provider":"email","providers":["email"]}', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '', '', '', '{}', ''),
    (gen_random_uuid(), 'proposer-1@example.org', '$2a$10$I/tkOhdTJFF63NhXLCcoI.Izp8nIns0OIn73dct3k7bNKoFUjCEWu', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '2022-11-25 12:01:31.354313+00', '{"provider":"email","providers":["email"]}', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '', '', '', '{}', ''),
    (gen_random_uuid(), 'proposer-2@example.org', '$2a$10$I/tkOhdTJFF63NhXLCcoI.Izp8nIns0OIn73dct3k7bNKoFUjCEWu', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '2022-11-25 12:01:31.354313+00', '{"provider":"email","providers":["email"]}', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '', '', '', '{}', ''),
    (gen_random_uuid(), 'iog@example.org', '$2a$10$I/tkOhdTJFF63NhXLCcoI.Izp8nIns0OIn73dct3k7bNKoFUjCEWu', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '2022-11-25 12:01:31.354313+00', '{"provider":"email","providers":["email"]}', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '', '', '', '{}', ''),
    (gen_random_uuid(), 'signoff@example.org', '$2a$10$I/tkOhdTJFF63NhXLCcoI.Izp8nIns0OIn73dct3k7bNKoFUjCEWu', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '2022-11-25 12:01:31.354313+00', '{"provider":"email","providers":["email"]}', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '2022-11-25 12:01:31.351593+00', '', '', '', '{}', '');

UPDATE public.users SET role = 1 WHERE email = 'challenge-team-1@example.org' OR email = 'challenge-team-2@example.org';
UPDATE public.users SET role = 2 WHERE email = 'iog@example.org';
UPDATE public.users SET role = 3 WHERE email = 'admin@example.org';
UPDATE public.users SET role = 4 WHERE email = 'signoff@example.org';

INSERT INTO public.challenges_users (challenge_id, user_id, user_idd)
  VALUES
    (1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1), (SELECT id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1)),
    (2, (SELECT user_id FROM public.users WHERE email = 'challenge-team-2@example.org' LIMIT 1), (SELECT id FROM public.users WHERE email = 'challenge-team-2@example.org' LIMIT 1));

INSERT INTO public.proposals_users (proposal_id, user_id, user_idd)
  VALUES
    (1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), (SELECT id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1)),
    (2, (SELECT user_id FROM public.users WHERE email = 'proposer-2@example.org' LIMIT 1), (SELECT id FROM public.users WHERE email = 'proposer-2@example.org' LIMIT 1)),
    (4, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), (SELECT id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1)),
    (5, (SELECT user_id FROM public.users WHERE email = 'proposer-2@example.org' LIMIT 1), (SELECT id FROM public.users WHERE email = 'proposer-2@example.org' LIMIT 1));

INSERT INTO public.soms (outputs, success_criteria, evidence, month, cost, completion, proposal_id, milestone, title, challenge_id, user_id)
  VALUES
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 1, 'Title ipsum', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1)),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 1, 'Title ipsum 2 try', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1)),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 2, 'Title ipsum 2', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1)),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 3, 'Title ipsum 3', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1)),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 4, 'Title ipsum 4', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1)),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 5, 'Title ipsum 5', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1));

INSERT INTO public.som_reviews (outputs_approves, outputs_comment, success_criteria_approves, success_criteria_comment, evidence_approves, evidence_comment, som_id, challenge_id, user_id)
  VALUES
    (true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', 3, 1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1)),
    (true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', 4, 1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1)),
    (true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', 5, 1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1)),
    (true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', 6, 1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1));

INSERT INTO public.signoffs (som_id, user_id)
  VALUES
    (4, (SELECT user_id FROM public.users WHERE email = 'signoff@example.org' LIMIT 1)),
    (5, (SELECT user_id FROM public.users WHERE email = 'signoff@example.org' LIMIT 1)),
    (6, (SELECT user_id FROM public.users WHERE email = 'signoff@example.org' LIMIT 1));

INSERT INTO public.poas (content, proposal_id, som_id, challenge_id, user_id)
  VALUES
    ('Lorem ipsum dolor sit amet', 1, 5, 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1)),
    ('Lorem ipsum dolor sit amet', 1, 6, 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1));

INSERT INTO public.poas_reviews (content_approved, content_comment, poas_id, user_id)
  VALUES
    (true, 'Lorem ipsum dolor sit amet', 2, (SELECT user_id FROM public.users WHERE email = 'iog@example.org' LIMIT 1));

INSERT INTO public.signoffs (poa_id, user_id)
  VALUES
    (2, (SELECT user_id FROM public.users WHERE email = 'signoff@example.org' LIMIT 1));
