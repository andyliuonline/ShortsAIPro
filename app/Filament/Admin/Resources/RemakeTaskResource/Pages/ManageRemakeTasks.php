<?php

namespace App\Filament\Admin\Resources\RemakeTaskResource\Pages;

use App\Filament\Admin\Resources\RemakeTaskResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageRemakeTasks extends ManageRecords
{
    protected static string $resource = RemakeTaskResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
