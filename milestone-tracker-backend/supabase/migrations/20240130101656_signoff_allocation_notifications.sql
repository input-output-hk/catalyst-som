set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.getpoastobesignedoff(_from timestamp without time zone, _min_nr_reviews bigint, _max_nr_reviews bigint, _min_nr_approvals bigint, _max_nr_approvals bigint)
 RETURNS TABLE(project_id bigint, title character varying, milestone bigint, created_at timestamp with time zone, nr_reviews bigint, nr_approvals bigint)
 LANGUAGE plpgsql
AS $function$
    BEGIN
        RETURN QUERY
          SELECT proposals.project_id, proposals.title, soms.milestone, poas.created_at, count(distinct poas_reviews.id) as pp, count(poas_reviews.content_approved) filter (where poas_reviews.content_approved) FROM poas
            LEFT OUTER JOIN poas_reviews ON poas.id = poas_reviews.poas_id
            LEFT OUTER JOIN soms ON poas.som_id = soms.id
            LEFT OUTER JOIN signoffs ON signoffs.poa_id = poas.id
            LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
            LEFT OUTER JOIN allocations_signoff ON allocations_signoff.proposal_id = proposals.id
            WHERE
            (
              allocations_signoff.user_id = auth.uid() OR
              ((SELECT role FROM users where user_id = auth.uid()) IN (2, 3))
            ) AND
            soms.current = true AND 
            poas.current = true AND
            (poas_reviews.current = true OR (_min_nr_reviews = 0)) AND 
            poas.created_at >= _from
            GROUP by proposals.project_id, proposals.title, soms.milestone, poas.created_at
            HAVING (
              count(distinct signoffs.id) = 0 AND
              count(distinct poas_reviews.id) >= _min_nr_reviews AND
              count(distinct poas_reviews.id) <= _max_nr_reviews AND
              count(distinct poas_reviews.content_approved) filter (where poas_reviews.content_approved) >= _min_nr_approvals AND
              count(distinct poas_reviews.content_approved) filter (where poas_reviews.content_approved) <= _max_nr_approvals
            );
    END;
$function$
;

CREATE OR REPLACE FUNCTION public.getsomstobesignedoff(_from timestamp without time zone, _min_nr_reviews bigint, _max_nr_reviews bigint, _min_nr_approvals bigint, _max_nr_approvals bigint)
 RETURNS TABLE(project_id bigint, title character varying, milestone bigint, created_at timestamp with time zone, nr_reviews bigint, nr_approvals bigint)
 LANGUAGE plpgsql
AS $function$
    BEGIN
        RETURN QUERY
          SELECT proposals.project_id,
              proposals.title,
              soms.milestone,
              soms.created_at,
              count(distinct som_reviews.id) as sr,
              count(som_reviews.id) filter (
                where som_reviews.success_criteria_approves AND
                som_reviews.evidence_approves AND
                som_reviews.outputs_approves
              ) as sa
              FROM soms
            LEFT OUTER JOIN som_reviews ON soms.id = som_reviews.som_id
            LEFT OUTER JOIN signoffs ON signoffs.som_id = soms.id
            LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
            LEFT OUTER JOIN allocations_signoff ON allocations_signoff.proposal_id = proposals.id
            WHERE 
            (
              allocations_signoff.user_id = auth.uid() OR
              ((SELECT role FROM users where user_id = auth.uid()) IN (2, 3))
            ) AND
            soms.current = true AND 
            som_reviews.current = true AND 
            soms.created_at >= _from
            GROUP by proposals.project_id, proposals.title, soms.milestone, soms.created_at
            HAVING (
              count(distinct signoffs.id) = 0 AND
              count(distinct som_reviews.id) >= _min_nr_reviews AND
              count(distinct som_reviews.id) <= _max_nr_reviews AND
              count(som_reviews.id) filter (
                where som_reviews.success_criteria_approves AND
                som_reviews.evidence_approves AND
                som_reviews.outputs_approves
              ) >= _min_nr_approvals AND
              count(som_reviews.id) filter (
                where som_reviews.success_criteria_approves AND
                som_reviews.evidence_approves AND
                som_reviews.outputs_approves
              ) <= _max_nr_approvals
            );
    END;
$function$
;


