drop policy if exists "SoMs update" on "public"."soms";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_milestone_qty(_proposal_id bigint, _new_qty bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  /* Updated milestones qty */
  update public.proposals
  set milestones_qty=_new_qty
  where proposals.id = _proposal_id
  and can_access_users(auth.uid());

  /* Archive soms without poas signed off */

  UPDATE public.soms
  SET current = false
  WHERE proposal_id = _proposal_id
  AND id NOT IN (
      SELECT s.id
      FROM public.soms s
      JOIN public.poas p ON s.id = p.som_id
      JOIN public.signoffs so ON p.id = so.poa_id
      WHERE s.proposal_id = _proposal_id
  );
end;
$function$
;

drop policy if exists "Proposals update" on "public"."proposals";

create policy "Proposals update"
on "public"."proposals"
as permissive
for update
to public
using (can_access_users(auth.uid()))
with check (can_access_users(auth.uid()));


create policy "SoMs update"
on "public"."soms"
as permissive
for update
to public
using ((is_proposal_owner(proposal_id) OR is_admin(auth.uid()) OR can_access_users(auth.uid())))
with check ((is_proposal_owner(proposal_id) OR is_admin(auth.uid()) OR can_access_users(auth.uid())));



