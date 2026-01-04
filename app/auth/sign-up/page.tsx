import { SignUpForm } from "@/components/auth/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full mt-12 justify-center md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
