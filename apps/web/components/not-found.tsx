"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  Users,
  Settings,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";

export default function NotFound() {
  // const quickLinks = [
  //   {
  //     title: "Dashboard",
  //     description: "Go to your main dashboard",
  //     href: "/dashboard",
  //     icon: Home,
  //   },
  //   {
  //     title: "Organizations",
  //     description: "Manage your organizations",
  //     href: "/organizations",
  //     icon: Users,
  //   },
  //   {
  //     title: "Join Codes",
  //     description: "Create and manage join codes",
  //     href: "/join-codes",
  //     icon: BookOpen,
  //   },
  //   {
  //     title: "Settings",
  //     description: "Configure your account",
  //     href: "/settings",
  //     icon: Settings,
  //   },
  // ];

  const commonIssues = [
    "The page URL might have been mistyped",
    "The page may have been moved or deleted",
    "You might not have permission to access this page",
    "The link you followed might be outdated",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-primary" />
              </div>
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold"
              >
                404
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-4">
          {/* Quick Actions */}
          {/* <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Quick Navigation</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Here are some helpful links to get you back on track:
              </p>

              <div className="space-y-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{link.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Card> */}

          {/* Help Section */}
          <Card className="p-6 col-start-2 col-end-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">What Happened?</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                This error usually occurs when:
              </p>

              <ul className="space-y-2">
                {commonIssues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{issue}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  If you continue to experience issues, please contact our
                  support team.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-semibold">StudySync</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Academic Management Platform
          </p>
        </div>
      </div>
    </div>
  );
}
