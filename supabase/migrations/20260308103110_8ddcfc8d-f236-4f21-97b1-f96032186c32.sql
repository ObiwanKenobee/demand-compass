
-- Allow admins to delete leads
CREATE POLICY "Admins can delete leads"
  ON public.institutional_leads FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete signals
CREATE POLICY "Admins can delete signals"
  ON public.strategic_signals FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
