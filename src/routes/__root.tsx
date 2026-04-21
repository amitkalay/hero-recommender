import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dota 2 Hero Picker — Find Your Perfect Match" },
      { name: "description", content: "Get personalized Dota 2 hero recommendations based on your Steam play history and preferred role." },
      { name: "author", content: "Dota 2 Hero Picker" },
      { property: "og:title", content: "Dota 2 Hero Picker — Find Your Perfect Match" },
      { property: "og:description", content: "Get personalized Dota 2 hero recommendations based on your Steam play history and preferred role." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Dota 2 Hero Picker — Find Your Perfect Match" },
      { name: "twitter:description", content: "Get personalized Dota 2 hero recommendations based on your Steam play history and preferred role." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f70c25aa-0d7f-4281-90fa-71acff066c81/id-preview-fba3aa8b--2c3b9c39-ca6c-443b-a90a-266dc802b9ea.lovable.app-1776789745888.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f70c25aa-0d7f-4281-90fa-71acff066c81/id-preview-fba3aa8b--2c3b9c39-ca6c-443b-a90a-266dc802b9ea.lovable.app-1776789745888.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
