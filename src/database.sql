-- Function: public.listuserjson(character varying, boolean)

-- DROP FUNCTION public.listuserjson(character varying, boolean);

CREATE OR REPLACE FUNCTION public.listuserjson(
    name character varying,
    actv boolean)
  RETURNS SETOF json AS
$BODY$
select array_to_json(array_agg(row_to_json(u)))
from(
select id, TRIM(concat(first_name, ' ', last_name)) as name, email, active 
from users 
where TRIM(concat(first_name, ' ', last_name)) like '%' || $1 || '%' and active = $2
) u
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.listuserjson(character varying, boolean)
  OWNER TO dbuserpharma;


----


-- Function: public.login(character varying)

-- DROP FUNCTION public.login(character varying);

CREATE OR REPLACE FUNCTION public.login(email character varying)
  RETURNS SETOF json AS
$BODY$

	select array_to_json(array_agg(row_to_json(u)))
	from(
	select first_name, last_name, email, dni, pwd as pwd_has, token_jwt
	from users 
	where email=$1
	) u
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.login(character varying)
  OWNER TO dbuserpharma;




----


-- Function: public.logoutuser(character varying)

-- DROP FUNCTION public.logoutuser(character varying);

CREATE OR REPLACE FUNCTION public.logoutuser(token_jwt character varying)
  RETURNS SETOF json AS
$BODY$
		update users set token_jwt= null where token_jwt=$1
		returning json_build_object('confirmation', true)
	
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.logoutuser(character varying)
  OWNER TO dbuserpharma;


----


-- Function: public.registeruser(character varying, character varying, character varying, integer, character varying, character varying)

-- DROP FUNCTION public.registeruser(character varying, character varying, character varying, integer, character varying, character varying);

CREATE OR REPLACE FUNCTION public.registeruser(
    first_name character varying,
    last_name character varying,
    email character varying,
    dni integer,
    pwd character varying,
    token_jwt character varying)
  RETURNS SETOF json AS
$BODY$
		INSERT into users(first_name, last_name, email, dni, pwd, token_jwt) values($1, $2, $3, $4, $5, $6)
		returning json_build_object('name', TRIM(concat(first_name, ' ', last_name)), 'emal', email, 'token_jwt', token_jwt)
	
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.registeruser(character varying, character varying, character varying, integer, character varying, character varying)
  OWNER TO dbuserpharma;


-----


-- Function: public.validateemail(character varying)

-- DROP FUNCTION public.validateemail(character varying);

CREATE OR REPLACE FUNCTION public.validateemail(email character varying)
  RETURNS SETOF json AS
$BODY$

	select array_to_json(array_agg(row_to_json(u)))
	from(
	select email 
	from users 
	where email=$1
	) u
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.validateemail(character varying)
  OWNER TO dbuserpharma;


-----


-- Function: public.validatetoken(character varying)

-- DROP FUNCTION public.validatetoken(character varying);

CREATE OR REPLACE FUNCTION public.validatetoken(token character varying)
  RETURNS SETOF json AS
$BODY$

	select array_to_json(array_agg(row_to_json(u)))
	from(
	select first_name, last_name, email 
	from users 
	where token_jwt=$1
	) u
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.validatetoken(character varying)
  OWNER TO dbuserpharma;


----

create table users(
    id integer pk,
    first_name varchar(100),
    last_name varchar(150),
    email varchar(100),
    pwd varchar(300),
    active boolean default set default true,
    date_register timestamp set default now(),
    token_jwt varchar(300),
    dni varchar(50)
)