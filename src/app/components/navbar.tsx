"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components = [
  {
    title: "Upload Tool",
    href: "/upload",
    description: "Upload and manage your custom tools.",
  },
  {
    title: "Browse Tools",
    href: "/browse",
    description: "Discover and use existing tools shared by the community.",
  },
];

function ListItem({
  title,
  children,
  href,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <div className="text-sm font-medium">{title}</div>
          <p className="text-muted-foreground text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function NavbarButtons() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3">
      {session ? (
        <>
          <span className="text-sm font-medium">{session.user?.name}</span>
          <Button variant="outline" onClick={() => signOut()}>
            Logout
          </Button>
        </>
      ) : (
        <Button onClick={() => signIn("github")}>Login with GitHub</Button>
      )}
    </div>
  );
}

export function Navbar() {
  return (
    <nav className="flex items-center justify-between w-full px-6 py-3 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="font-bold text-lg">
        NextOS
      </Link>

      {/* Navigation */}
      <NavigationMenu>
        <NavigationMenuList className="flex items-center space-x-4">
          <NavigationMenuItem>
          <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      NextOS
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      The next layer where AI meets developer tools.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/browse" title="Discover Tools">
                Browse AI-ready tools created by developers.
              </ListItem>
              <ListItem href="/upload" title="Upload & Share">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs" title="Documentation">
                Guides, tutorials, and best practices for building tools.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              asChild
            >
              <Link href="/docs">Docs</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Login / Logout */}
      <NavbarButtons />
    </nav>
  );
}
