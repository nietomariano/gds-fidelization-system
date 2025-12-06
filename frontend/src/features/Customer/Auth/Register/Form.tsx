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
import { CookieName } from "../../../../config/cookies";
import type { LoginResponseData } from "../../../../api/customer/auth/auth.types";
import type { SuccessResponse } from "../../../../api/types/Response";

const schema = z
  .object({
    first_name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .max(50, "El nombre no puede tener más de 50 caracteres"),
    last_name: z
      .string()
      .max(50, "El apellido no puede tener más de 50 caracteres")
      .optional(),
    email: z
      .string()
      .email("El correo electrónico no es válido")
      .optional()
      .or(z.literal("")),
    phone_number: z
      .string()
      .min(1, "El número de teléfono es obligatorio")
      .regex(
        /^\+?[0-9\s\-()]+$/,
        "El número de teléfono no es válido"
      ),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(30, "La contraseña no puede tener más de 30 caracteres"),
    password_confirmation: z
      .string()
      .min(8, "La confirmación de la contraseña debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

function Form() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleSuccess = () => {
    toast.success("Cuenta creada exitosamente", {
      description: "Ya puedes iniciar sesión con tu número de teléfono",
    });

    // Redirigir al login
    setTimeout(() => {
      window.location.href = Pathname.CUSTOMER_LOGIN;
    }, 1500);
  };

  const handleError = (error: ApiError) => {
    toast.error(error.data?.title || "Error al crear cuenta", {
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

    // Limpiar email vacío
    const submitData = {
      ...data,
      email: data.email || undefined,
      last_name: data.last_name || undefined,
    };

    service
      .register(submitData as any)
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
        <h2 className="text-3xl font-bold mb-2">Crear Cuenta</h2>
        <p className="text-muted-foreground">
          Completa tus datos para comenzar a acumular puntos
        </p>
      </div>

      <form
        id="register-form"
        onSubmit={handleSubmit}
        className="space-y-5"
        method="POST"
        aria-disabled={isLoading}
      >
        <div className="space-y-2">
          <Controller
            name="first_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="first_name">Nombre *</FieldLabel>
                <Input
                  {...field}
                  id="first_name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Juan"
                  autoComplete="given-name"
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
            name="last_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="last_name">Apellido</FieldLabel>
                <Input
                  {...field}
                  id="last_name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Pérez"
                  autoComplete="family-name"
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="tu@email.com"
                  autoComplete="email"
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
            name="phone_number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="phone_number">
                  Número de Teléfono *
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
                <FieldLabel htmlFor="password">Contraseña *</FieldLabel>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="text-xs" />
                )}
              </Field>
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="password_confirmation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="password_confirmation">
                  Confirmar Contraseña *
                </FieldLabel>
                <Input
                  {...field}
                  id="password_confirmation"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
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
              Creando cuenta...
            </>
          ) : (
            "Crear Cuenta"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
        <a
          href={Pathname.CUSTOMER_LOGIN}
          className="text-primary underline-offset-4 hover:underline font-medium"
        >
          Inicia sesión aquí
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
