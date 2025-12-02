import React from "react";
import { RewardsService } from "../../../api/business/reward/reward.service";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Gift } from "lucide-react"

interface Reward {
  id: string
  name: string
  cost: number
}


const service = new RewardsService();

function RecompensasPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [newRewardName, setNewRewardName] = useState("")
  const [newRewardPoints, setNewRewardPoints] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Cargar recompensas al montar el componente
  useEffect(() => {
    loadRewards()
  }, [])

  const loadRewards = async () => {
    try {
      setIsLoading(true)
      console.log('Cargando recompensas...')
      const response = await service.getRewards()
      console.log('Respuesta del servidor:', response)
      setRewards(response.data.rewards)
    } catch (error) {
      console.error('Error al cargar recompensas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newRewardName.trim() || !newRewardPoints) {
      console.log('Validación falló:', { newRewardName, newRewardPoints })
      return
    }

    try {
      setIsLoading(true)
      console.log('Creando recompensa:', {
        name: newRewardName.trim(),
        cost: Number.parseInt(newRewardPoints),
      })
      
      const response = await service.createReward({
        name: newRewardName.trim(),
        cost: Number.parseInt(newRewardPoints),
      })
      
      console.log('Recompensa creada:', response)
      
      // Recargar la lista después de crear
      await loadRewards()
      
      setNewRewardName("")
      setNewRewardPoints("")
    } catch (error) {
      console.error('Error al crear recompensa:', error)
      alert('Error al crear recompensa. Revisa la consola.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true)
      await service.deleteReward(id)
      
      // Recargar la lista después de eliminar
      await loadRewards()
    } catch (error) {
      console.error('Error al eliminar recompensa:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground">Recompensas</h1>
          <p className="text-muted-foreground mt-1">Configura las recompensas disponibles para tus clientes</p>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Crear nueva recompensa</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Nombre del beneficio</label>
              <Input
                placeholder="Ej: Café gratis"
                value={newRewardName}
                onChange={(e) => setNewRewardName(e.target.value)}
              />
            </div>
            <div className="w-40">
              <label className="text-sm font-medium text-foreground mb-2 block">Puntos</label>
              <Input
                type="number"
                placeholder="100"
                value={newRewardPoints}
                onChange={(e) => setNewRewardPoints(e.target.value)}
              />
            </div>
            <Button onClick={handleCreate} className="gap-2" disabled={isLoading}>
              <Plus className="w-4 h-4" />
              {isLoading ? 'Creando...' : 'Crear'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recompensas activas</h2>

          {rewards.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No hay recompensas configuradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground">{reward.cost} puntos</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(reward.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

export default React.memo(RecompensasPage);
