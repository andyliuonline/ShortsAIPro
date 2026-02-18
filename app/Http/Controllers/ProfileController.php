<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'apiSettings' => [
                'video_model_provider' => $request->user()->video_model_provider,
                'video_model_id' => $request->user()->video_model_id,
                'user_kie_api_key' => $request->user()->user_kie_api_key,
                'analysis_model_provider' => $request->user()->analysis_model_provider,
                'user_openai_api_key' => $request->user()->user_openai_api_key,
                'user_anthropic_api_key' => $request->user()->user_anthropic_api_key,
            ],
        ]);
    }

    public function updateApiSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'video_model_provider' => 'required|string',
            'video_model_id' => 'required|string',
            'user_kie_api_key' => 'nullable|string',
            'analysis_model_provider' => 'required|string',
            'user_openai_api_key' => 'nullable|string',
            'user_anthropic_api_key' => 'nullable|string',
        ]);

        $request->user()->fill($validated);
        $request->user()->save();

        return back()->with('status', 'api-settings-updated');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
