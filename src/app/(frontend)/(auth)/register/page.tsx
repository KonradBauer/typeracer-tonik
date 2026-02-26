import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { RegisterForm } from '@/features/auth/components/register-form'

export const metadata = {
  title: 'Register — TypeRacer Tonik',
}

export default function RegisterPage() {
  return (
    <div className="flex justify-center py-12">
      <Card className="animate-fade-in-up w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="text-muted mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
