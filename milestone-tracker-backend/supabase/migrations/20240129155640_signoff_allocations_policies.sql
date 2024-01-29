drop policy "Update signoffs" on "public"."signoffs";

drop policy "Delete signoffs" on "public"."signoffs";

drop policy "Insert signoffs" on "public"."signoffs";

create policy "signoff update"
on "public"."signoffs"
as permissive
for update
to public
using ((is_admin(auth.uid()) OR is_proposal_allocated_for_signoff(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = signoffs.som_id)
UNION ALL
 SELECT poas.proposal_id
   FROM poas
  WHERE (poas.id = signoffs.poa_id)))))
with check ((is_admin(auth.uid()) OR is_proposal_allocated_for_signoff(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = signoffs.som_id)
UNION ALL
 SELECT poas.proposal_id
   FROM poas
  WHERE (poas.id = signoffs.poa_id)))));


create policy "Delete signoffs"
on "public"."signoffs"
as permissive
for delete
to public
using (is_admin(auth.uid()));


create policy "Insert signoffs"
on "public"."signoffs"
as permissive
for insert
to public
with check ((is_admin(auth.uid()) OR is_proposal_allocated_for_signoff(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = signoffs.som_id)
UNION ALL
 SELECT poas.proposal_id
   FROM poas
  WHERE (poas.id = signoffs.poa_id)))));



