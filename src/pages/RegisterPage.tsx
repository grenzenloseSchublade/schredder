import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import Input from "@/components/ui/Input";
import InitialsAvatar from "@/components/InitialsAvatar";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    },
  });

  const nickname = useWatch({ control, name: "nickname" });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { error } = await signUp(data.email, data.password, {
        nickname: data.nickname,
      });

      if (error) {
        toast.error("Registrierung fehlgeschlagen", {
          description: error.message,
        });
        return;
      }

      toast.success("Registrierung erfolgreich", {
        description: "Bitte bestätige deine E-Mail und melde dich an.",
      });
      navigate("/login");
    } catch {
      toast.error("Ein unbekannter Fehler ist aufgetreten");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Registrieren</h1>
        <p className="mt-2 text-gray-600">Erstelle ein neues Konto.</p>

        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-700">Hinweis zur Anonymität</p>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>
              Dein Spitzname wird im Leaderboard angezeigt – verwende keinen
              echten Namen.
            </li>
            <li>
              Deine E-Mail dient nur zur Anmeldung und wird niemals öffentlich
              angezeigt.
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <InitialsAvatar
              nickname={nickname || "??"}
              color="orange"
              size="xl"
              className="shrink-0"
            />
            <Input
              id="nickname"
              type="text"
              label="Spitzname"
              placeholder="Dein Spitzname"
              autoComplete="nickname"
              error={errors.nickname?.message}
              {...register("nickname")}
            />
          </div>

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
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Passwort bestätigen"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? "Registrieren..." : "Registrieren"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Bereits ein Konto?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
