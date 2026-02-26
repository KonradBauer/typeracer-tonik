import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { LoginForm } from '@/features/auth/components/login-form'

export const metadata = {
  title: 'Login — TypeRacer Tonik',
}

export default function LoginPage() {
  return (
    <div className="flex justify-center py-12">
      <Card className="animate-fade-in-up w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="text-muted mt-4 text-center text-sm">
            No account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
