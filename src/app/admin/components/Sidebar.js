"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "../../../lib/utils";

export function SidebarDemo({ children }) {
  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Warehouse",
      href: "/admin/warehouse",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Stock Locations",
      href: "/admin/stock-location",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Stock Management",
      href: "/admin/stock-management",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(true);

  return (
    <div className={cn("flex w-full h-screen bg-gray-100 dark:bg-neutral-800")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col justify-between gap-6 p-4 bg-gray-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700">
          {/* Categories Section */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${!open ? 'hidden' : 'block'} text-gray-800 dark:text-gray-300`}>
              Categories
            </h3>
            <ul className="space-y-2">
              {["Accessories", "Air Zoom Pegasus", "Animal biscuits", "Arm sofa", "Baby food"].map((category, index) => (
                <li key={index}>
                  <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <input type="checkbox" className="form-checkbox text-primary focus:ring-0" />
                    {open ? (
                      <span className="truncate">{category}</span>
                    ) : (
                      <span className="sr-only">{category}</span>
                    )}
                    <span className={`${!open ? 'hidden' : 'ml-auto text-gray-400'}`}>({12})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability Filter */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${!open ? 'hidden' : 'block'} text-gray-800 dark:text-gray-300`}>
              Availability
            </h3>
            <ul className="space-y-2">
              <li>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" className="form-checkbox text-primary focus:ring-0" />
                  {open ? <span>In stock</span> : <span className="sr-only">In stock</span>}
                  <span className={`${!open ? 'hidden' : 'ml-auto text-gray-400'}`}>({233})</span>
                </label>
              </li>
              <li>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" className="form-checkbox text-primary focus:ring-0" />
                  {open ? <span>Out of stock</span> : <span className="sr-only">Out of stock</span>}
                  <span className={`${!open ? 'hidden' : 'ml-auto text-gray-400'}`}>({1})</span>
                </label>
              </li>
            </ul>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${!open ? 'hidden' : 'block'} text-gray-800 dark:text-gray-300`}>
              Price
            </h3>
            {open && (
              <>
                <div className="flex items-center space-x-2">
                  <input type="text" placeholder="$0" className="w-1/2 p-1 text-sm bg-white border rounded dark:bg-neutral-800 dark:border-neutral-600" />
                  <span className="text-gray-500">to</span>
                  <input type="text" placeholder="$74" className="w-1/2 p-1 text-sm bg-white border rounded dark:bg-neutral-800 dark:border-neutral-600" />
                </div>
                <input type="range" min="0" max="74" className="w-full mt-2" />
              </>
            )}
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-4 mt-10">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>

          {/* Profile */}
          <SidebarLink
            link={{
              label: open ? "Manu Arora" : "",
              href: "#",
              icon: (
                <Image
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
