import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <p className="eyebrow">Camelot Designs</p>
      <h1 className="font-serif text-3xl mt-2">Studio Admin</h1>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
