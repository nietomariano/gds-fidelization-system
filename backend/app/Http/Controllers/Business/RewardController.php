<?php

namespace App\Http\Controllers\Business;

use App\Http\Requests\Business\Reward\CreateRewardRequest;
use App\Http\Requests\Business\Reward\UpdateRewardRequest;
use App\Http\Resources\RewardResource;
use App\Models\Reward;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class RewardController extends Controller
{
    /**
     * GET /business/rewards
     */
    public function get(Request $request): JsonResponse
    {
        $businessId = $request->user()->business_id;

        $rewards = Reward::where('business_id', $businessId)
            ->orderByDesc('created_at')
            ->get();

        return successResponse(
            'Recompensas obtenidas exitosamente',
            ['rewards' => RewardResource::collection($rewards)]
        );
    }

    /**
     * POST /business/rewards
     */
    public function create(CreateRewardRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $reward = Reward::create([
            'name'        => $validated['name'],
            'cost'        => $validated['cost'],
            'business_id' => $user->business_id,
        ]);

        return successResponse(
            'Recompensa creada exitosamente',
            ['reward' => new RewardResource($reward)],
            201
        );
    }


    /**
     * PUT /business/rewards/{reward}
     */
    public function update(UpdateRewardRequest $request, Reward $reward): JsonResponse
    {
        $userBusiness = $request->user()->business_id;

        // Seguridad: evitar editar rewards de otro negocio
        if ($reward->business_id !== $userBusiness) {
            throwAppError(
                'No tienes permiso para modificar esta recompensa.',
                403,
                ['reward_id' => $reward->id]
            );
        }

        $validated = $request->validated();

        if (isset($validated['name'])) {
            $reward->name = $validated['name'];
        }

        if (isset($validated['cost'])) {
            $reward->cost = $validated['cost'];
        }

        $reward->save();

        return successResponse(
            'Recompensa actualizada exitosamente',
            ['reward' => new RewardResource($reward)]
        );
    }

    /**
     * DELETE /business/rewards/{rewardId}
     */
    public function delete(Request $request, string $rewardId): JsonResponse
    {
        $businessId = $request->user()->business_id;

        $reward = Reward::where('business_id', $businessId)
            ->where('id', $rewardId)
            ->first();

        if (!$reward) {
            throwAppError(
                'No se encontró la recompensa especificada.',
                404,
                ['reward_id' => $rewardId]
            );
        }

        $reward->delete();

        return successResponse('Recompensa eliminada exitosamente');
    }
}
