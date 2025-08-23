"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Mail,
  GraduationCap,
  Building2,
  Calendar,
  Crown,
  UserPlus,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import type { StudentGroupDetails } from "@/types/types";
import { getStudentProjectDetails } from "@/lib/api/project";

interface GroupMembersPageProps {
  studentId?: number;
}

export default function GroupMembersPage({
  studentId = 1,
}: GroupMembersPageProps) {
  const [groupData, setGroupData] = useState<StudentGroupDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockGroupData: StudentGroupDetails = {
    id: 1,
    name: "Team Alpha",
    projectTitle: "AI-Powered Student Performance Analytics System",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-01"),
    maxMembers: 4,
    minMembers: 2,
    members: [
      {
        id: 1,
        user: {
          id: 101,
          name: "Ahmed Hassan",
          email: "ahmed.hassan@university.edu",
        },
        batch: {
          id: 1,
          name: "Fall 2024",
          batchCode: "CS-F24",
        },
        department: {
          id: 1,
          name: "Computer Science",
        },
        joinedAt: new Date("2024-01-15"),
        role: "LEADER",
      },
      {
        id: 2,
        user: {
          id: 102,
          name: "Sarah Khan",
          email: "sarah.khan@university.edu",
        },
        batch: {
          id: 1,
          name: "Fall 2024",
          batchCode: "CS-F24",
        },
        department: {
          id: 1,
          name: "Computer Science",
        },
        joinedAt: new Date("2024-01-16"),
        role: "MEMBER",
      },
      {
        id: 3,
        user: {
          id: 103,
          name: "Muhammad Ali",
          email: "muhammad.ali@university.edu",
        },
        batch: {
          id: 2,
          name: "Spring 2024",
          batchCode: "SE-S24",
        },
        department: {
          id: 2,
          name: "Software Engineering",
        },
        joinedAt: new Date("2024-01-18"),
        role: "MEMBER",
      },
    ],
  };

  const fetchGroupData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await getStudentProjectDetails();

      console.log("*** Studnet project details: ", result);

      // Here you would make the actual API call
      // const response = await fetch(`/api/students/${studentId}/group`)
      // const data = await response.json()

      setGroupData(result);
    } catch (error) {
      setError("Failed to load group information");
      toast({
        title: "Error",
        description: "Unable to load group members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [studentId]);

  const handleLeaveGroup = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Left Group",
        description: "You have successfully left the group.",
      });

      // Refresh data or redirect
      fetchGroupData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave group. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role?: string) => {
    return role === "LEADER" ? (
      <Crown className="h-4 w-4 text-yellow-600" />
    ) : null;
  };

  const getRoleBadge = (role?: string) => {
    if (role === "LEADER") {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Leader
        </Badge>
      );
    }
    return <Badge variant="outline">Member</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Group Members
            </CardTitle>
            <CardDescription>
              View your FYP group members and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !groupData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Group Members
            </CardTitle>
            <CardDescription>
              View your FYP group members and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Group Found</h3>
              <p className="text-muted-foreground mb-4">
                You are not currently part of any FYP group.
              </p>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Join a Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const members = groupData.groupMembers;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Group Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {groupData.group.name}
              </CardTitle>
              <CardDescription>
                {groupData.project.title && (
                  <span className="flex items-center gap-1 mt-1">
                    <FileText className="h-4 w-4" />
                    {groupData.project.title}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {members.length}/{groupData.maxMembers} Members
              </Badge>
              {/* <Button variant="outline" size="sm" onClick={handleLeaveGroup}>
                Leave Group
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {format(groupData.group.createdAt, "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Group Size</p>
                <p className="text-sm text-muted-foreground">
                  {groupData.groupMembers.length}-
                  {groupData.group.batch.FYPGroupRules.maxMembers} members
                </p>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Leader</p>
                <p className="text-sm text-muted-foreground">
                  {members.find((m) => m.role === "LEADER")?.user.name ||
                    "Not assigned"}
                </p>
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Members Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group Members ({members.length})
          </CardTitle>
          <CardDescription>
            List of all members in your FYP group
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No group members yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Invite students to join your group.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(student.role)}
                          <span className="font-medium">
                            {student.user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{student.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {groupData.group.batch.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {groupData.group.batch.batchCode}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {groupData.group.batch.department.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(student.role)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {student.joinedAt
                            ? format(student.joinedAt, "MMM dd, yyyy")
                            : "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 
      @Todo: Add progress statistics
      Group Progress Statistics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(members.map((m) => m.department.name)).size}
                </p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(members.map((m) => m.batch.name)).size}
                </p>
                <p className="text-sm text-muted-foreground">Batches</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
