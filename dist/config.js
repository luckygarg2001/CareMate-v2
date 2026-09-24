// Replace these placeholders with your actual Supabase URL and Anon Key
// You can find them in your Supabase Dashboard under Project Settings -> API
window.SUPABASE_URL = "https://oxuyrralogtgdahatbib.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_rcdTOzOCBma_11DhUpg7pg_1zSGktJn";

if (window.SUPABASE_URL === "YOUR_SUPABASE_URL") {
    console.warn("Supabase is not configured! Please update config.js with your URL and Key. The app will fall back to local storage if it cannot connect.");
}
