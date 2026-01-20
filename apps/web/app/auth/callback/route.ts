import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/select-user-type";

  if (code) {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL("/sign-in?error=Configuration error", request.url));
    }

    // Create a response object for redirects
    let redirectUrl = "/select-user-type";

    // Create a server client for route handlers with proper cookie handling
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the user to check their profile status
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user has completed profile setup
        const { data: donor } = await supabase
          .from("donors")
          .select("id, auth_user_id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        const { data: careProvider } = await supabase
          .from("care_providers")
          .select("id, auth_user_id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        // Determine redirect URL based on profile status
        if (donor) {
          redirectUrl = "/profile/donor";
        } else if (careProvider) {
          redirectUrl = "/profile/care-provider";
        }
        // else defaults to "/select-user-type" already set above
      } else {
        redirectUrl = next;
      }

      // Create redirect response with cookies
      const response = NextResponse.redirect(new URL(redirectUrl, request.url));

      // Ensure cookies are set in the response
      for (const cookie of cookieStore.getAll()) {
        response.cookies.set(cookie.name, cookie.value);
      }

      return response;
    }

    // If there was an error, redirect to sign-in with error
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  // No code parameter, redirect to sign-in
  return NextResponse.redirect(new URL("/sign-in", request.url));
}
