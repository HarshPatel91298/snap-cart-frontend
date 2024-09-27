'use client';

import { useRouter } from 'nextjs-toploader/app';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/user');
  }, [router]);

  return null; // You can return null or a loading component while redirecting
}
