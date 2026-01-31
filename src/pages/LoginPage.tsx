import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const { signIn, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const fillDemoCredentials = () => {
    setValue("email", "demo@example.com");
    setValue("password", "demo123");
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        toast.error("Anmeldung fehlgeschlagen", {
          description: error.message,
        });
        return;
      }

      toast.success("Erfolgreich angemeldet");
      navigate(from, { replace: true });
    } catch {
      toast.error("Ein unbekannter Fehler ist aufgetreten");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Anmelden</h1>
        <p className="mt-2 text-gray-600">Melde dich an, um fortzufahren.</p>

        {isDemoMode && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-medium">Demo-Modus aktiv</p>
            <p className="mt-1">
              Keine Datenbank verbunden.{" "}
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="underline hover:no-underline"
              >
                Demo-Login verwenden
              </button>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            id="email"
            type="email"
            label="E-Mail"
            placeholder="name@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            type="password"
            label="Passwort"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? "Anmelden..." : "Anmelden"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Noch kein Konto?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
