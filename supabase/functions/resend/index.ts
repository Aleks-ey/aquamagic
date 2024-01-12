// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Deno provides these standard library functions:
// Deno.env for accessing environment variables
// fetch for making HTTP requests

addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Only POST requests are allowed', { status: 405 });
    }
  
    try {
        // You can destructure your request body as needed
        const { to, subject, html } = await request.json();
  
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY'); // Ensure this is set in your environment
        const emailHtmlContent = `
            <h1>Hello Natasha,</h1>
            <p>There's been a new registration for Bure Aqua. Here are the details:</p>
            <ul>
                <li>First Name: -</li>
                <li>Last Name: -</li>
                <!-- Add more list items for other registration data fields -->
            </ul>
            `;

        const response = await fetch('https://api.resend.io/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'team@bure-aqua.com', // verified sender email address
                to: 'akhukhua@yahoo.com', // Recipient email address
                subject: 'test', // Email subject
                html: emailHtmlContent, // Email content in HTML
            }),
        });
  
        if (!response.ok) {
            throw new Error(`Error from Resend API: ${response.statusText}`);
        }
  
        const data = await response.json();
        return new Response(JSON.stringify({ message: "Email sent successfully", data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to send email", error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
  
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resend' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
