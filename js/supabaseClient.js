import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://mlwxxtvsozhwzjxmsvbg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3h4dHZzb3pod3pqeG1zdmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4OTAwOTksImV4cCI6MjA2NDQ2NjA5OX0.i9KySUVeot9imnALKr79DYySocuj0_rko4nzPhPxekU'
);