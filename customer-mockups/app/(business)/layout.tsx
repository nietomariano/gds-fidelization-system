import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"

export default function BusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 pl-64">{children}</div>
    </div>
  )
}
