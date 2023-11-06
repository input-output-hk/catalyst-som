set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.getsubmittedsomreviews(_fund character varying, _from timestamp without time zone, _to timestamp without time zone)
 RETURNS TABLE(project_id bigint, title character varying, milestones_reviewed_qty bigint, latest_som_id bigint, latest_som_reviewed_at timestamp with time zone, email character varying, milestones_qty bigint, signoffs_count bigint)
 LANGUAGE plpgsql
AS $function$
  BEGIN
    RETURN QUERY

SELECT proposals.project_id, proposals.title, COUNT(proposals.project_id) as milestones_reviewed_qty, MAX(som_reviews.som_id) as latest_som_id, MAX(som_reviews.created_at) as latest_som_reviewed_at, users.email, proposals.milestones_qty, COUNT(signoffs.id) as signoffs_count
      from som_reviews
      INNER JOIN users
      ON som_reviews.user_id = users._auth_user_id
      INNER JOIN soms
      ON som_reviews.som_id = soms.id
      INNER JOIN signoffs
      ON soms.id = signoffs.som_id
      INNER JOIN proposals
      ON soms.proposal_id = proposals.id
      INNER JOIN challenges
      ON proposals.challenge_id = challenges.id
      INNER JOIN funds
      ON challenges.fund_id = funds.id
      WHERE som_reviews.created_at > _from AND
      som_reviews.created_at < _to AND
      som_reviews.role < 2 AND
      funds.title = _fund and
      som_reviews.current = true and
      soms.current = true and
      (som_reviews.outputs_approves = true and som_reviews.evidence_approves = true and som_reviews.success_criteria_approves = true)
      GROUP BY proposals.project_id, proposals.title, users.email, proposals.milestones_qty
      /*HAVING COUNT(signoffs.id) >= proposals.milestones_qty*/;

end;
$function$
;

ALTER FUNCTION public.getsubmittedsomreviews(character varying, timestamp without time zone, timestamp without time zone) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.getsubmittedsomreviews(character varying, timestamp without time zone, timestamp without time zone) TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.getsubmittedsomreviews(character varying, timestamp without time zone, timestamp without time zone) TO anon;
GRANT EXECUTE ON FUNCTION public.getsubmittedsomreviews(character varying, timestamp without time zone, timestamp without time zone) TO authenticated;
GRANT EXECUTE ON FUNCTION public.getsubmittedsomreviews(character varying, timestamp without time zone, timestamp without time zone) TO postgres;
GRANT EXECUTE ON FUNCTION public.getsubmittedsomreviews(character varying, timestamp without time zone, timestamp without time zone) TO service_role;
