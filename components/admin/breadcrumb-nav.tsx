'use client';
import React from 'react';
import Link from "next/link";
import { cn } from "@/utils/utils";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

function BreadcrumbNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
      )}
    >
      {children}
    </Link>
  );
}

export default function BreadCrumbNav() {
    const paths = usePathname(); 
    const pathnames = paths.split('/').filter(path => path);
    
    return (
      <Breadcrumb className="hidden md:flex" aria-label="breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbNavLink href="/">
              Dashboard
            </BreadcrumbNavLink>
          </BreadcrumbItem>
          
          {pathnames.length > 0 && <BreadcrumbSeparator />}
          
          {pathnames.map((link, index) => {
            const href = `/${pathnames.slice(0, index + 1).join('/')}`;
            const itemLink = link.charAt(0).toUpperCase() + link.slice(1);
            const isLast = index === pathnames.length - 1;
            
            return (
              <React.Fragment key={href}>
                <BreadcrumbItem>
                  <BreadcrumbNavLink href={href}>
                    {itemLink}
                  </BreadcrumbNavLink>
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
}