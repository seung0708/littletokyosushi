'use client';

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
            let href = `/${pathnames.slice(0, index + 1).join('/')}`
            let itemLink = link[0].toUpperCase() + link.slice(1, link.length);
            console.log(href)
            return (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={href}>{itemLink}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathnames.length !== index + 1 && <BreadcrumbSeparator />}
              </>
            )
          })}
      </BreadcrumbList>
    </Breadcrumb>
    );
}