import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone } from "lucide-react"
import { currentCustomer } from "@/lib/mock-data"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground">Información de tu cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Tus datos básicos de perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage src={currentCustomer.profilePic || "/placeholder-user.jpg"} alt={currentCustomer.name} />
              <AvatarFallback>
                {currentCustomer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{currentCustomer.name}</h3>
              <p className="text-sm text-muted-foreground">Cliente desde enero 2025</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="mr-2 inline size-4" />
                Nombre Completo
              </Label>
              <Input id="name" value={currentCustomer.name} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mr-2 inline size-4" />
                Email
              </Label>
              <Input id="email" type="email" value={currentCustomer.email || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="mr-2 inline size-4" />
                Teléfono
              </Label>
              <Input id="phone" type="tel" value={currentCustomer.phoneNumber || ""} disabled />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Esta información es de solo lectura. Para modificar tus datos, contacta al soporte.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
