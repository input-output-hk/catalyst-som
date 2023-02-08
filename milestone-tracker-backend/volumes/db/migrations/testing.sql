INSERT INTO public.funds (id, title, created_at) VALUES
(1, 'Fund 9', '2022-10-07 19:32:37.42443+00');


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

INSERT INTO public.challenges (id, title, created_at, fund_id) VALUES
  (1, 'Dapps, Products & Integrations', '2022-10-07 19:32:55.117372+00', 1),
  (2, 'The Great Migration (from Ethereum)','2022-11-10 14:19:40.645101+00', 1),
  (3, 'Cross-Chain Collaboration', '2022-11-10 14:19:58.366977+00', 1),
  (4, 'DAOs <3 Cardano', '2022-11-10 14:20:21.012715+00',	1),
  (5, 'Grow Africa, Grow Cardano', '2022-11-10 14:20:40.23063+00', 1),
  (6, 'Legal & Financial Implementations', '2022-11-10 14:20:54.863976+00', 1),
  (7, 'Developer Ecosystem', '2022-11-10 14:21:19.367882+00', 1);

--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

INSERT INTO public.proposals (id, title, url, project_id, completion_date, created_at, challenge_id, budget) VALUES
  (1, 'Proposal 1', 'https://cardano.ideascale.com/a/dtd/422294-48088', 900002, '2023-03-01 00:00:00', '2022-11-10 16:35:28.580163+00', 1, 22000),
  (2, 'Proposal 2', 'https://cardano.ideascale.com/a/dtd/419167-48088', 900003,	'2023-06-30 00:00:00', '2022-11-10 16:35:28.580163+00', 2, 120000),
  (3, 'Proposal 3', 'https://cardano.ideascale.com/a/dtd/418759-48088', 900005, '2023-04-01 00:00:00', '2022-11-10 16:35:28.580163+00', 3, 55100),
  (4, 'Proposal 4',	'https://cardano.ideascale.com/a/dtd/422294-48088', 900006, '2023-03-01 00:00:00', '2022-11-10 16:35:28.580163+00', 1, 12000),
  (5, 'Proposal 5', 'https://cardano.ideascale.com/a/dtd/419167-48088', 900007, '2023-06-30 00:00:00', '2022-11-10 16:35:28.580163+00', 2, 160000),
  (6, 'Proposal 6', 'https://cardano.ideascale.com/a/dtd/418759-48088', 900008, '2023-04-01 00:00:00', '2022-11-10 16:35:28.580163+00', 3, 85100);


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

INSERT INTO public.soms (outputs, success_criteria, evidence, month, cost, completion, proposal_id, milestone, title, challenge_id, user_id, current)
  VALUES
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 1, 'Title ipsum', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), false),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 1, 'Title ipsum 2 try', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), true),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 2, 'Title ipsum 2', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), true),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 3, 'Title ipsum 3', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), true),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 4, 'Title ipsum 4', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), true),
    ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', '3', 10000, 30, 1, 5, 'Title ipsum 5', 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), true);

INSERT INTO public.som_reviews (outputs_approves, outputs_comment, success_criteria_approves, success_criteria_comment, evidence_approves, evidence_comment, som_id, challenge_id, user_id)
  VALUES
    (true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', 2, 1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1)),
    (true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', 3, 1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1)),
    (true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', 4, 1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1)),
    (true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', true, 'Lorem ipsum dolor sit amet', 5, 1, (SELECT user_id FROM public.users WHERE email = 'challenge-team-1@example.org' LIMIT 1));

INSERT INTO public.signoffs (som_id, user_id)
  VALUES
    (2, (SELECT user_id FROM public.users WHERE email = 'signoff@example.org' LIMIT 1)),
    (3, (SELECT user_id FROM public.users WHERE email = 'signoff@example.org' LIMIT 1)),
    (4, (SELECT user_id FROM public.users WHERE email = 'signoff@example.org' LIMIT 1));

INSERT INTO public.poas (content, proposal_id, som_id, challenge_id, user_id, current)
  VALUES
    ('Lorem ipsum dolor sit amet', 1, 2, 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), true),
    ('Lorem ipsum dolor sit amet', 1, 3, 1, (SELECT user_id FROM public.users WHERE email = 'proposer-1@example.org' LIMIT 1), true);

INSERT INTO public.poas_reviews (content_approved, content_comment, poas_id, user_id)
  VALUES
    (true, 'Lorem ipsum dolor sit amet', 1, (SELECT user_id FROM public.users WHERE email = 'iog@example.org' LIMIT 1));

INSERT INTO public.signoffs (poa_id, user_id)
  VALUES
    (1, (SELECT user_id FROM public.users WHERE email = 'signoff@example.org' LIMIT 1));
