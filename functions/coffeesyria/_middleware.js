export async function onRequest(context) {
  const { request, env } = context;
  const expectedUser = env.COFFEESYRIA_USER;
  const expectedPass = env.COFFEESYRIA_PASS;

  const auth = request.headers.get("Authorization");
  if (auth && auth.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === expectedUser && pass === expectedPass) {
      return context.next();
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="coffeesyria"' },
  });
}
