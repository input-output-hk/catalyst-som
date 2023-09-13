CREATE OR REPLACE FUNCTION public.getproposalsnapshot(
	_project_id bigint)
    RETURNS TABLE(title character varying, project_id bigint, budget bigint, funds_distributed float, id bigint, milestone bigint, month bigint, cost bigint, completion bigint, poas_id bigint, som_signoff_count bigint, poa_signoff_count bigint)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
  BEGIN
    RETURN QUERY
      SELECT distinct on (soms.proposal_id, soms.milestone)
      proposals.title, proposals.project_id, proposals.budget,
      proposals.funds_distributed,
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
      proposals.funds_distributed, soms.id, soms.milestone, poas_id, poas.id
      ORDER BY soms.proposal_id ASC, soms.milestone ASC;
  end;
$BODY$;

ALTER FUNCTION public.getproposalsnapshot(bigint)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO anon;

GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO authenticated;

GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO postgres;

GRANT EXECUTE ON FUNCTION public.getproposalsnapshot(bigint) TO service_role;



CREATE OR REPLACE FUNCTION public.getallocatedsoms(
	)
    RETURNS TABLE(milestone bigint, proposal_id bigint, title character varying, created_at timestamp with time zone, project_id bigint, my_reviews_count bigint)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    BEGIN
        RETURN QUERY
          SELECT
              soms.milestone,
              soms.proposal_id,
              proposals.title,
              soms.created_at,
              proposals.project_id,
              count(distinct som_reviews.id) as my_reviews_count
              -- count(distinct signoffs.id) as signoffs_count
              FROM soms

                left join som_reviews
                  on som_reviews.som_id = soms.id
                  and som_reviews.user_id = auth.uid()
                left join
                  signoffs
                    on signoffs.som_id = soms.id
                left join
                  proposals
                    on proposals.id = soms.proposal_id
              where soms.proposal_id in (
                select allocations.proposal_id from allocations where allocations.user_id = auth.uid()
              )
              and soms.current = true
              group by soms.milestone, soms.proposal_id, proposals.title, soms.created_at, proposals.project_id
              having count(distinct signoffs.id) = 0
              order by soms.created_at desc;
  END;
$BODY$;

ALTER FUNCTION public.getallocatedsoms()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getallocatedsoms() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getallocatedsoms() TO anon;

GRANT EXECUTE ON FUNCTION public.getallocatedsoms() TO authenticated;

GRANT EXECUTE ON FUNCTION public.getallocatedsoms() TO postgres;

GRANT EXECUTE ON FUNCTION public.getallocatedsoms() TO service_role;



CREATE OR REPLACE FUNCTION public.getmilestones(
	)
    RETURNS TABLE(title character varying, project_id bigint, budget bigint, id bigint, proposal_id bigint, milestone bigint)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    BEGIN
        RETURN QUERY
            SELECT DISTINCT ON (soms.proposal_id, soms.milestone)
            proposals.title, proposals.project_id, proposals.budget,
            soms.id, soms.proposal_id, soms.milestone
            FROM soms
            LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
            ORDER BY soms.proposal_id, soms.milestone, soms.created_at DESC;
    end;
$BODY$;

ALTER FUNCTION public.getmilestones()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getmilestones() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getmilestones() TO anon;

GRANT EXECUTE ON FUNCTION public.getmilestones() TO authenticated;

GRANT EXECUTE ON FUNCTION public.getmilestones() TO postgres;

GRANT EXECUTE ON FUNCTION public.getmilestones() TO service_role;

CREATE OR REPLACE FUNCTION public.getproposalssnapshot(
	)
    RETURNS TABLE(title character varying, project_id bigint, budget bigint, funds_distributed float, id bigint, milestone bigint, month bigint, cost bigint, completion bigint, poas_id bigint, som_signoff_count bigint, poa_signoff_count bigint)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
  BEGIN
    RETURN QUERY
      SELECT distinct on (soms.proposal_id, soms.milestone)
      proposals.title, proposals.project_id, proposals.budget,
      proposals.funds_distributed,
      soms.id, soms.milestone, CAST(soms.month as bigint), soms.cost, soms.completion,
      poas.id as poas_id,
      COUNT(ss.id) as som_signoff_count, COUNT(sp.id) as poa_signoff_count
      FROM soms
      LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
      LEFT OUTER JOIN signoffs ss ON soms.id = ss.som_id
      LEFT OUTER JOIN poas ON soms.id = poas.som_id AND poas.current = true
      LEFT OUTER JOIN signoffs sp ON poas.id = sp.poa_id
      WHERE soms.current = true
      GROUP BY proposals.title, proposals.project_id, proposals.budget,
      proposals.funds_distributed, soms.id, soms.milestone, poas_id, poas.id
      ORDER BY soms.proposal_id ASC, soms.milestone ASC;
  end;
$BODY$;

ALTER FUNCTION public.getproposalssnapshot()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO anon;

GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO authenticated;

GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO postgres;

GRANT EXECUTE ON FUNCTION public.getproposalssnapshot() TO service_role;



CREATE OR REPLACE FUNCTION public.getallocatedpoas(
	)
    RETURNS TABLE(milestone bigint, proposal_id bigint, title character varying, created_at timestamp with time zone, project_id bigint, my_reviews_count bigint)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    BEGIN
        RETURN QUERY
          SELECT
              soms.milestone,
              soms.proposal_id,
              proposals.title,
              poas.created_at,
              proposals.project_id,
              count(distinct poas_reviews.id) as my_reviews_count
              -- count(distinct signoffs.id) as signoffs_count
              FROM poas
                left join poas_reviews
                  on poas_reviews.poas_id = poas.id
                  and poas_reviews.user_id = auth.uid()
                left join
                  signoffs
                    on signoffs.poa_id = poas.id
                left join
                  soms
                    on soms.id = poas.som_id
                left join
                  proposals
                    on proposals.id = poas.proposal_id
              where poas.proposal_id in (
                select allocations.proposal_id from allocations where allocations.user_id = auth.uid()
              )
              and soms.current = true
              and poas.current = true
              group by soms.milestone, soms.proposal_id, proposals.title, poas.created_at, proposals.project_id
              having count(distinct signoffs.id) = 0
              order by poas.created_at DESC;
  END;
$BODY$;

ALTER FUNCTION public.getallocatedpoas()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getallocatedpoas() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getallocatedpoas() TO anon;

GRANT EXECUTE ON FUNCTION public.getallocatedpoas() TO authenticated;

GRANT EXECUTE ON FUNCTION public.getallocatedpoas() TO postgres;

GRANT EXECUTE ON FUNCTION public.getallocatedpoas() TO service_role;


CREATE OR REPLACE FUNCTION public.getsignedoff(_date timestamp)
    RETURNS TABLE(poa_id bigint, som_id bigint, project_id bigint, title character varying, milestone bigint, poa_milestone bigint, created_at timestamp with time zone)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    BEGIN
        RETURN QUERY
          SELECT poas.id AS poa_id, soms.id AS som_id, proposals.project_id AS project_id, proposals.title, soms.milestone, poa_soms.milestone AS poa_milestone, signoffs.created_at FROM signoffs
          LEFT OUTER JOIN poas ON signoffs.poa_id = poas.id
          LEFT OUTER JOIN soms ON signoffs.som_id = soms.id
          LEFT OUTER JOIN soms AS poa_soms ON poa_soms.id = poas.som_id
          LEFT OUTER JOIN proposals ON poas.proposal_id = proposals.id OR soms.proposal_id = proposals.id
          LEFT outer join proposals_users ON proposals_users.proposal_id = proposals.id
          WHERE
          signoffs.created_at >= _date
          AND proposals_users.user_id = auth.uid()
          ORDER BY signoffs.created_at DESC;

  END;
$BODY$;

ALTER FUNCTION public.getsignedoff(timestamp)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getsignedoff(timestamp) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getsignedoff(timestamp) TO anon;

GRANT EXECUTE ON FUNCTION public.getsignedoff(timestamp) TO authenticated;

GRANT EXECUTE ON FUNCTION public.getsignedoff(timestamp) TO postgres;

GRANT EXECUTE ON FUNCTION public.getsignedoff(timestamp) TO service_role;


CREATE OR REPLACE FUNCTION public.getsomsreviews()
    RETURNS TABLE(project_id bigint, title character varying, milestone bigint, created_at timestamp with time zone, outputs_approved boolean, evidence_approved boolean, success_criteria_approved boolean)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    BEGIN
        RETURN QUERY
          SELECT proposals.project_id, proposals.title, soms.milestone, som_reviews.created_at, som_reviews.outputs_approves, som_reviews.evidence_approves, som_reviews.success_criteria_approves FROM som_reviews
            LEFT OUTER JOIN soms ON som_reviews.som_id = soms.id
            LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
            LEFT outer join proposals_users ON proposals_users.proposal_id = proposals.id
            LEFT OUTER JOIN signoffs ON signoffs.som_id = soms.id
            WHERE
            proposals_users.user_id = auth.uid() AND
            soms.current = true AND
            som_reviews.current = true
            GROUP BY proposals.project_id, proposals.title, soms.milestone, som_reviews.created_at, som_reviews.outputs_approves, som_reviews.evidence_approves, som_reviews.success_criteria_approves
            HAVING count(distinct signoffs.id) = 0
            ORDER BY som_reviews.outputs_approves ASC, som_reviews.evidence_approves ASC, som_reviews.success_criteria_approves ASC, som_reviews.created_at DESC;
  END;
$BODY$;

ALTER FUNCTION public.getsomsreviews()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getsomsreviews() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getsomsreviews() TO anon;

GRANT EXECUTE ON FUNCTION public.getsomsreviews() TO authenticated;

GRANT EXECUTE ON FUNCTION public.getsomsreviews() TO postgres;

GRANT EXECUTE ON FUNCTION public.getsomsreviews() TO service_role;

CREATE OR REPLACE FUNCTION public.getpoasreviews()
    RETURNS TABLE(project_id bigint, title character varying, milestone bigint, created_at timestamp with time zone, content_approved boolean)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    BEGIN
        RETURN QUERY
          SELECT proposals.project_id, proposals.title, soms.milestone, poas_reviews.created_at, poas_reviews.content_approved FROM poas_reviews
            LEFT OUTER JOIN poas ON poas_reviews.poas_id = poas.id
            LEFT OUTER JOIN soms ON poas.som_id = soms.id
            LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
            LEFT outer join proposals_users ON proposals_users.proposal_id = proposals.id
            LEFT OUTER JOIN signoffs ON signoffs.poa_id = poas.id
            where
            proposals_users.user_id = auth.uid() AND
            soms.current = true AND
            poas.current = true AND
            poas_reviews.current = true
            GROUP by proposals.project_id, proposals.title, soms.milestone, poas_reviews.created_at, poas_reviews.content_approved
            HAVING count(distinct signoffs.id) = 0
            ORDER BY poas_reviews.content_approved ASC, poas_reviews.created_at DESC;
  END;
$BODY$;

ALTER FUNCTION public.getpoasreviews()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getpoasreviews() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getpoasreviews() TO anon;

GRANT EXECUTE ON FUNCTION public.getpoasreviews() TO authenticated;

GRANT EXECUTE ON FUNCTION public.getpoasreviews() TO postgres;

GRANT EXECUTE ON FUNCTION public.getpoasreviews() TO service_role;


CREATE OR REPLACE FUNCTION public.getpoastobesignedoff(_from timestamp, _min_nr_reviews bigint, _max_nr_reviews bigint, _min_nr_approvals bigint, _max_nr_approvals bigint)
    RETURNS TABLE(project_id bigint, title character varying, milestone bigint, created_at timestamp with time zone, nr_reviews bigint, nr_approvals bigint)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    BEGIN
        RETURN QUERY
          SELECT proposals.project_id, proposals.title, soms.milestone, poas.created_at, count(distinct poas_reviews.id) as pp, count(poas_reviews.content_approved) filter (where poas_reviews.content_approved) FROM poas
            LEFT OUTER JOIN poas_reviews ON poas.id = poas_reviews.poas_id
            LEFT OUTER JOIN soms ON poas.som_id = soms.id
            LEFT OUTER JOIN signoffs ON signoffs.poa_id = poas.id
            LEFT OUTER JOIN proposals ON soms.proposal_id = proposals.id
            WHERE
            (SELECT role FROM users where user_id = auth.uid()) >= 3 AND
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
$BODY$;

ALTER FUNCTION public.getpoastobesignedoff(timestamp, bigint, bigint, bigint, bigint)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getpoastobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getpoastobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO anon;

GRANT EXECUTE ON FUNCTION public.getpoastobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO authenticated;

GRANT EXECUTE ON FUNCTION public.getpoastobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO postgres;

GRANT EXECUTE ON FUNCTION public.getpoastobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO service_role;


CREATE OR REPLACE FUNCTION public.getsomstobesignedoff(_from timestamp, _min_nr_reviews bigint, _max_nr_reviews bigint, _min_nr_approvals bigint, _max_nr_approvals bigint)
    RETURNS TABLE(project_id bigint, title character varying, milestone bigint, created_at timestamp with time zone, nr_reviews bigint, nr_approvals bigint)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
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
            WHERE 
            (SELECT role FROM users where user_id = auth.uid()) >= 3 AND
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
$BODY$;

ALTER FUNCTION public.getsomstobesignedoff(timestamp, bigint, bigint, bigint, bigint)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.getsomstobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.getsomstobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO anon;

GRANT EXECUTE ON FUNCTION public.getsomstobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO authenticated;

GRANT EXECUTE ON FUNCTION public.getsomstobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO postgres;

GRANT EXECUTE ON FUNCTION public.getsomstobesignedoff(timestamp, bigint, bigint, bigint, bigint) TO service_role;