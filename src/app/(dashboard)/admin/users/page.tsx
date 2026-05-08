"use client";

import { useState } from "react";
import { useAdminDashboard } from "@/hooks/useDashboard";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  UserMinus,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const users = data?.data?.recentUsers || []; // Using recentUsers as mock for now
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleUpdate = (userId: string, newRole: string) => {
    toast.success(`User role updated to ${newRole}`);
  };

  const handleDeactivate = (userId: string) => {
    toast.error("User account deactivated");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage system users, roles, and account statuses.</p>
        </div>
        <Button className="gap-2 h-11">
          <UserPlus className="h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-4">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Search by name or email..." 
                   className="pl-10" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val ?? "ALL")}>
                    <SelectTrigger className="w-[150px]">
                       <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="ALL">All Roles</SelectItem>
                       <SelectItem value="STUDENT">Students</SelectItem>
                       <SelectItem value="INSTRUCTOR">Instructors</SelectItem>
                       <SelectItem value="MANAGER">Managers</SelectItem>
                       <SelectItem value="ADMIN">Admins</SelectItem>
                    </SelectContent>
                 </Select>
                 <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User Information</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {user.name.charAt(0)}
                         </div>
                         <div className="flex flex-col">
                            <span className="font-bold text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted text-foreground border-none font-medium">
                         {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                       {new Date().toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                             <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" /> View Profile
                             </DropdownMenuItem>
                             <DropdownMenuItem className="gap-2" onClick={() => handleRoleUpdate(user.id, "INSTRUCTOR")}>
                                <Shield className="h-4 w-4" /> Change to Instructor
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeactivate(user.id)}>
                                <UserMinus className="h-4 w-4" /> Deactivate Account
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredUsers.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                       No users found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
