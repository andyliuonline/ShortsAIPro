<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceCanonicalDomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->header('host');

        if (app()->environment('local')) {
            return $next($request);
        }

        // If host starts with www. or is not https
        if (str_starts_with($host, 'www.') || !$request->secure()) {
            $newHost = str_replace('www.', '', $host);
            return redirect()->to('https://' . $newHost . $request->getRequestUri(), 301);
        }

        return $next($request);
    }
}
