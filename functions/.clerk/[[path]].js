// Clerk proxy for Cloudflare Pages
// This proxies requests to Clerk's frontend API

export async function onRequest(context) {
  const { request, env } = context;
  
  // Get the path after /.clerk/
  const url = new URL(request.url);
  const clerkPath = url.pathname.replace('/.clerk/', '');
  
  // Construct Clerk API URL
  const clerkUrl = `https://frontend-api.clerk.services/${clerkPath}${url.search}`;
  
  // Forward the request to Clerk
  const clerkResponse = await fetch(clerkUrl, {
    method: request.method,
    headers: {
      ...Object.fromEntries(request.headers),
      'Host': 'frontend-api.clerk.services',
    },
    body: request.method !== 'GET' && request.method !== 'HEAD' 
      ? await request.text() 
      : undefined,
  });
  
  // Return the response from Clerk
  return new Response(clerkResponse.body, {
    status: clerkResponse.status,
    statusText: clerkResponse.statusText,
    headers: clerkResponse.headers,
  });
}
