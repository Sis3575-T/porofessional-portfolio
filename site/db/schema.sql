-- Portfolio schema: current content only. No history, drafts or soft deletes.

-- Exactly one profile row (id is pinned to 1).
CREATE TABLE IF NOT EXISTS profile (
  id           smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name         text  NOT NULL,
  role         text  NOT NULL,
  headline     text  NOT NULL DEFAULT '',
  bio          text  NOT NULL DEFAULT '',
  email        text  NOT NULL,
  photo_url    text,
  social_links jsonb NOT NULL DEFAULT '[]'::jsonb
               CHECK (jsonb_typeof(social_links) = 'array')
);

CREATE TABLE IF NOT EXISTS projects (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       text    NOT NULL,
  description text    NOT NULL DEFAULT '',
  tech        text[]  NOT NULL DEFAULT '{}',
  link        text,
  image_url   text,
  position    integer NOT NULL,
  visible     boolean NOT NULL DEFAULT true,
  -- Deferrable so two rows can swap positions inside one transaction.
  CONSTRAINT projects_position_key UNIQUE (position) DEFERRABLE INITIALLY DEFERRED
);

-- Public query: visible projects ordered by position.
CREATE INDEX IF NOT EXISTS projects_visible_position_idx ON projects (position) WHERE visible;

CREATE TABLE IF NOT EXISTS skills (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_name text    NOT NULL,
  name       text    NOT NULL,
  position   integer NOT NULL,
  CONSTRAINT skills_position_key UNIQUE (position) DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT skills_group_name_key UNIQUE (group_name, name)
);

CREATE INDEX IF NOT EXISTS skills_group_position_idx ON skills (group_name, position);

-- Login rate limiting (serverless instances share no memory). One row per
-- hashed client IP, overwritten in place and pruned after a day.
CREATE TABLE IF NOT EXISTS login_attempts (
  key          text        PRIMARY KEY,
  attempts     integer     NOT NULL,
  window_start timestamptz NOT NULL
);
