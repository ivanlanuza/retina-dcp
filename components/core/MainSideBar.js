"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

const sectionMapping = {
  tools: "collaboration",
  masterdata: "masterdata",
  administration: "settings",
};

export function MainSideBar({ companyinitials }) {
  const router = useRouter();
  const { pathname } = router;
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const matchedSection = Object.keys(sectionMapping).find((key) =>
      pathname.startsWith(`/${key}`)
    );
    setOpenSection(matchedSection ? sectionMapping[matchedSection] : null);
  }, [pathname]);

  const handleToggle = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="w-64 bg-indigo-500 border-r p-4 font-sans text-xs text-white flex flex-col justify-between ">
      <div>
        <div className="mb-6">
          <Link href="/home">
            <h2 className="text-lg font-semibold">
              {companyinitials ? companyinitials : "Home"}
            </h2>
          </Link>
        </div>

        <div>
          {[{
            key: "collaboration", label: "Collaboration Tools", links: [
              { href: "/tools/surveys", text: "Surveys" },
              { href: "/tools/dtr", text: "Daily Time Records" },
              { href: "", text: "News" },
              { href: "", text: "Calendars" },
              { href: "", text: "Checklists" },
              { href: "", text: "Requests" },
            ]},
            { key: "masterdata", label: "Master Data", links: [
              { href: "/masterdata/clientaccounts", text: "Client Accounts" },
              { href: "/masterdata/locations", text: "Locations" },
              { href: "", text: "Agencies" },
              { href: "/masterdata/suppliers", text: "Suppliers" },
              { href: "/masterdata/competitors", text: "Competitors" },
              { href: "/masterdata/brands", text: "Brands" },
              { href: "/masterdata/categories", text: "Categories" },
              { href: "/masterdata/products", text: "Products" },
            ]},
            { key: "settings", label: "Administration", links: [
              { href: "/administration/users", text: "Users" },
              { href: "", text: "Teams" },
              { href: "", text: "Roles" },
              { href: "", text: "Data Transfers" },
              { href: "", text: "Mass Uploads" },
            ]},
          ].map(({ key, label, links }) => (
            <div key={key}>
              <Collapsible open={openSection === key} onOpenChange={() => handleToggle(key)} className="space-y-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full flex justify-between items-center">
                    <span>{label}</span>
                    {openSection === key ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1">
                {links.map(({ href, text }) => (
                  href ? (
                    <Link key={href} href={href}>
                      <Button variant="ghost" className="w-full justify-start font-light">
                        {text}
                      </Button>
                    </Link>
                  ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-light text-gray-400"
                  >
                    {text}
                    </Button>
                  )
                ))}
                </CollapsibleContent>
              </Collapsible>
              <Separator className="my-4" />
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full text-left px-4 py-2 hover:bg-red-400 rounded-md border "
        >
          <LogOut className="mr-2" size={20} /> Logout
        </button>
      </div>
    </div>
  );
}
