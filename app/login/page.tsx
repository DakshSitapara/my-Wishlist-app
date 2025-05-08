'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/login/loginUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { EyeClosed, Eye } from 'lucide-react';

export default function LoginPage() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email.trim(), password);
    console.log(success, "sucess");
    if (success) {
      router.push('/wishlist');
    } else {
      router.push('/login');
      }
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center px-4 bg-[url('https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80')] bg-cover bg-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Welcome to Wishlist</h1>
              <p className="text-muted-foreground">
                Login to your account
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeClosed className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-4 ">
            Don’t have an account? {' '}
            <Link href="/signup" className="w-h mt-4">
              <Button className="w-full mt-4">
                Sign Up
              </Button>
            </Link>
            <Link href="/guest" className="w-h mt-4">
              <Button className="w-full mt-4">
                Guest account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>

    </div>
  );
}
