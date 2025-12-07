<?php

namespace App\Http\Controllers\Business;

use App\Enums\PointsOperation;
use App\Http\Resources\PurchaseResource;
use App\Models\CustomerBusiness;
use App\Models\PointsLedger;
use App\Models\Purchase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    /**
     * Get paginated list of purchases with filters
     */
    public function get(Request $request): JsonResponse
    {
        $businessId = $request->user()->business_id;
        $perPage = (int) $request->input('per_page', 15);
        $search = $request->input('search');
        $paymentMethod = $request->input('payment_method');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $query = Purchase::where('business_id', $businessId)
            ->with(['customer'])
            ->orderByDesc('created_at');

        if ($search) {
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        if ($paymentMethod) {
            $query->where('payment_method', $paymentMethod);
        }

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $purchases = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Compras obtenidas exitosamente',
            'data' => [
                'purchases' => PurchaseResource::collection($purchases->items()),
                'pagination' => [
                    'total' => $purchases->total(),
                    'perPage' => $purchases->perPage(),
                    'currentPage' => $purchases->currentPage(),
                    'lastPage' => $purchases->lastPage(),
                    'from' => $purchases->firstItem(),
                    'to' => $purchases->lastItem(),
                    'hasNextPage' => $purchases->hasMorePages(),
                    'hasPreviousPage' => $purchases->currentPage() > 1,
                ],
            ],
        ]);
    }

    /**
     * Create a new purchase and assign points
     */
    public function create(Request $request): JsonResponse
    {
        $user = $request->user();
        $businessId = $user->business_id;

        $data = $request->validate([
            'customer_id' => ['required', 'uuid', 'exists:customers,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'points' => ['required', 'integer', 'min:0'],
            'payment_method' => ['required', 'string', 'max:255'],
        ]);

        // Create purchase
        $purchase = Purchase::create([
            'business_id' => $businessId,
            'customer_id' => $data['customer_id'],
            'amount' => $data['amount'],
            'points' => $data['points'],
            'payment_method' => $data['payment_method'],
        ]);

        // Update or create customer_business relation using DB query
        $customerBusiness = CustomerBusiness::where([
            'business_id' => $businessId,
            'customer_id' => $data['customer_id'],
        ])->first();

        if ($customerBusiness) {
            // Update existing record using raw query
            \DB::table('customer_business')
                ->where('business_id', $businessId)
                ->where('customer_id', $data['customer_id'])
                ->update([
                    'cached_points' => \DB::raw('cached_points + ' . $data['points']),
                    'total_visits' => \DB::raw('total_visits + 1'),
                    'last_visit_at' => now(),
                    'updated_at' => now(),
                ]);
        } else {
            // Create new record
            CustomerBusiness::create([
                'business_id' => $businessId,
                'customer_id' => $data['customer_id'],
                'cached_points' => $data['points'],
                'total_visits' => 1,
                'last_visit_at' => now(),
            ]);
        }

        // Record in points ledger
        PointsLedger::create([
            'business_id' => $businessId,
            'customer_id' => $data['customer_id'],
            'purchase_id' => $purchase->id,
            'points_change' => $data['points'],
            'type' => PointsOperation::PURCHASE->value,
            'reason' => 'Compra',
        ]);

        $purchase->load('customer');

        return response()->json([
            'success' => true,
            'message' => 'Compra creada exitosamente',
            'data' => [
                'purchase' => new PurchaseResource($purchase),
            ],
        ], 201);
    }
}
