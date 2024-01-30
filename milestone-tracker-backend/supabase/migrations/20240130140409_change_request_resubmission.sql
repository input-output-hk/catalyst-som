drop policy "Delete Change Requests" on "public"."change_request";

drop policy "Insert Change Request" on "public"."change_request";

drop policy "Update Change Request" on "public"."change_request";

alter table "public"."change_request" add column "resubmission" boolean default true;

create policy "Delete Change Requests"
on "public"."change_request"
as permissive
for delete
to public
using ((is_admin(auth.uid()) OR is_io_member(auth.uid())));


create policy "Insert Change Request"
on "public"."change_request"
as permissive
for insert
to public
with check ((is_admin(auth.uid()) OR is_io_member(auth.uid())));


create policy "Update Change Request"
on "public"."change_request"
as permissive
for update
to public
using ((is_admin(auth.uid()) OR is_io_member(auth.uid())))
with check ((is_admin(auth.uid()) OR is_io_member(auth.uid())));



