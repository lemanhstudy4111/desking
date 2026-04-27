import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	"https://your-project-id.supabase.co",
	"sb_publishable_...",
);

// ---cut---
const { data, error } = await supabase.auth.signInWithOtp({
	email: "valid.email@supabase.io",
	options: {
		// set this to false if you do not want the user to be automatically signed up
		shouldCreateUser: false,
	},
});
