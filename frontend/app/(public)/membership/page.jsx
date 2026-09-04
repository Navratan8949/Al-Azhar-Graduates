"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/userSlice";
import api from "@/service/api";
import {
  CheckCircle2,
  ShieldAlert,
  UploadCloud,
  Loader2,
  ArrowRight,
  User as UserIcon,
  BookOpen,
  MapPin,
  FileText,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MembershipPage() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    arabicName: "",
    fathersName: "",
    whatsappNumber: "",
    bloodGroup: "",
    faculty: "",
    degree: "",
    specialization: "",
    graduationYear: "",
    occupation: "",
    currentInstitution: "",
    city: "",
    district: "",
    state: "",
    dob: "",
    address: "",
    postalCode: "",
    profileImage: null,
    idProof: null,
    alAzharCertificate: null,
    declaration: false,
  });

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.declaration) {
      setError("Please check the declaration box to proceed.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = new FormData();
      data.append("arabicName", formData.arabicName);
      data.append("fathersName", formData.fathersName);
      data.append("whatsappNumber", formData.whatsappNumber);
      if (formData.bloodGroup) data.append("bloodGroup", formData.bloodGroup);
      data.append("faculty", formData.faculty);
      data.append("degree", formData.degree);
      data.append("specialization", formData.specialization);
      data.append("graduationYear", formData.graduationYear);
      data.append("occupation", formData.occupation);
      data.append("currentInstitution", formData.currentInstitution);
      data.append("city", formData.city);
      data.append("district", formData.district);
      data.append("state", formData.state);
      data.append("postalCode", formData.postalCode);
      if (formData.dob) data.append("dob", formData.dob);
      if (formData.address) data.append("address", formData.address);

      if (formData.profileImage)
        data.append("profileImage", formData.profileImage);
      if (formData.idProof) data.append("idProof", formData.idProof);
      if (formData.alAzharCertificate)
        data.append("alAzharCertificate", formData.alAzharCertificate);

      await api.post("/members/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/member");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-navy/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy mb-4">
            Official Membership
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl">
            Become a Member
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Join the World Association for Al-Azhar Graduates – India Branch and
            become part of a growing national network of scholars, educators,
            and professionals.
          </p>
        </div>

        {!user ? (
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-10 sm:p-14 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-border/50">
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-lime/10 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-navy/5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <div className="mx-auto flex size-24 items-center justify-center rounded-[2rem] bg-slate-50 border border-border/50 shadow-sm mb-8">
                <div className="flex size-16 items-center justify-center rounded-[1.5rem] bg-navy text-lime shadow-inner">
                  <Lock className="size-7" />
                </div>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-4">
                Unlock Membership
              </h2>
              <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed mb-10">
                To maintain the integrity of our organization, official
                membership applications require a verified account. Please log
                in or create a free web account to proceed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-2xl bg-navy text-white hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(2,61,40,0.5)] hover:bg-navy/90 h-14 px-10 text-base font-bold transition-all duration-300"
                >
                  <a href="/login">Log In to Account</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto rounded-2xl border-2 border-border/60 bg-white h-14 px-10 text-base font-bold hover:bg-slate-50 hover:border-border hover:-translate-y-1 transition-all duration-300"
                >
                  <a href="/signup">Create Free Account</a>
                </Button>
              </div>
            </div>
          </div>
        ) : success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-12 text-center shadow-lg">
            <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-6">
              <CheckCircle2 className="size-10 text-emerald-600" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-emerald-900">
              Application Submitted!
            </h2>
            <p className="mt-4 text-lg text-emerald-700 max-w-lg mx-auto">
              Your official membership application has been received and is
              under review. You will be redirected to your dashboard shortly.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-border/60 bg-white p-6 sm:p-10 shadow-xl">
            <div className="mb-8 border-b border-border/50 pb-6">
              <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-3">
                <FileText className="size-6 text-accent" />
                Membership Application
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please fill out all the details accurately as per your Al-Azhar
                records.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Section 1: Personal Information */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <UserIcon className="size-5 text-accent" />
                  <h3 className="font-serif text-xl font-bold text-navy">
                    Personal Information
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2 bg-slate-50 p-6 rounded-2xl border border-border/50">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Full Name *
                    </label>
                    <input
                      disabled
                      value={user.fullName || ""}
                      className="mt-1.5 w-full rounded-xl border border-border bg-slate-200 px-4 py-3 text-sm outline-none text-muted-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      To change this, update your profile first.
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Date of Birth *
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, dob: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Arabic Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.arabicName}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          arabicName: e.target.value,
                        }))
                      }
                      placeholder="Enter Name in Arabic (if applicable)"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Father's Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.fathersName}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          fathersName: e.target.value,
                        }))
                      }
                      placeholder="Father's Full Name"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      WhatsApp Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          whatsappNumber: e.target.value,
                        }))
                      }
                      placeholder="+91 00000 00000"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Blood Group (Optional)
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          bloodGroup: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 2: Academic Information */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="size-5 text-accent" />
                  <h3 className="font-serif text-xl font-bold text-navy">
                    Academic Information
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2 bg-slate-50 p-6 rounded-2xl border border-border/50">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Al-Azhar Faculty *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.faculty}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, faculty: e.target.value }))
                      }
                      placeholder="e.g. Faculty of Theology (Usul al-Din)"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Degree *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.degree}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, degree: e.target.value }))
                      }
                      placeholder="e.g. Bachelor's, Master's, PhD"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Specialization *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          specialization: e.target.value,
                        }))
                      }
                      placeholder="e.g. Hadith, Tafsir, Islamic Law"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Year of Graduation *
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          graduationYear: e.target.value,
                        }))
                      }
                      placeholder="e.g. 2015"
                      min="1900"
                      max="2099"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Present Occupation *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.occupation}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          occupation: e.target.value,
                        }))
                      }
                      placeholder="e.g. Teacher, Imam, Researcher"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Current Institution *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.currentInstitution}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          currentInstitution: e.target.value,
                        }))
                      }
                      placeholder="Where do you currently work/study?"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Address */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="size-5 text-accent" />
                  <h3 className="font-serif text-xl font-bold text-navy">
                    Address
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2 bg-slate-50 p-6 rounded-2xl border border-border/50">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Full Address *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, address: e.target.value }))
                      }
                      placeholder="Street Address, Area"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, city: e.target.value }))
                      }
                      placeholder="City Name"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      District *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, district: e.target.value }))
                      }
                      placeholder="District Name"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      State *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, state: e.target.value }))
                      }
                      placeholder="State Name"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Postal Code *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          postalCode: e.target.value,
                        }))
                      }
                      placeholder="Pincode/Zip"
                      className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>
              </section>

              {/* Section 4: Documents */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <UploadCloud className="size-5 text-accent" />
                  <h3 className="font-serif text-xl font-bold text-navy">
                    Documents
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="relative rounded-2xl border-2 border-dashed border-border/60 bg-slate-50 hover:bg-slate-100 transition-colors p-6 text-center cursor-pointer">
                    <input
                      required
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "profileImage")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="mx-auto size-8 text-navy/60 mb-3" />
                    <p className="text-sm font-semibold text-navy">
                      Profile Photo *
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {formData.profileImage
                        ? formData.profileImage.name
                        : "For your ID card"}
                    </p>
                  </div>

                  <div className="relative rounded-2xl border-2 border-dashed border-border/60 bg-slate-50 hover:bg-slate-100 transition-colors p-6 text-center cursor-pointer">
                    <input
                      required
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "idProof")}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="mx-auto size-8 text-navy/60 mb-3" />
                    <p className="text-sm font-semibold text-navy">
                      ID Proof *
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {formData.idProof
                        ? formData.idProof.name
                        : "Govt. issued ID"}
                    </p>
                  </div>

                  <div className="relative rounded-2xl border-2 border-dashed border-border/60 bg-slate-50 hover:bg-slate-100 transition-colors p-6 text-center cursor-pointer">
                    <input
                      required
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        handleFileChange(e, "alAzharCertificate")
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="mx-auto size-8 text-navy/60 mb-3" />
                    <p className="text-sm font-semibold text-navy">
                      Al-Azhar Degree *
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {formData.alAzharCertificate
                        ? formData.alAzharCertificate.name
                        : "Certificate or Degree"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Declaration & Submit */}
              <div className="pt-6 border-t border-border/50">
                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    required
                    checked={formData.declaration}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        declaration: e.target.checked,
                      }))
                    }
                    className="mt-1 size-5 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    I confirm that the information provided in this application
                    is accurate and agree to abide by the objectives,
                    principles, and regulations of the World Association for
                    Al-Azhar Graduates – India Branch.
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 shadow-md"
                >
                  {loading ? (
                    <Loader2 className="mr-2 size-5 animate-spin" />
                  ) : (
                    "Submit Membership Application"
                  )}
                  {!loading && <ArrowRight className="ml-2 size-5" />}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
