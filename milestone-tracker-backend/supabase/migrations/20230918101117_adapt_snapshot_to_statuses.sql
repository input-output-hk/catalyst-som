drop function if exists "public"."getproposalsnapshot"(_project_id bigint);

drop function if exists "public"."getproposalssnapshot"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.getproposalsnapshot(_project_id bigint)
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
      LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
      LEFT OUTER JOIN signoffs ss ON soms.id = ss.som_id
      LEFT OUTER JOIN poas ON soms.id = poas.som_id AND poas.current = true
      LEFT OUTER JOIN signoffs sp ON poas.id = sp.poa_id
      WHERE soms.current = true AND proposals.project_id = _project_id
      GROUP BY proposals.title, proposals.project_id, proposals.budget,
      proposals.funds_distributed, proposals.status, soms.id, soms.milestone, poas_id, poas.id
      ORDER BY soms.proposal_id ASC, soms.milestone ASC;
  end;
$function$
;

ALTER FUNCTION public.getproposalsnapshot(bigint) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO anon;
GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO postgres;
GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO service_role;

CREATE OR REPLACE FUNCTION public.getproposalssnapshot()
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
      LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
      LEFT OUTER JOIN signoffs ss ON soms.id = ss.som_id
      LEFT OUTER JOIN poas ON soms.id = poas.som_id AND poas.current = true
      LEFT OUTER JOIN signoffs sp ON poas.id = sp.poa_id
      WHERE soms.current = true
      GROUP BY proposals.title, proposals.project_id, proposals.budget, proposals.status,
      proposals.funds_distributed, soms.id, soms.milestone, poas_id, poas.id
      ORDER BY soms.proposal_id ASC, soms.milestone ASC;
  end;
$function$
;

ALTER FUNCTION public.getproposalssnapshot() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO anon;
GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO authenticated;
GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO postgres;
GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO service_role;
