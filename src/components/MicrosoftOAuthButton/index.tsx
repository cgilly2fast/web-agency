'use client'
import Link from 'next/link'
const MicrosoftOAuthButton: React.FC = () => (
  <button>
    <Link href="/api/users/ms/oauth/authorize">Microsoft OAuth Login</Link>
  </button>
)

export default MicrosoftOAuthButton
