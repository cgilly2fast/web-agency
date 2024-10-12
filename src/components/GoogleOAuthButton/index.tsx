'use client'
import Link from 'next/link'
const GoogleOAuthButton: React.FC = () => (
  <button>
    <Link href="/api/users/g/oauth/authorize">Google OAuth Login</Link>
  </button>
)

export default GoogleOAuthButton
