"use client";

import { useState } from "react";
import {
  Settings, Save, Plus, Search, Loader2, Pencil, X, CheckCircle2, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useSystemSettings, useUpdateSystemSetting, SystemSetting } from "@/hooks/useAdminData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { cn } from "@/lib/utils";

const DEFAULT_SETTINGS = [
  { key: "platform_name", value: "EduBridge AI", description: "The public name of the platform" },
  { key: "maintenance_mode", value: "false", description: "Enable to put platform in maintenance mode" },
  { key: "max_courses_per_instructor", value: "50", description: "Maximum courses an instructor can create" },
  { key: "free_enrollment_enabled", value: "true", description: "Allow free course enrollments" },
  { key: "ai_requests_daily_limit", value: "100", description: "Max AI requests per user per day" },
  { key: "support_email", value: "support@edubridge.ai", description: "Public support email address" },
];

export default function AdminSettingsPage() {
  const { data, isLoading, isError, refetch } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();

  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<SystemSetting | null>(null);
  const [editValue, setEditValue] = useState("");
  const [addKey, setAddKey] = useState("");
  const [addValue, setAddValue] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const settings: SystemSetting[] = data?.data || [];

  // Merge DB settings with default templates (DB takes priority)
  const displaySettings = DEFAULT_SETTINGS.map((def) => {
    const existing = settings.find((s) => s.key === def.key);
    return existing
      ? { ...existing, description: def.description }
      : { id: "", key: def.key, value: def.value, description: def.description, createdAt: "", updatedAt: "" };
  });

  // Add any extra settings from DB not in defaults
  const extraSettings = settings.filter((s) => !DEFAULT_SETTINGS.find((d) => d.key === s.key));
  const allSettings = [...displaySettings, ...extraSettings.map((s) => ({ ...s, description: "Custom setting" }))];

  const filtered = allSettings.filter(
    (s) =>
      s.key.toLowerCase().includes(search.toLowerCase()) ||
      (s as any).description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (setting: any) => {
    setEditTarget(setting);
    setEditValue(setting.value);
  };

  const handleSave = () => {
    if (!editTarget) return;
    updateSetting.mutate({ key: editTarget.key, value: editValue }, {
      onSuccess: () => {
        setEditTarget(null);
        setEditValue("");
        refetch();
      },
    });
  };

  const handleAdd = () => {
    if (!addKey.trim() || !addValue.trim()) return;
    updateSetting.mutate({ key: addKey.trim(), value: addValue.trim() }, {
      onSuccess: () => {
        setShowAdd(false);
        setAddKey("");
        setAddValue("");
        refetch();
      },
    });
  };

  const getBoolBadge = (value: string) => {
    if (value === "true") return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 border text-[10px] font-bold">Enabled</Badge>;
    if (value === "false") return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 border text-[10px] font-bold">Disabled</Badge>;
    return null;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            System Settings <Settings className="h-8 w-8 text-primary" />
          </h1>
          <p className="text-muted-foreground font-medium text-lg mt-1">
            Configure global platform behaviour and parameters.
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="h-10 font-bold gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add Setting
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search settings..."
          className="pl-10 h-11 rounded-[0.75rem]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="saas-card p-0 overflow-hidden divide-y">
        {filtered.map((setting) => (
          <div key={setting.key} className="flex items-start justify-between p-5 hover:bg-muted/10 transition-colors gap-6 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <code className="text-sm font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {setting.key}
                </code>
                {getBoolBadge(setting.value)}
              </div>
              <p className="text-xs text-muted-foreground font-medium">{(setting as any).description || "Platform setting"}</p>
              <p className="text-sm font-semibold mt-1 truncate">{setting.value}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-[0.5rem] font-bold gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleEdit(setting)}
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <Settings className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p className="font-bold">No settings match your search.</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(v) => !v && setEditTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black">Edit Setting</DialogTitle>
            <DialogDescription>
              Update the value for <code className="font-mono text-primary">{editTarget?.key}</code>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="font-bold">Key</Label>
              <Input value={editTarget?.key || ""} disabled className="font-mono opacity-60" />
            </div>
            <div className="space-y-1">
              <Label className="font-bold">Value</Label>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-11"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateSetting.isPending} className="font-bold gap-2">
              {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Setting Dialog */}
      <Dialog open={showAdd} onOpenChange={(v) => !v && setShowAdd(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add New Setting
            </DialogTitle>
            <DialogDescription>Create a new custom system setting key-value pair.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="font-bold">Key</Label>
              <Input
                placeholder="e.g. custom_feature_flag"
                value={addKey}
                onChange={(e) => setAddKey(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                className="h-11 font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold">Value</Label>
              <Input
                placeholder="e.g. true"
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={updateSetting.isPending || !addKey || !addValue} className="font-bold gap-2">
              {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add Setting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
