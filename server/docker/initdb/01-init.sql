DO 49934
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'teammaker'
   ) THEN
      CREATE ROLE teammaker LOGIN PASSWORD 'teammaker';
   END IF;
END 49934;

DO 49934
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'teammaker'
   ) THEN
      CREATE DATABASE teammaker OWNER teammaker;
   END IF;
END 49934;

GRANT ALL PRIVILEGES ON DATABASE teammaker TO teammaker;
