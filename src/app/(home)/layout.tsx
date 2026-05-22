import Header from "@/components/custom/Header";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



const HomeLayout =async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)=> {

  const session = await auth.api.getSession({
    headers: await headers()})

    if(!session?.user){
      return redirect("/sign-in")
    }

    const user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    }

  return (
  <main className="min-h-screen text-gray-400">

    {/* HEADER */}
    <Header
    user={user ?? null}
    />
    
    <div className="container py-10">
{children}
    </div>

  </main>
  );
}
export default HomeLayout;
