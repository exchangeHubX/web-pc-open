const DOCS_PREFIX = '/api-docs';
const DOCS_ORIGIN = 'https://exchangehubx.github.io';

function buildDocsUrl(requestUrl) {
  const upstreamUrl = new URL(DOCS_ORIGIN);
  const strippedPath = requestUrl.pathname.slice(DOCS_PREFIX.length) || '/';

  upstreamUrl.pathname = strippedPath;
  upstreamUrl.search = requestUrl.search;

  return upstreamUrl;
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname === DOCS_PREFIX) {
      requestUrl.pathname = `${DOCS_PREFIX}/`;
      return Response.redirect(requestUrl.toString(), 301);
    }

    if (requestUrl.pathname.startsWith(`${DOCS_PREFIX}/`)) {
      const upstreamUrl = buildDocsUrl(requestUrl);

      return fetch(
        new Request(upstreamUrl.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.body,
          redirect: 'manual',
        }),
      );
    }

    return env.ASSETS.fetch(request);
  },
};