export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/coffeesyria" || url.pathname.startsWith("/coffeesyria/")) {
      const auth = request.headers.get("Authorization");
      let authorized = false;

      if (auth && auth.startsWith("Basic ")) {
        const decoded = atob(auth.slice(6));
        const sep = decoded.indexOf(":");
        const user = decoded.slice(0, sep);
        const pass = decoded.slice(sep + 1);
        authorized = user === env.COFFEESYRIA_USER && pass === env.COFFEESYRIA_PASS;
      }

      if (!authorized) {
        return new Response("Authentication required", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="coffeesyria"' },
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
