drop policy "Insert PoAs reviews" on "public"."poas_reviews";

drop policy "Insert SoMs reviews" on "public"."som_reviews";

drop policy "Update SoMs reviews" on "public"."som_reviews";

create policy "Insert PoAs reviews"
on "public"."poas_reviews"
as permissive
for insert
to public
with check ((is_proposal_allocated_for_signoff(( SELECT poas.proposal_id
   FROM poas
  WHERE (poas.id = poas_reviews.poas_id))) OR is_proposal_allocated(( SELECT poas.proposal_id
   FROM poas
  WHERE (poas.id = poas_reviews.poas_id))) OR is_io_member(auth.uid()) OR is_admin(auth.uid())));


create policy "Insert SoMs reviews"
on "public"."som_reviews"
as permissive
for insert
to public
with check ((is_proposal_allocated_for_signoff(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = som_reviews.som_id))) OR is_proposal_allocated(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = som_reviews.som_id))) OR is_io_member(auth.uid()) OR is_admin(auth.uid())));


create policy "Update SoMs reviews"
on "public"."som_reviews"
as permissive
for update
to public
using ((is_proposal_allocated_for_signoff(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = som_reviews.som_id))) OR is_proposal_allocated(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = som_reviews.som_id))) OR is_io_member(auth.uid()) OR is_admin(auth.uid())))
with check ((is_proposal_allocated_for_signoff(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = som_reviews.som_id))) OR is_proposal_allocated(( SELECT soms.proposal_id
   FROM soms
  WHERE (soms.id = som_reviews.som_id))) OR is_io_member(auth.uid()) OR is_admin(auth.uid())));



