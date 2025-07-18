new .env file: # Google API Keys
NEXT_PUBLIC_GOOGLE_PLACE_API_KEY=AIzaSyDUO3oOP7ICjWw3Kv8jfh-n0JgynO-iPeM
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyDUO3oOP7ICjWw3Kv8jfh-n0JgynO-iPeM

# Geolocation API Key
GEO_API_KEY=AIzaSyCVIoYXA9Ky4q8dXYv72wblihwZmN8xVdc


# Vercel
CRON_SECRET=7TbpEDs4ny+LRMJ3liGxyEOmtWGxobzzLUEsDnbbfi4=

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://edprxvdtxhpeoxztcmon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHJ4dmR0eGhwZW94enRjbW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTAyMTgsImV4cCI6MjA2MzU2NjIxOH0.LX5DNktCx8yTLAxtNGYD7FI0vGRk4K30G9mygVqcFTg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHJ4dmR0eGhwZW94enRjbW9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MDIxOCwiZXhwIjoyMDYzNTY2MjE4fQ.sVrSI4R1u6yWEBBbk8EuxrQNtxfXqg0cAhtgH1H-M4k
SUPABASE_JWT_SECRET=vmxcKCm7bG+7lD5KR7Tc4/4TKOeNAponxc4Rt9Lzgh89xsnv6Gotq35I/liJOHoraqLFU47kxO2WiR4uF1g9dA==

# Image Storage URL
NEXT_PUBLIC_IMAGE_URL=https://edprxvdtxhpeoxztcmon.supabase.co/storage/v1/object/public/listingImages/

# Domain Configuration
NEXT_PUBLIC_DOMAIN_URL=https://onlinehome.com.np
NEXT_PUBLIC_ALLOWED_ORIGINS=https://onlinehome.com.np,https://www.onlinehome.com.np

# NextAuth Configuration
NEXTAUTH_SECRET=X3SmzGoF+owEFC3zos0vHLOEj6/ygUxMNFGd1DgNfhA=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=757712301217-gvhkilpe0pqprpsv94mqdbqprcuv6ni0.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://edprxvdtxhpeoxztcmon.supabase.co/auth/v1/callback

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Sparrow SMS API
SPARROW_SMS_TOKEN=v2_SXJ1ZT6ptFRFsgxggSe08vKrcYh.OqvE

# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=onlinehome.com.np@gmail.com
EMAIL_SERVER_PASSWORD=ayeymbirelalaikz
EMAIL_SERVER_SECURE=true
EMAIL_FROM_NAME=Online Home Nepal
EMAIL_FROM_ADDRESS=onlinehome.com.np@gmail.com

# Testing Email Credentials
GMAIL_USER=onlinehome.com.np@gmail.com
GMAIL_PASS=ayeymbirelalaikz


#for connection with postgresql via prisma

DATABASE_URL="postgresql://postgres.edprxvdtxhpeoxztcmon:HelloTHisPsss@^@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.edprxvdtxhpeoxztcmon:HelloTHisPsss@^@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"