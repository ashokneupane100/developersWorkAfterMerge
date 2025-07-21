// Check environment variables
// Run this in your terminal: node check-env.js

console.log("🔍 Checking Supabase Environment Variables...\n");

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_API_KEY",
];

let allGood = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
    // Show first few characters to verify it's not empty
    console.log(`   Value: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    allGood = false;
  }
  console.log("");
});

if (allGood) {
  console.log("🎉 All environment variables are set correctly!");
} else {
  console.log("⚠️  Some environment variables are missing.");
  console.log("\n📝 To fix this:");
  console.log("1. Create a .env.local file in your project root");
  console.log("2. Add your Supabase credentials:");
  console.log("   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url");
  console.log("   NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key");
  console.log("3. Restart your development server");
  console.log(
    "\n🔗 Get your credentials from: https://supabase.com/dashboard/project/_/settings/api"
  );
}
