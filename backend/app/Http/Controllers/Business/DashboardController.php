<?php

namespace App\Http\Controllers\Business;

use App\Models\CustomerBusiness;
use App\Models\PointsLedger;
use App\Models\Purchase;
use App\Models\Redeem;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function getStats(Request $request)
    {
        $businessId = $request->user()->business_id;
        
        \Log::info('Dashboard Stats - Business ID: ' . $businessId);
        
        // Current month dates
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $startOfLastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();

        // Active customers (with visits in last 3 months)
        $activeCustomers = CustomerBusiness::where('business_id', $businessId)
            ->where('last_visit_at', '>=', Carbon::now()->subMonths(3))
            ->count();
        
        \Log::info('Active customers: ' . $activeCustomers);

        $lastMonthActiveCustomers = CustomerBusiness::where('business_id', $businessId)
            ->whereBetween('last_visit_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        // Points awarded this month
        $pointsLedgerQuery = PointsLedger::where('business_id', $businessId)
            ->where('type', 'purchase')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth]);
        
        \Log::info('Points Ledger SQL: ' . $pointsLedgerQuery->toSql());
        \Log::info('Points Ledger Count: ' . $pointsLedgerQuery->count());
        
        $pointsAwarded = $pointsLedgerQuery->sum('points_change');
        
        \Log::info('Points awarded: ' . $pointsAwarded);

        $lastMonthPoints = PointsLedger::where('business_id', $businessId)
            ->where('type', 'purchase')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('points_change');

        // Rewards redeemed this month
        $rewardsRedeemed = Redeem::where('business_id', $businessId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();

        $lastMonthRedeems = Redeem::where('business_id', $businessId)
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        // Retention rate (customers with 2+ visits in last 3 months)
        $totalCustomers = CustomerBusiness::where('business_id', $businessId)
            ->where('last_visit_at', '>=', Carbon::now()->subMonths(3))
            ->count();

        $recurringCustomers = CustomerBusiness::where('business_id', $businessId)
            ->where('total_visits', '>=', 2)
            ->where('last_visit_at', '>=', Carbon::now()->subMonths(3))
            ->count();

        $retentionRate = $totalCustomers > 0 ? round(($recurringCustomers / $totalCustomers) * 100, 1) : 0;

        // Calculate changes
        $customersChange = $lastMonthActiveCustomers > 0 
            ? round((($activeCustomers - $lastMonthActiveCustomers) / $lastMonthActiveCustomers) * 100, 1)
            : 0;

        $pointsChange = $lastMonthPoints > 0
            ? round((($pointsAwarded - $lastMonthPoints) / $lastMonthPoints) * 100, 1)
            : 0;

        $redeemsChange = $lastMonthRedeems > 0
            ? round((($rewardsRedeemed - $lastMonthRedeems) / $lastMonthRedeems) * 100, 1)
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'activeCustomers' => $activeCustomers,
                'activeCustomersChange' => $customersChange,
                'pointsAwarded' => $pointsAwarded,
                'pointsAwardedChange' => $pointsChange,
                'rewardsRedeemed' => $rewardsRedeemed,
                'rewardsRedeemedChange' => $redeemsChange,
                'retentionRate' => $retentionRate,
            ],
        ]);
    }

    /**
     * Get points chart data (last 30 days)
     */
    public function getPointsChart(Request $request)
    {
        $businessId = $request->user()->business_id;
        
        $data = PointsLedger::where('business_id', $businessId)
            ->where('type', 'purchase')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(points_change) as points')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('d M'),
                    'puntos' => (int) $item->points,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Get rewards chart data (top 5 most redeemed)
     */
    public function getRewardsChart(Request $request)
    {
        $businessId = $request->user()->business_id;

        $data = Redeem::where('business_id', $businessId)
            ->select('reward_id', DB::raw('COUNT(*) as canjes'))
            ->with('reward:id,name')
            ->groupBy('reward_id')
            ->orderByDesc('canjes')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'recompensa' => $item->reward->name ?? 'N/A',
                    'canjes' => $item->canjes,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Get recent activity
     */
    public function getRecentActivity(Request $request)
    {
        $businessId = $request->user()->business_id;

        // Get recent purchases
        $purchases = Purchase::where('business_id', $businessId)
            ->with('customer:id,first_name,last_name')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($purchase) {
                return [
                    'type' => 'venta',
                    'title' => 'Nueva venta',
                    'description' => ($purchase->customer->first_name ?? 'N/A') . ' ' . 
                                   ($purchase->customer->last_name ?? '') . ' - $' . number_format($purchase->amount, 2),
                    'time' => $purchase->created_at->diffForHumans(),
                    'badge' => '+' . $purchase->points . ' puntos',
                ];
            });

        // Get recent redeems
        $redeems = Redeem::where('business_id', $businessId)
            ->with(['customer:id,first_name,last_name', 'reward:id,name'])
            ->latest()
            ->limit(2)
            ->get()
            ->map(function ($redeem) {
                return [
                    'type' => 'canje',
                    'title' => 'Canje de recompensa',
                    'description' => ($redeem->customer->first_name ?? 'N/A') . ' ' . 
                                   ($redeem->customer->last_name ?? '') . ' - ' . ($redeem->reward->name ?? 'N/A'),
                    'time' => $redeem->created_at->diffForHumans(),
                    'badge' => '-' . $redeem->points_redeemed . ' puntos',
                ];
            });

        $activities = $purchases->concat($redeems)->sortByDesc('time')->take(5)->values();

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * Get top customers
     */
    public function getTopCustomers(Request $request)
    {
        $businessId = $request->user()->business_id;

        $customers = CustomerBusiness::where('business_id', $businessId)
            ->with('customer:id,first_name,last_name')
            ->orderByDesc('cached_points')
            ->limit(5)
            ->get()
            ->map(function ($cb, $index) {
                $points = $cb->cached_points;
                $tier = $points >= 1000 ? 'Gold' : ($points >= 500 ? 'Silver' : 'Bronze');

                return [
                    'rank' => $index + 1,
                    'name' => ($cb->customer->first_name ?? 'N/A') . ' ' . ($cb->customer->last_name ?? ''),
                    'initials' => strtoupper(substr($cb->customer->first_name ?? 'N', 0, 1) . 
                                            substr($cb->customer->last_name ?? 'A', 0, 1)),
                    'points' => $cb->cached_points,
                    'visits' => $cb->total_visits,
                    'tier' => $tier,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $customers,
        ]);
    }
}
