// Clerk proxy handler for Cloudflare Pages
// Proxies all requests from /.clerk/* to Clerk's Frontend API

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Remove the /.clerk prefix to get the Clerk API path
  const clerkPath = url.pathname.replace(/^\/.clerk\/?/, '');
  
  // Build the Clerk API URL
  const clerkApiUrl = `https://frontend-api.clerk.services/${clerkPath}${url.search}`;
  
  // Clone headers and set the correct Host
  const headers = new Headers(request.headers);
  headers.set('Host', 'frontend-api.clerk.services');
  headers.delete('cf-connecting-ip');
  headers.delete('cf-ray');
  headers.delete('cf-visitor');
  headers.delete('cf-ipcountry');
  
  try {
    // Forward the request to Clerk
    const clerkResponse = await fetch(clerkApiUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? request.body 
        : undefined,
      redirect: 'manual',
    });
    
    // Build response headers
    const responseHeaders = new Headers(clerkResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    
    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }
    
    // Return Clerk's response
    return new Response(clerkResponse.body, {
      status: clerkResponse.status,
      statusText: clerkResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Clerk proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
