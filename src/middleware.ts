import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    // Match all paths except for:
    // 1. /api routes (for Payload CMS API)
    // 2. /admin routes (for Payload CMS Admin)
    // 3. /_next (Next.js internals)
    // 4. /_static (inside /public)
    // 5. all root files inside /public (e.g. /favicon.ico)

    '/((?!api|admin|_next|_static|[\\w-]+\\.\\w+).*)',
  ],
}

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  let hostname = req.headers.get('host')!

  const searchParams = req.nextUrl.searchParams.toString()
  const path = `${req.nextUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

  // if (process.env.NODE_ENV === 'development') {
  //   if (hostname === 'localhost:3000') {
  //     hostname = process.env.NEXT_PUBLIC_ROOT_DOMAIN!
  //   }
  // }

  const rewriteUrl = new URL(req.url)
  rewriteUrl.pathname = `/${hostname}${path}`

  return NextResponse.rewrite(rewriteUrl)
}
