import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // This will refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Define route protection logic
    const isBuilderRoute = request.nextUrl.pathname.startsWith('/builder')
    const isPaywallRoute = request.nextUrl.pathname.startsWith('/paywall')

    if (!user && (isBuilderRoute || isPaywallRoute)) {
        // Unauthenticated users trying to access protected routes go to login
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Handle Superadmin logic - bypass paywall, give builder access
    if (user && isBuilderRoute) {
        // We import dynamically to avoid Next.js edge runtime issues with some deps
        const { isSuperAdmin } = await import('@/lib/constants/auth')
        if (!isSuperAdmin(user.email)) {
            // Non-admins shouldn't access builder directly yet in MVP, redirect to Paywall placeholder
            const url = request.nextUrl.clone()
            url.pathname = '/paywall'
            return NextResponse.redirect(url)
        }
    }

    if (user && isPaywallRoute) {
        const { isSuperAdmin } = await import('@/lib/constants/auth')
        if (isSuperAdmin(user.email)) {
            // Superadmins shouldn't see paywall, redirect straight to builder
            const url = request.nextUrl.clone()
            url.pathname = '/builder'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
