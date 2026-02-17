<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\SubscriptionResource\Pages;
use App\Filament\Admin\Resources\SubscriptionResource\RelationManagers;
use App\Models\Subscription;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SubscriptionResource extends Resource
{
    protected static ?string $model = Subscription::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('訂閱詳情')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('使用者')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->required(),
                        Forms\Components\Select::make('plan')
                            ->label('方案')
                            ->options([
                                'basic' => '基礎版',
                                'standard' => '標準版',
                                'pro' => '專業版',
                                'flagship' => '旗艦版',
                            ])
                            ->required(),
                        Forms\Components\TextInput::make('amt')
                            ->label('金額 (TWD)')
                            ->numeric()
                            ->prefix('NT$')
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->label('付款狀態')
                            ->options([
                                'paid' => '已付款',
                                'pending' => '待付款',
                                'failed' => '失敗',
                            ])
                            ->required(),
                        Forms\Components\DateTimePicker::make('paid_at')
                            ->label('付款時間'),
                    ])->columns(2),

                Forms\Components\Section::make('交易資訊')
                    ->schema([
                        Forms\Components\TextInput::make('merchant_order_no')
                            ->label('商家訂單號'),
                        Forms\Components\TextInput::make('trade_no')
                            ->label('金流交易號'),
                        Forms\Components\TextInput::make('payment_type')
                            ->label('付款方式'),
                        Forms\Components\TextInput::make('invoice_no')
                            ->label('發票號碼'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('使用者')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('plan')
                    ->label('方案')
                    ->badge()
                    ->color('info'),
                Tables\Columns\TextColumn::make('amt')
                    ->label('金額')
                    ->money('TWD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('狀態')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('paid_at')
                    ->label('付款時間')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('merchant_order_no')
                    ->label('訂單號')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('狀態過濾')
                    ->options([
                        'paid' => '已付款',
                        'pending' => '待付款',
                        'failed' => '失敗',
                    ]),
                Tables\Filters\SelectFilter::make('plan')
                    ->label('方案過濾')
                    ->options([
                        'basic' => '基礎版',
                        'standard' => '標準版',
                        'pro' => '專業版',
                        'flagship' => '旗艦版',
                    ]),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageSubscriptions::route('/'),
        ];
    }
}
