"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/userSlice";
import api from "@/service/api";
import {
  CheckCircle2,
  Loader2,
  UserCircle2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Droplet,
  Calendar,
  FileText,
  Camera,
  ShieldCheck,
  FileBadge,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { setUser } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";

export default function Page() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/members/me");
        setMember(res.data?.member);
      } catch (err) {
        // Normal if 404
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        mobile: user.mobile || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        address: user.address || "",
        district: user.district || "",
        state: user.state || "",
        bloodGroup: member?.bloodGroup || "",
        occupation: member?.occupation || "",
      });
    }
  }, [user, member, editOpen]);

  if (loading || !user)
    return (
      <div className="py-12 text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-lime" />
      </div>
    );

  const initials =
    user.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";
  const isApproved = member?.membershipStatus === "approved";

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => form.append(k, v));
      if (profileImage) form.append("profileImage", profileImage);

      const res = await api.put("/members/me", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedMember = res.data.member;
      setMember(updatedMember);
      dispatch(setUser(updatedMember.user));

      toast.success("Profile updated successfully");
      setEditOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy">
            My Profile
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Manage your personal information and NGO membership details.
          </p>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger
            render={
              <Button className="rounded-xl bg-navy px-6 text-white font-bold hover:bg-navy/90 shadow-md" />
            }
          >
            Edit Profile
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-navy">
                Edit Profile Details
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-navy font-bold">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400 overflow-hidden border-2 border-dashed border-slate-300">
                    {profileImage ? (
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : member?.profileImage?.url ? (
                      <img
                        src={member.profileImage.url}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="size-6" />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    className="flex-1 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-navy font-bold">Full Name</Label>
                  <Input
                    className="rounded-xl h-11"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-navy font-bold">Mobile</Label>
                  <Input
                    className="rounded-xl h-11"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-navy font-bold">Date of Birth</Label>
                  <Input
                    className="rounded-xl h-11"
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                </div>
                {member && (
                  <div className="space-y-2">
                    <Label className="text-navy font-bold">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(v) =>
                        setFormData({ ...formData, bloodGroup: v })
                      }
                    >
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-navy font-bold">Address</Label>
                <Input
                  className="rounded-xl h-11"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-navy font-bold">District</Label>
                  <Input
                    className="rounded-xl h-11"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-navy font-bold">State</Label>
                  <Input
                    className="rounded-xl h-11"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
              </div>
              {member && (
                <div className="space-y-2">
                  <Label className="text-navy font-bold">Occupation</Label>
                  <Input
                    className="rounded-xl h-11"
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="pt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl font-bold"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-navy px-8 text-white font-bold hover:bg-navy/90"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Profile Card */}
      <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Cover Banner */}
        <div className="h-40 bg-gradient-to-r from-navy via-navy to-emerald-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4)_0,transparent_100%)]"></div>
          {/* Subtle logo or text watermark in bg */}
          <div className="absolute right-8 bottom-4 text-white/10 font-serif text-5xl font-black uppercase tracking-tighter mix-blend-overlay">
            MEMBER
          </div>
        </div>

        <div className="px-8 pb-8 relative">
          {/* Profile Picture & Tags */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-6">
            <div className="relative rounded-3xl bg-white p-2 shadow-lg w-fit">
              <div className="flex size-32 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-4xl font-bold text-navy shrink-0">
                {member?.profileImage?.url ? (
                  <img
                    src={member.profileImage.url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              {isApproved && (
                <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-4 ring-white">
                  <ShieldCheck className="size-4" />
                </div>
              )}
            </div>

            <div className="flex-1 pb-2">
              <h2 className="font-serif text-3xl font-bold text-navy">
                {user.fullName}
              </h2>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {user.email}
              </p>
            </div>

            {member && (
              <div className="flex flex-wrap gap-2 pb-2">
                <div className="rounded-xl bg-slate-100 px-4 py-2 border border-slate-200 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Member ID
                  </p>
                  <p className="font-mono text-sm font-bold text-navy">
                    {member.memberId}
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-xl px-4 py-2 border text-center",
                    isApproved
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-amber-50 border-amber-200",
                  )}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Status
                  </p>
                  <p
                    className={cn(
                      "text-sm font-bold capitalize flex items-center gap-1.5",
                      isApproved ? "text-emerald-700" : "text-amber-700",
                    )}
                  >
                    {isApproved && <CheckCircle2 className="size-3.5" />}{" "}
                    {member.membershipStatus}
                  </p>
                </div>
              </div>
            )}
          </div>

          {member?.membershipStatus === "rejected" && (
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-800 mb-1 flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Application
                  Rejected
                </p>
                <p className="text-sm text-rose-700 font-medium">
                  Reason: {member.rejectionReason}
                </p>
              </div>
              <Button
                asChild
                className="rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold shadow-sm shrink-0"
              >
                <Link href="/membership">Apply Again</Link>
              </Button>
            </div>
          )}

          {!member && (
            <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-800 mb-1 flex items-center gap-2">
                  Public Web Account
                </p>
                <p className="text-sm text-amber-700 font-medium">
                  You have not applied for official NGO membership yet. Unlock
                  benefits by applying today.
                </p>
              </div>
              <Button
                asChild
                className="rounded-xl bg-amber-500 text-white hover:bg-amber-600 font-bold shadow-sm shrink-0"
              >
                <Link href="/membership">Apply Now</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Basic Details */}
        <div className="rounded-[2rem] border border-border/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="border-b border-border/50 bg-slate-50/50 px-8 py-6">
            <h2 className="font-serif text-xl font-bold text-navy flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <UserCircle2 className="size-5" />
              </div>
              Personal Details
            </h2>
          </div>
          <div className="p-8 space-y-6 flex-1">
            <div className="flex gap-4 items-start">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 shrink-0">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Email Address
                </p>
                <p className="font-medium text-navy">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 shrink-0">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Mobile Number
                </p>
                <p className="font-medium text-navy">
                  {user.mobile || "Not Provided"}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 shrink-0">
                <Calendar className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Date of Birth
                </p>
                <p className="font-medium text-navy">
                  {user.dob
                    ? new Date(user.dob).toLocaleDateString()
                    : "Not Provided"}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 shrink-0">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Residential Address
                </p>
                <p className="font-medium text-navy">
                  {user.address ? `${user.address}, ` : "Not Provided"}
                  {user.district ? `${user.district}, ` : ""}
                  {user.state}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NGO Profile Details */}
        <div className="rounded-[2rem] border border-border/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="border-b border-border/50 bg-slate-50/50 px-8 py-6">
            <h2 className="font-serif text-xl font-bold text-navy flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <FileText className="size-5" />
              </div>
              Membership Details
            </h2>
          </div>
          <div className="p-8 flex-1 flex flex-col">
            {member ? (
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shrink-0">
                    <Droplet className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Blood Group
                    </p>
                    <p className="font-medium text-navy">
                      {member.bloodGroup || "Not Provided"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
                    <Briefcase className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Occupation
                    </p>
                    <p className="font-medium text-navy">
                      {member.occupation || "Not Provided"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Joining Date
                    </p>
                    <p className="font-medium text-navy">
                      {new Date(member.joiningDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <FileBadge className="size-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-navy">
                  No Details Available
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  Apply for membership to unlock and manage your NGO profile
                  details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
