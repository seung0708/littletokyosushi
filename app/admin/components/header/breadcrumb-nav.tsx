'use client';
import React from 'react';
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

import { usePathname } from "next/navigation";

export default function BreadCrumbNav() {
    const paths = usePathname(); 
    const pathnames = paths.split('/').filter(path => path);

    return (
      <Breadcrumb className="hidden md:flex" aria-label="breadcrumb">
       <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames.length > 0 && <BreadcrumbSeparator />}
          {pathnames.map((link, index) => {
            const href = `/${pathnames.slice(0, index + 1).join('/')}`;
            const itemLink = link.charAt(0).toUpperCase() + link.slice(1); // Capitalize the first letter

            return (
              <React.Fragment key={href}> {/* Use React.Fragment with a key */}
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={href}>{itemLink}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathnames.length !== index + 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
    );
}