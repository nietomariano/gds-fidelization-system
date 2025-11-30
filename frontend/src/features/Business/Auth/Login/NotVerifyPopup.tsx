import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { MailWarning } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useStore } from "@nanostores/react";
import { notVerifyPopupData } from "../../../../store/auth";
import { AuthService } from "../../../../api/business/auth/auth.service";
import type { SuccessResponse } from "../../../../api/types/Response";
import { toast } from "sonner";
import type { ApiError } from "../../../../api/types/Error";

function NotVerifyPopup() {
  const [isResending, setIsResending] = useState(false);

  const data = useStore(notVerifyPopupData);

  const handleClose = () => {
    notVerifyPopupData.set({ show: false, email: "" });
  };

  const handleSuccess = (r: SuccessResponse) => {
    toast.success(r.message);

    handleClose();
  };

  const handleError = (error: any) => {
    const fullError = JSON.stringify(error.response ?? error, null, 2);

    toast.error(fullError);
  };

  const handleResendEmail = () => {
    const service = new AuthService();

    setIsResending(true);

    service
      .resendVerificationEmail(data.email)
      .then(handleSuccess)
      .catch(handleError)
      .finally(() => setIsResending(false));
  };

  return (
    <Dialog open={data.show} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100'>
            <MailWarning className='h-6 w-6 text-yellow-600' />
          </div>
          <DialogTitle className='text-center'>Email no verificado</DialogTitle>
          <DialogDescription className='text-center'>
            Necesitas verificar tu dirección de email antes de poder iniciar
            sesión. Revisa tu bandeja de entrada y sigue las instrucciones del
            email de verificación.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='flex-col sm:flex-col gap-2'>
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            className='w-full'
          >
            {isResending ? "Enviando..." : "Reenviar email de verificación"}
          </Button>
          <Button variant='outline' onClick={handleClose} className='w-full'>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NotVerifyPopup;
