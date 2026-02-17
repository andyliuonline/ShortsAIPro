<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\RemakeTaskResource\Pages;
use App\Filament\Admin\Resources\RemakeTaskResource\RelationManagers;
use App\Models\RemakeTask;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RemakeTaskResource extends Resource
{
    protected static ?string $model = RemakeTask::class;

    protected static ?string $navigationIcon = 'heroicon-o-video-camera';

    protected static ?string $navigationLabel = '任務監控';

    protected static ?string $modelLabel = '生成任務';

    protected static ?string $pluralModelLabel = '任務監控';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('任務詳情')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('使用者')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->required(),
                        Forms\Components\TextInput::make('status')
                            ->label('狀態')
                            ->required(),
                        Forms\Components\TextInput::make('progress')
                            ->label('進度')
                            ->numeric()
                            ->suffix('%'),
                        Forms\Components\TextInput::make('model_used')
                            ->label('使用模型'),
                    ])->columns(2),

                Forms\Components\Section::make('內容詳情')
                    ->schema([
                        Forms\Components\TextInput::make('original_title')
                            ->label('原片標題'),
                        Forms\Components\TextInput::make('optimized_title')
                            ->label('優化標題'),
                        Forms\Components\Textarea::make('visual_prompt')
                            ->label('視覺提示詞')
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('影片連結')
                    ->schema([
                        Forms\Components\TextInput::make('video_url')
                            ->label('生成影片網址')
                            ->url(),
                        Forms\Components\TextInput::make('youtube_url')
                            ->label('YouTube 網址')
                            ->url(),
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
                Tables\Columns\TextColumn::make('status')
                    ->label('狀態')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'success' => 'success',
                        'fail' => 'danger',
                        'pending' => 'warning',
                        'running' => 'info',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('progress')
                    ->label('進度')
                    ->suffix('%')
                    ->sortable(),
                Tables\Columns\TextColumn::make('optimized_title')
                    ->label('優化標題')
                    ->limit(20)
                    ->searchable(),
                Tables\Columns\TextColumn::make('model_used')
                    ->label('模型')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('建立時間')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('狀態過濾')
                    ->options([
                        'success' => '成功',
                        'fail' => '失敗',
                        'pending' => '待處理',
                        'running' => '生成中',
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
            'index' => Pages\ManageRemakeTasks::route('/'),
        ];
    }
}
