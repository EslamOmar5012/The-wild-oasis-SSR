import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ncdntbcnbcraefnholvo.supabase.co";
const supabaseKey = "sb_publishable_wz-ygfiz0p_Ss9sb9zHEiQ_duUYleaP";
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
