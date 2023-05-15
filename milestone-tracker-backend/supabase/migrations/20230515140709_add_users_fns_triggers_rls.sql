CREATE OR REPLACE FUNCTION public.create_user()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
begin
  insert into public.users(user_id, _auth_user_id, email, role)
  values (new.id, new.id, new.email, 0);
  return new;
end;
$BODY$;

ALTER FUNCTION public.create_user()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.create_user() TO authenticated;

GRANT EXECUTE ON FUNCTION public.create_user() TO postgres;

GRANT EXECUTE ON FUNCTION public.create_user() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_user() TO anon;

GRANT EXECUTE ON FUNCTION public.create_user() TO service_role;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_user();

CREATE OR REPLACE FUNCTION public.can_access_users(
	_user_id uuid)
    RETURNS boolean
    LANGUAGE 'sql'
    COST 100
    VOLATILE SECURITY DEFINER PARALLEL UNSAFE
AS $BODY$
SELECT EXISTS (
  SELECT 1
  FROM users u
  WHERE u.user_id = _user_id
  AND u.role >= 2
);
$BODY$;

ALTER FUNCTION public.can_access_users(uuid)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.can_access_users(uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.can_access_users(uuid) TO anon;

GRANT EXECUTE ON FUNCTION public.can_access_users(uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.can_access_users(uuid) TO postgres;

GRANT EXECUTE ON FUNCTION public.can_access_users(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.is_admin(
	_user_id uuid)
    RETURNS boolean
    LANGUAGE 'sql'
    COST 100
    VOLATILE SECURITY DEFINER PARALLEL UNSAFE
AS $BODY$
SELECT EXISTS (
  SELECT 1
  FROM users u
  WHERE u.user_id = _user_id
  AND u.role = 3
);
$BODY$;

ALTER FUNCTION public.is_admin(uuid)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO postgres;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;


CREATE POLICY public
    ON public.users
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (((user_id = auth.uid()) OR can_access_users(auth.uid())));
CREATE POLICY "users update admin"
    ON public.users
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING (((user_id = auth.uid()) OR is_admin(auth.uid())));