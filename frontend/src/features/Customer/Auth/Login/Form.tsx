import { useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerAuthService } from "@/api/customer/auth/auth.service";
import { Spinner } from "@/components/ui/spinner";
import type { ApiError } from "@/api/types/Error";
import { toast } from "sonner";
import { Pathname } from "../../../../config/Pathname";
import { APP_NAME } from "../../../../config/app";
import { HttpStatusCode } from "axios";
import type { LoginResponseData } from "../../../../api/customer/auth/auth.types";
import type { SuccessResponse } from "../../../../api/types/Response";
import { CookieName } from "../../../../config/cookies";

const schema = z.object({
  phone_number: z
    .string()
    .min(1, "El número de teléfono es obligatorio")
    .regex(/^\+?[0-9\s\-()]+$/, "El número de teléfono no es válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(30, "La contraseña no puede tener más de 30 caracteres"),
});

function Form() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone_number: "",
      password: "",
    },
  });

  const handleSuccess = (r: SuccessResponse<LoginResponseData>) => {
    toast.success("Inicio de sesión exitoso");

    cookieStore.set(CookieName.CUSTOMER_TOKEN, r.data.token);

    window.location.href = Pathname.CUSTOMER_DASHBOARD;
  };

  const handleError = (error: ApiError) => {
    if (error.status === HttpStatusCode.Unauthorized) {
      form.setError("password", { message: error.message });
      form.setError("phone_number", { message: error.message });
      return;
    }

    toast.error(error.data?.title || "Error al iniciar sesión", {
      position: "bottom-right",
      description: error.data?.message || error.message,
    });
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (isLoading) {
      return;
    }

    const service = new CustomerAuthService();
    setIsLoading(true);

    service
      .login(data)
      .then(handleSuccess)
      .catch(handleError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="w-full max-w-md">
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <span className="text-2xl font-bold">{APP_NAME}</span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Bienvenido</h2>
        <p className="text-muted-foreground">
          Ingresa tu número de teléfono para continuar
        </p>
      </div>

      <form
        id="login-form"
        onSubmit={handleSubmit}
        className="space-y-5"
        method="POST"
        aria-disabled={isLoading}
      >
        <div className="space-y-2">
          <Controller
            name="phone_number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="phone_number">
                  Número de Teléfono
                </FieldLabel>
                <Input
                  {...field}
                  id="phone_number"
                  type="tel"
                  aria-invalid={fieldState.invalid}
                  placeholder="+54 9 11 1234-5678"
                  autoComplete="tel"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-xs" />
                )}
              </Field>
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="current-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-xs" />
                )}
              </Field>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">¿No tienes cuenta? </span>
        <a
          href={Pathname.CUSTOMER_REGISTER}
          className="text-primary underline-offset-4 hover:underline font-medium"
        >
          Regístrate aquí
        </a>
      </div>

      <div className="mt-4 text-center">
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default Form;
