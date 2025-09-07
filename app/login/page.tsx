import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import LoginForm from "../../components/auth/LoginForm";

export default async function LoginPage({ searchParams }: {
  searchParams?: { callbackUrl?: string };
})
{
  const session = await getServerSession(authOptions);
  const callbackUrl = searchParams?.callbackUrl || "/";
  if (session?.user?.id) redirect(callbackUrl);

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm callbackUrl={callbackUrl}/>
      </div>
    </div>
  )
}
