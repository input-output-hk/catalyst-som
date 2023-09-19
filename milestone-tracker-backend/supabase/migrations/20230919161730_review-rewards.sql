alter table "public"."users" add column "payment_received" jsonb not null default '{}'::jsonb;

drop function if exists "public"."getproposalssnapshot"();
drop function if exists "public"."getsubmittedpoareviews"(_fund character varying, _from timestamp without time zone, _to timestamp without time zone);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.getsubmittedpoareviews(_fund character varying, _from timestamp without time zone, _to timestamp without time zone)
 RETURNS TABLE(project_id bigint, title character varying, latest_poa_id bigint, latest_poa_reviewed_at timestamp with time zone, email character varying, milestone bigint)
 LANGUAGE plpgsql
AS $function$
  BEGIN
    RETURN QUERY
      SELECT proposals.project_id, proposals.title, MAX(poas_reviews.poas_id) as latest_poa_id, MAX(poas_reviews.created_at) as latest_poa_reviewed_at, users.email, soms.milestone
      from poas_reviews
      INNER JOIN users
      ON poas_reviews.user_id = users._auth_user_id
      INNER JOIN poas
      ON poas_reviews.poas_id = poas.id
      INNER JOIN soms
      ON poas.som_id = soms.id
      INNER JOIN proposals
      ON soms.proposal_id = proposals.id
      INNER JOIN challenges
      ON proposals.challenge_id = challenges.id
      INNER JOIN funds
      ON challenges.fund_id = funds.id
      WHERE poas_reviews.created_at > _from AND
      poas_reviews.created_at < _to AND
      poas_reviews.role = 1 AND
      funds.title = _fund
      GROUP BY proposals.project_id, proposals.title, soms.milestone, users.email;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.getproposalssnapshot(_fund character varying)
 RETURNS TABLE(title character varying, project_id bigint, budget bigint, funds_distributed double precision, status bigint, id bigint, milestone bigint, month bigint, cost bigint, completion bigint, poas_id bigint, som_signoff_count bigint, poa_signoff_count bigint)
 LANGUAGE plpgsql
AS $function$
  BEGIN
    RETURN QUERY
      SELECT distinct on (soms.proposal_id, soms.milestone)
      proposals.title, proposals.project_id, proposals.budget,
      proposals.funds_distributed, proposals.status,
      soms.id, soms.milestone, CAST(soms.month as bigint), soms.cost, soms.completion,
      poas.id as poas_id,
      COUNT(ss.id) as som_signoff_count, COUNT(sp.id) as poa_signoff_count
      FROM soms
      INNER JOIN proposals ON soms.proposal_id = proposals.id
      INNER JOIN challenges ON proposals.challenge_id = challenges.id
      INNER JOIN funds ON challenges.fund_id = funds.id
      LEFT OUTER JOIN signoffs ss ON soms.id = ss.som_id
      LEFT OUTER JOIN poas ON soms.id = poas.som_id AND poas.current = true
      LEFT OUTER JOIN signoffs sp ON poas.id = sp.poa_id
      WHERE soms.current = true AND funds.title = _fund
      GROUP BY proposals.title, proposals.project_id, proposals.budget, proposals.status,
      proposals.funds_distributed, soms.id, soms.milestone, poas_id, poas.id
      ORDER BY soms.proposal_id ASC, soms.milestone ASC;
  end;
$function$
;

