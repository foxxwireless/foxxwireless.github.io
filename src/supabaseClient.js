import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cqhdgoysdpzlznikwpbu.supabase.co";
const SUPABASE_KEY = "sb_publishable_ELqf182fNZ"; // replace if needed

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
