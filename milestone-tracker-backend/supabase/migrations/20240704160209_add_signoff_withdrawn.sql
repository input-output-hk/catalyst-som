drop policy "Proposals update" on "public"."proposals";

drop policy "Delete signoffs" on "public"."signoffs";

create table "public"."signoff_withdraws" (
    "id" bigint generated by default as identity not null,
    "poa_id" bigint,
    "som_id" bigint,
    "signer_id" uuid,
    "user_id" uuid,
    "original_signed_off_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."signoff_withdraws" enable row level security;

CREATE UNIQUE INDEX signoff_withdraws_pkey ON public.signoff_withdraws USING btree (id);

alter table "public"."signoff_withdraws" add constraint "signoff_withdraws_pkey" PRIMARY KEY using index "signoff_withdraws_pkey";

alter table "public"."signoff_withdraws" add constraint "signoff_withdraws_poa_id_fkey" FOREIGN KEY (poa_id) REFERENCES poas(id) not valid;

alter table "public"."signoff_withdraws" validate constraint "signoff_withdraws_poa_id_fkey";

alter table "public"."signoff_withdraws" add constraint "signoff_withdraws_signer_id_fkey" FOREIGN KEY (signer_id) REFERENCES users(_auth_user_id) not valid;

alter table "public"."signoff_withdraws" validate constraint "signoff_withdraws_signer_id_fkey";

alter table "public"."signoff_withdraws" add constraint "signoff_withdraws_som_id_fkey" FOREIGN KEY (som_id) REFERENCES soms(id) not valid;

alter table "public"."signoff_withdraws" validate constraint "signoff_withdraws_som_id_fkey";

alter table "public"."signoff_withdraws" add constraint "signoff_withdraws_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(_auth_user_id) not valid;

alter table "public"."signoff_withdraws" validate constraint "signoff_withdraws_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_signoff_withdraw()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO public.signoff_withdraws (poa_id, som_id, signer_id, user_id, original_signed_off_at)
    VALUES (OLD.poa_id, OLD.som_id, OLD.user_id, auth.uid(), OLD.created_at);
    RETURN OLD;
END;
$function$
;

grant delete on table "public"."signoff_withdraws" to "anon";

grant insert on table "public"."signoff_withdraws" to "anon";

grant references on table "public"."signoff_withdraws" to "anon";

grant select on table "public"."signoff_withdraws" to "anon";

grant trigger on table "public"."signoff_withdraws" to "anon";

grant truncate on table "public"."signoff_withdraws" to "anon";

grant update on table "public"."signoff_withdraws" to "anon";

grant delete on table "public"."signoff_withdraws" to "authenticated";

grant insert on table "public"."signoff_withdraws" to "authenticated";

grant references on table "public"."signoff_withdraws" to "authenticated";

grant select on table "public"."signoff_withdraws" to "authenticated";

grant trigger on table "public"."signoff_withdraws" to "authenticated";

grant truncate on table "public"."signoff_withdraws" to "authenticated";

grant update on table "public"."signoff_withdraws" to "authenticated";

grant delete on table "public"."signoff_withdraws" to "service_role";

grant insert on table "public"."signoff_withdraws" to "service_role";

grant references on table "public"."signoff_withdraws" to "service_role";

grant select on table "public"."signoff_withdraws" to "service_role";

grant trigger on table "public"."signoff_withdraws" to "service_role";

grant truncate on table "public"."signoff_withdraws" to "service_role";

grant update on table "public"."signoff_withdraws" to "service_role";

create policy "insert withdraw signoff"
on "public"."signoff_withdraws"
as permissive
for insert
to public
with check ((is_admin(auth.uid()) OR can_access_users(auth.uid())));

create policy "signoff withdraw select"
on "public"."signoff_withdraws"
as permissive
for select
to public
using (true);

create policy "Delete signoffs"
on "public"."signoffs"
as permissive
for delete
to public
using ((is_admin(auth.uid()) OR can_access_users(auth.uid())));


CREATE TRIGGER before_signoff_delete BEFORE DELETE ON public.signoffs FOR EACH ROW EXECUTE FUNCTION insert_signoff_withdraw();

