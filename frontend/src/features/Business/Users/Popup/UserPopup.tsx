import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { useStore } from "@nanostores/react";
import { userPopupData } from "../../../../store/business/users";
import { Button } from "../../../../components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Role } from "../../../../api/types/Enums/Role";
import { UsersService } from "../../../../api/business/users/users.service";
import { Field, FieldError, FieldLabel } from "../../../../components/ui/field";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import getRoleName from "../../../../lib/utils/getRoleName";
import type { ApiError } from "../../../../api/types/Error";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { queryClient } from "../../../../lib/queryClient";
import { Spinner } from "../../../../components/ui/spinner";

const schema = z.object({
  first_name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  last_name: z
    .string()
    .max(50, "El apellido no puede tener más de 50 caracteres")
    .optional(),
  email: z.string().email("El correo electrónico no es válido"),
  phone_number: z.string().optional(),
  role: z.enum([Role.ADMIN, Role.USER]),
});

function UserPopup() {
  const [isLoading, setIsLoading] = useState(false);

  const $data = useStore(userPopupData);

  const isDialogOpen = $data.isOpen;

  const editingUser = $data.id !== undefined;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),

    defaultValues: {
      first_name: $data.firstName || "",
      last_name: $data.lastName || "",
      email: $data.email || "",
      phone_number: $data.phoneNumber || "",
      role: ($data.role as Role.ADMIN | Role.USER) || Role.USER,
    },
  });

  const handleClose = () => {
    userPopupData.set({ isOpen: false });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const handleCreateError = (error: ApiError) => {
    if (
      error.status === HttpStatusCode.UnprocessableEntity &&
      error.data?.errors
    ) {
      const errors = error.data.errors;

      errors.forEach((e: any) => {
        form.setError(e.field as keyof z.infer<typeof schema>, {
          type: "server",
          message: e.message,
        });
      });

      return;
    }

    toast.error(error.data?.title ?? error?.message, {
      description: error.data?.message,
    });
  };

  const handleSuccess = () => {
    toast.success(
      editingUser
        ? "Usuario actualizado exitosamente"
        : "Usuario creado exitosamente"
    );

    queryClient.invalidateQueries({ queryKey: ["users"] });

    handleClose();
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    const service = new UsersService();

    setIsLoading(true);

    if (!editingUser) {
      service.createUser(data).then(handleSuccess).catch(handleCreateError);
    } else if ($data.id) {
      service
        .updateUser($data.id as string, data)
        .then(handleSuccess)
        .catch(handleCreateError);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit(onSubmit)();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Editar Usuario" : "Agregar Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Modifica la información del usuario"
              : "Completa los datos del nuevo usuario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Controller
                  name='first_name'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='gap-1'>
                      <FieldLabel htmlFor='first_name'>Nombre</FieldLabel>

                      <Input
                        {...field}
                        id='business_name'
                        aria-invalid={fieldState.invalid}
                        placeholder='Nombre del usuario'
                        autoComplete='off'
                      />

                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className='text-xs'
                        />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className='space-y-2'>
                <Controller
                  name='last_name'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='gap-1'>
                      <FieldLabel htmlFor='last_name'>Apellido</FieldLabel>

                      <Input
                        {...field}
                        id='last_name'
                        aria-invalid={fieldState.invalid}
                        placeholder='Apellido del usuario'
                        autoComplete='off'
                      />

                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className='text-xs'
                        />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className='gap-1'>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>

                    <Input
                      {...field}
                      id='email'
                      aria-invalid={fieldState.invalid}
                      placeholder='usuario@email.com'
                      disabled={$data.isActive}
                      autoComplete='off'
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className='text-xs'
                      />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className='space-y-2'>
              <Controller
                name='phone_number'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className='gap-1'>
                    <FieldLabel htmlFor='phone_number'>Teléfono</FieldLabel>

                    <Input
                      {...field}
                      id='phone_number'
                      aria-invalid={fieldState.invalid}
                      placeholder='+54 11 1234-5678'
                      disabled={$data.isActive}
                      autoComplete='off'
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className='text-xs'
                      />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className='space-y-2'>
              <Controller
                name='role'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation='responsive'
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor='role'>Rol</FieldLabel>

                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id='role'
                        aria-invalid={fieldState.invalid}
                        className='min-w-[120px]'
                      >
                        <SelectValue placeholder='Rol del usuario' />
                      </SelectTrigger>

                      <SelectContent position='item-aligned'>
                        <SelectItem value={Role.USER}>
                          {getRoleName(Role.USER)}
                        </SelectItem>
                        <SelectItem value={Role.ADMIN}>
                          {getRoleName(Role.ADMIN)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancelar
            </Button>

            <Button type='submit'>
              Guardar Cambios
              {isLoading && <Spinner className='stroke-background w-4 h-4' />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(UserPopup);
