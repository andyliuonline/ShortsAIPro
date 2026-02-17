<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Subscription;
use App\Models\User;
use App\Models\WithdrawalRequest;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class RevenueStats extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('總用戶數', User::count())
                ->description('目前系統註冊人數')
                ->descriptionIcon('heroicon-m-users')
                ->color('success'),
            Stat::make('總營收 (NTD)', 'NT$ ' . number_format(Subscription::where('status', 'paid')->sum('amt')))
                ->description('累計已付款金額')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
            Stat::make('待處理提領', WithdrawalRequest::where('status', 'pending')->count())
                ->description('目前等待審核的提領申請')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}
