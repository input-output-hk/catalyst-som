drop function if exists "public"."getproposalsnapshot"(_project_id bigint);

drop function if exists "public"."getproposalssnapshot"(_fund character varying);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.getproposalsnapshot(_project_id bigint)
 RETURNS TABLE(title character varying, project_id bigint, budget bigint, funds_distributed double precision, status bigint, milestones_qty bigint, id bigint, milestone bigint, month bigint, cost bigint, completion bigint, poas_id bigint, som_signoff_count bigint, poa_signoff_count bigint)
 LANGUAGE plpgsql
AS $function$
  BEGIN
    RETURN QUERY
      SELECT distinct on (soms.proposal_id, soms.milestone)
      proposals.title, proposals.project_id, proposals.budget,
      proposals.funds_distributed, proposals.status, proposals.milestones_qty,
      soms.id, soms.milestone, CAST(soms.month as bigint), soms.cost, soms.completion,
      poas.id as poas_id,
      COUNT(ss.id) as som_signoff_count, COUNT(sp.id) as poa_signoff_count
      FROM soms
      LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
      LEFT OUTER JOIN signoffs ss ON soms.id = ss.som_id
      LEFT OUTER JOIN poas ON soms.id = poas.som_id AND poas.current = true
      LEFT OUTER JOIN signoffs sp ON poas.id = sp.poa_id
      WHERE soms.current = true AND proposals.project_id = _project_id
      GROUP BY proposals.title, proposals.project_id, proposals.budget,
      proposals.funds_distributed, proposals.status, proposals.milestones_qty, soms.id, soms.milestone, poas_id, poas.id
      ORDER BY soms.proposal_id ASC, soms.milestone ASC;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.getproposalssnapshot(_fund character varying)
 RETURNS TABLE(title character varying, project_id bigint, budget bigint, funds_distributed double precision, status bigint, milestones_qty bigint, id bigint, milestone bigint, month bigint, cost bigint, completion bigint, poas_id bigint, som_signoff_count bigint, poa_signoff_count bigint)
 LANGUAGE plpgsql
AS $function$
  BEGIN
    RETURN QUERY
      SELECT distinct on (soms.proposal_id, soms.milestone)
      proposals.title, proposals.project_id, proposals.budget,
      proposals.funds_distributed, proposals.status, proposals.milestones_qty,
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
      proposals.funds_distributed, proposals.milestones_qty, soms.id, soms.milestone, poas_id, poas.id
      ORDER BY soms.proposal_id ASC, soms.milestone ASC;
  end;
$function$
;


