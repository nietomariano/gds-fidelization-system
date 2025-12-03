<?php

namespace App\Http\Controllers\Business;

use App\Enums\ErrorSubCode;
use App\Http\Requests\Business\Customers\CreateCustomerRequest;
use App\Http\Requests\Business\Customers\GetPaginatedCustomersRequest;
use App\Http\Requests\Business\Customers\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\CustomerBusiness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller {

  public function create(CreateCustomerRequest $request): JsonResponse {
    $validated = $request->validated();

    $user = $request->user();
    $phone_number = phone($validated['phone_number'], 'AR', 'INTERNATIONAL');

    $customer = Customer::wherePhoneNumber($phone_number)->first();

    if ($customer) {
      $query = CustomerBusiness::where('business_id', $user->business_id)
        ->where('customer_id', $customer->id)
        ->withTrashed();
        
      $customerBusiness = $query->first();

      if ($customerBusiness && $customerBusiness->deleted_at === null) {
        throwAppError('El número de teléfono pertenece a un cliente ya registrado.', 400, [
          'customer' => new \App\Http\Resources\CustomerResource($customerBusiness->customer)
        ], ErrorSubCode::PHONE_NUMBER_ALREADY_USED_BY_ANOTHER_CUSTOMER);
      } 

      if ($customerBusiness && $customerBusiness->deleted_at !== null) {
        $query->restore();

        return successResponse('Cliente creado exitosamente', ['customer' => new \App\Http\Resources\CustomerResource($customer)], 201);
      }

      $customerBusiness = CustomerBusiness::create([
          'business_id' => $user->business_id,
          'customer_id' => $customer->id,
          'cached_points' => 0
        ]);

      return successResponse('Cliente creado exitosamente', ['customer' => new \App\Http\Resources\CustomerResource($customer)], 201);
    }

    $customer = DB::transaction(function () use ($validated, $phone_number, $user) {
      $customer = Customer::create([
        'first_name' => $validated['first_name'],
        'last_name' => $validated['last_name'] ?? null,
        'email' => $validated['email'] ?? null,
        'phone_number' => $phone_number
      ]);

      CustomerBusiness::create([
        'business_id' => $user->business_id,
        'customer_id' => $customer->id,
        'cached_points' => 0
      ]);

      return $customer;
    });


    return successResponse('Cliente creado exitosamente', ['customer' => new \App\Http\Resources\CustomerResource($customer)], 201);
  }  

  public function get(GetPaginatedCustomersRequest $request) {
    $validated = $request->validated();

    $businessId = $request->user()->business_id;

    $page = $validated['page'] ?? 1;
    $perPage = $validated['per_page'] ?? 10;
    $search = $validated['search'] ?? null;
    $lastVisitedAfter = $validated['last_visited_after'] ?? null;
    $lastVisitedBefore = $validated['last_visited_before'] ?? null;

    $query = CustomerBusiness::where('business_id', $businessId)->orderByDesc('updated_at');

    if ($search) {
      $query->whereHas('customer', function ($q) use ($search) {
        $q->where('first_name', 'like', '%' . $search . '%')
          ->orWhere('last_name', 'like', '%' . $search . '%')
          ->orWhere('email', 'like', '%' . $search . '%')
          ->orWhere('phone_number', 'like', '%' . $search . '%');
      });
    }

    if ($lastVisitedAfter) {
      $query->whereHas('customer', function ($q) use ($lastVisitedAfter) {
        $q->where('updated_at', '>=', $lastVisitedAfter);
      });
    }

    if ($lastVisitedBefore) {
      $query->whereHas('customer', function ($q) use ($lastVisitedBefore) {
        $q->where('updated_at', '<=', $lastVisitedBefore);
      });
    }

    $customers = $query->with('customer')->paginate($perPage, ['*'], 'page', $page);

    return response()->json([
      'success' => true,
      'message' => 'Clientes obtenidos exitosamente',
      'status' => 200,
      'data' => \App\Http\Resources\CustomerBusinessResource::collection($customers->items())->resolve(),
      'pagination' => [
        'total' => $customers->total(),
        'perPage' => $customers->perPage(),
        'currentPage' => $customers->currentPage(),
        'lastPage' => $customers->lastPage(),
        'from' => $customers->firstItem(),
        'to' => $customers->lastItem(),
        'hasNextPage' => $customers->hasMorePages(),
        'hasPreviousPage' => $customers->currentPage() > 1
      ],
    ]);
  }

  public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse {
    $validated = $request->validated();

    if ($customer->isAlreadyValidated()) {
      throwAppError('No puedes modificar un cliente que se ha registrado en la aplicación.', 400, [
        'title' => 'Cliente registrado en la app',
        'message' => 'El cliente ' . $customer->first_name . ' ' . $customer->last_name . ' se ha registrado en la aplicación y por lo tanto solo él puede modificar sus datos.',
        'customer' => new \App\Http\Resources\CustomerResource($customer)       
      ], ErrorSubCode::CUSTOMER_ALREADY_VERIFIED);
    }

    /**
     * If the customer has already validated their phone number, only him can update it
     */
    if (isset($validated['phone_number'])) {
      $phone_number = phone($validated['phone_number'], 'AR', 'INTERNATIONAL');
      $customer->phone_number = $phone_number;
    }

    if (isset($validated['first_name'])) {
      $customer->first_name = $validated['first_name'];
    }

    if (isset($validated['last_name'])) {
      $customer->last_name = $validated['last_name'];
    }

    if (isset($validated['email'])) {
      $customer->email = $validated['email'];
    }

    $customer->save();

    return successResponse('Cliente actualizado exitosamente', ['customer' => $customer]);
  }

  public function deleteCustomerRelation(Request $request, string $customerId): JsonResponse {
    $businessId = $request->user()->business_id;

    $query = CustomerBusiness::where('business_id', $businessId)
      ->where('customer_id', $customerId);

    $customerBusiness = $query->first();

    if (!$customerBusiness) {
        throwAppError('No hemos encontrado un cliente con el ID especificado.', 404, [
            'customer_id' => $customerId
        ]);
    }

    $query->delete();

    return successResponse('Cliente eliminado exitosamente', null);
  }

  public function getCustomersDashboard(Request $request): JsonResponse {
    $businessId = $request->user()->business_id;

    $query = CustomerBusiness::where('business_id', $businessId);

    $totalCustomers = $query->count();

    $totalVisits = $query->sum('total_visits');

    $totalPoints = $query->sum('cached_points');

    $visitsAverage = $totalCustomers > 0 ? $totalVisits / $totalCustomers : 0;

    return successResponse('Dashboard de clientes obtenido exitosamente', [
      'totalCustomers' => $totalCustomers,
      'totalVisits' => $totalVisits,
      'totalPoints' => $totalPoints,
      'visitsAverage' => $visitsAverage
    ]);
  }
}