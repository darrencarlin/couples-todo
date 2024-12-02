import { capitalize } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
  page: string[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ page }) => {
  const renderBreadcrumbItems = () => {
    return page.map((segment, index) => {
      const isLastItem = index === page.length - 1;

      // Handle special case for root/home
      if (segment === "/") {
        return (
          <BreadcrumbItem
            key="home"
            href="/"
            label="Home"
            isLast={isLastItem}
          />
        );
      }

      // Build cumulative path for previous items
      const path = page
        .slice(0, index + 1)
        .filter((p) => p !== "/")
        .join("/");

      // For other segments
      return (
        <BreadcrumbItem
          key={segment}
          href={`/${path}`}
          label={capitalize(segment)}
          isLast={isLastItem}
        />
      );
    });
  };

  return (
    <nav
      className="flex flex-row items-center w-full-lg bg-neutral-100 p-2 mb-4 text-sm"
      aria-label="Breadcrumb"
    >
      {renderBreadcrumbItems()}
    </nav>
  );
};

// Extracted Breadcrumb Item component
const BreadcrumbItem: React.FC<{
  href: string;
  label: string;
  isLast: boolean;
}> = ({ href, label, isLast }) => {
  // If it's the last item, render as text
  if (isLast) {
    return (
      <span className="text-neutral-600 font-bold">
        {label === "Home" ? <Home size={16} /> : label}
      </span>
    );
  }

  // For previous items, render as link
  return (
    <>
      <Link
        href={href}
        className="text-neutral-800 hover:underline font-bold flex items-center"
      >
        {label === "Home" ? <Home size={16} /> : label}
      </Link>
      <span className="text-neutral-500">/</span>
    </>
  );
};
