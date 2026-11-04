-- Purge quotidienne à 03:00 (UTC) des données arrivées à échéance (voir purge_expired_leads).
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule('purge-expired-leads', '0 3 * * *', $$select public.purge_expired_leads()$$);
