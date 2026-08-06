import { Button } from "@/components/ui/button";
import { signInWithGoogleAction } from "@/app/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const signInWithGoogle = signInWithGoogleAction.bind(
    null,
    callbackUrl ?? "/",
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <form action={signInWithGoogle}>
        <Button type="submit" size="lg">
          Sign in with Google
        </Button>
      </form>
    </main>
  );
}
