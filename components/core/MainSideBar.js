"use client";

import { useState } from "react";
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
  // Remove token from client storage
  localStorage.removeItem("token"); // or sessionStorage
  // Redirect to login page
  window.location.href = "/";
};

export function MainSideBar({ companyinitials }) {
  const [isCollaborationOpen, setisCollaborationOpen] = useState(true);
  const [isMasterDataOpen, setisMasterDataOpen] = useState(false);
  const [isSettingsOpen, setisSettingsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-64 bg-indigo-500 border-r p-4 font-sans text-xs text-white flex flex-col justify-between ">
      {/* Sidebar Header */}
      <div>
        <div className="mb-6">
          <Link href="/home">
            <h2 className="text-lg font-semibold">
              {companyinitials ? companyinitials : "Home"}
            </h2>
          </Link>
        </div>

        <div>
          {/* Products Collapsible Group */}
          <Collapsible
            open={isCollaborationOpen}
            onOpenChange={setisCollaborationOpen}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center"
              >
                <span>Collaboration Tools</span>
                {isCollaborationOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="pl-4 space-y-0">
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                onClick={() => router.push({ pathname: "/tools/surveys" })}
              >
                Surveys
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                onClick={() => router.push({ pathname: "/tools/news" })}
              >
                News
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                onClick={() => router.push({ pathname: "/tools/tickets" })}
              >
                Tickets
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Calendars
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Checklists
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                onClick={() => router.push({ pathname: "/tools/dtr" })}
              >
                Daily Time Records
              </Button>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="my-4" />

          {/* Orders Collapsible Group */}
          <Collapsible
            open={isMasterDataOpen}
            onOpenChange={setisMasterDataOpen}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center"
              >
                <span>Master Data</span>
                {isMasterDataOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="pl-4 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Customers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Locations
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Products
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Agencies
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Suppliers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Competitors
              </Button>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="my-4" />

          {/* Analytics Collapsible Group */}
          <Collapsible
            open={isSettingsOpen}
            onOpenChange={setisSettingsOpen}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center"
              >
                <span>Administration</span>
                {isSettingsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="pl-4 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                onClick={() =>
                  router.push({ pathname: "/administration/users" })
                }
              >
                Users
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
              >
                Teams
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                onClick={() =>
                  router.push({ pathname: "/administration/roles" })
                }
              >
                Roles
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                onClick={() =>
                  router.push({ pathname: "/administration/datatransfers" })
                }
              >
                Data Transfers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                onClick={() =>
                  router.push({ pathname: "/administration/massuploads" })
                }
              >
                Mass Uploads
              </Button>
            </CollapsibleContent>
          </Collapsible>
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
