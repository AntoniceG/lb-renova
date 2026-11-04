-- Avec les droits de l'appelant, la politique admin_profiles_self_read suffit : plus besoin de SECURITY DEFINER.
alter function public.is_admin() security invoker;
