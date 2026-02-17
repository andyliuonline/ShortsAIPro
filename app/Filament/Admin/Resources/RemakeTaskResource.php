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

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->required(),
                Forms\Components\TextInput::make('status')->required(),
                Forms\Components\TextInput::make('progress')->numeric(),
                Forms\Components\TextInput::make('original_title'),
                Forms\Components\Textarea::make('visual_prompt'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')->searchable(),
                Tables\Columns\TextColumn::make('status')->badge(),
                Tables\Columns\TextColumn::make('progress')->suffix('%'),
                Tables\Columns\TextColumn::make('original_title')->limit(30),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
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
