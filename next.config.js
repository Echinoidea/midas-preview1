/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY
  },
};

module.exports = nextConfig;
