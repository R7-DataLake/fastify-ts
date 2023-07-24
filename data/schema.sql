-- public.users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	user_id uuid NOT NULL DEFAULT gen_random_uuid(),
	username varchar(50) NOT NULL,
	"password" varchar(200) NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(200) NOT NULL,
	enabled bool NULL DEFAULT true,
	"role" varchar(10) NULL DEFAULT 'USER'::character varying,
	created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL,
	CONSTRAINT users_pk PRIMARY KEY (user_id)
);
CREATE INDEX users_enabled_idx ON users (enabled);
CREATE INDEX users_password_idx ON users ("password");
CREATE UNIQUE INDEX users_username_idx ON users (username);

INSERT INTO users (user_id,username,"password",first_name,last_name,enabled,"role",created_at,updated_at) VALUES
	 ('2fdb68c7-4a1c-404b-b0e3-37e21e28cd11','test2','$2a$12$Hy9XZoxcc3w/nyrkNy8tzuFRpNwOZFojGgzVxYy0q6CzHvtzaX2i.','test2','test2',true,'ADMIN','2023-07-24 21:03:30.475529+07',NULL),
	 ('08dd3c92-5687-4866-aafc-7a0c7699f200','test','$2a$12$Hy9XZoxcc3w/nyrkNy8tzuFRpNwOZFojGgzVxYy0q6CzHvtzaX2i.','test22','test22',true,'ADMIN','2023-07-24 20:58:52.875485+07','2023-07-24 21:05:30.185+07');
