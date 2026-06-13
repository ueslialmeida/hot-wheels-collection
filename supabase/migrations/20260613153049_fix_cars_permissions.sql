GRANT ALL ON TABLE public.cars TO anon, authenticated, service_role, postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;