// utils/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL! || 'https://edprxvdtxhpeoxztcmon.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY! || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHJ4dmR0eGhwZW94enRjbW9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MDIxOCwiZXhwIjoyMDYzNTY2MjE4fQ.sVrSI4R1u6yWEBBbk8EuxrQNtxfXqg0cAhtgH1H-M4k',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};  