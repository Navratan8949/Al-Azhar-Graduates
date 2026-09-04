"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSiteContent } from "@/redux/features/siteContentSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import api from "@/service/api"
import { Loader2, Plus, Trash2, Save, ImageIcon, MessageSquare, Layers, Info, Eye, Crosshair, Target, BarChart3, HelpCircle, Scale, Phone, CreditCard, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { IconPicker } from "@/components/ui/icon-picker"

// Reusable styled components for the page
const SectionLabel = ({ children }) => (
  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">{children}</label>
)
const FieldGroup = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <SectionLabel>{label}</SectionLabel>
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
    {children}
  </div>
)
const GreenCardHeader = ({ icon: Icon, title, description }) => (
  <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {description && <p className="text-xs text-white/70 mt-0.5">{description}</p>}
    </div>
  </div>
)
const SaveBtn = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
    {children}
  </button>
)
const ItemCard = ({ label, onDelete, children }) => (
  <div className="relative rounded-2xl border border-primary/10 bg-emerald-50/40 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-primary">{label}</span>
      <button onClick={onDelete} className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
    {children}
  </div>
)
const AddBtn = ({ onClick, children }) => (
  <button onClick={onClick} className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-primary/30 px-4 py-2.5 text-sm font-semibold text-primary hover:border-primary hover:bg-emerald-50 transition">
    <Plus className="h-4 w-4" />{children}
  </button>
)

export default function SiteContentAdminPage() {
  const dispatch = useDispatch()
  const { data: siteContent, isLoading } = useSelector((state) => state.siteContent)
  const [activeTab, setActiveTab] = useState("founder_message")
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)

  // -- STATES --
  const [siteLogo, setSiteLogo] = useState({ logo: "", favicon: "", signature: "", siteName: "", shortName: "" })
  const [founderForm, setFounderForm] = useState({ title: "", name: "", designation: "", message: "", file: null, existingImage: "" })
  const [heroSlides, setHeroSlides] = useState([])
  const [aboutPreview, setAboutPreview] = useState({ title: "", content: "", points: ["", "", "", ""] })
  const [aboutMain, setAboutMain] = useState({ image: "", stats: ["", "", ""], sections: [] })
  const [focusAreas, setFocusAreas] = useState([])
  const [impactStats, setImpactStats] = useState([])

  // New states for major pages
  const [faqs, setFaqs] = useState([])
  const [legalPages, setLegalPages] = useState({ privacy: "", terms: "" })
  const [visionMission, setVisionMission] = useState({ vision: "", mission: "", objectives: "" })

  const [contactInfo, setContactInfo] = useState({
    address: "",
    phones: [{ number: "", showInNavbar: true, showInFooter: true, showInContact: true }],
    email: "", facebook: "", instagram: "", twitter: "", youtube: ""
  })

  const [donateDetails, setDonateDetails] = useState({
    bankName: "", accountName: "", accountNumber: "", ifscCode: "", upiId: "", qrImage: ""
  })
  
  const [siteSeo, setSiteSeo] = useState({ title: "", description: "", keywords: "" })

  useEffect(() => {
    dispatch(fetchSiteContent())
  }, [dispatch])

  useEffect(() => {
    if (siteContent) {
      // 1. Founder Message
      if (siteContent.founder_message) {
        let name = "", designation = "", message = siteContent.founder_message.content || "";
        try {
          const parsed = JSON.parse(message);
          if (parsed && typeof parsed === 'object') {
            name = parsed.name || "";
            designation = parsed.designation || "";
            message = parsed.message || "";
          }
        } catch (e) {
          // If it's not JSON, it stays as plain text in message
        }

        setFounderForm({
          title: siteContent.founder_message.title || "",
          name,
          designation,
          message,
          file: null,
          existingImage: siteContent.founder_message.image?.url || "",
        })
      }

      // 1.5 Site Logo
      if (siteContent.site_logo?.content) {
        try { setSiteLogo(JSON.parse(siteContent.site_logo.content)) } catch (e) { }
      }

      // 1.6 Site SEO
      if (siteContent.site_seo?.content) {
        try { setSiteSeo(JSON.parse(siteContent.site_seo.content)) } catch (e) { }
      }

      // 2. Hero Slider
      if (siteContent.home_hero?.content) {
        try { setHeroSlides(JSON.parse(siteContent.home_hero.content)) } catch (e) { }
      }

      // 3. About Preview (Home)
      if (siteContent.about_preview?.content) {
        try {
          const parsed = JSON.parse(siteContent.about_preview.content)
          setAboutPreview({
            title: siteContent.about_preview.title || "",
            content: parsed.description || "",
            points: parsed.points || ["", "", "", ""]
          })
        } catch (e) { }
      }

      // 4. About Main
      if (siteContent.about_main?.content) {
        try { setAboutMain(JSON.parse(siteContent.about_main.content)) } catch (e) { }
      }

      // 5. Focus Areas
      if (siteContent.focus_areas?.content) {
        try { setFocusAreas(JSON.parse(siteContent.focus_areas.content)) } catch (e) { }
      }

      // 6. Impact Stats
      if (siteContent.impact_stats?.content) {
        try { setImpactStats(JSON.parse(siteContent.impact_stats.content)) } catch (e) { }
      }


      // 8. FAQs
      if (siteContent.faqs?.content) {
        try { setFaqs(JSON.parse(siteContent.faqs.content)) } catch (e) { }
      }

      // 9. Legal Pages
      setLegalPages({
        privacy: siteContent.privacy_policy?.content || "",
        terms: siteContent.terms_conditions?.content || ""
      })

      // 10. Vision / Mission
      if (siteContent.vision_mission?.content) {
        try { setVisionMission(JSON.parse(siteContent.vision_mission.content)) } catch (e) { }
      }

      if (siteContent.contact_info?.content) {
        try {
          const parsed = JSON.parse(siteContent.contact_info.content)
          if (parsed.phone && !parsed.phones) {
            parsed.phones = [{ number: parsed.phone, showInNavbar: true, showInFooter: true, showInContact: true }]
            delete parsed.phone
          }
          if (!parsed.phones) parsed.phones = []
          setContactInfo(parsed)
        } catch (e) { }
      }

      // 12. Donate Details
      if (siteContent.donate_details?.content) {
        try { setDonateDetails(JSON.parse(siteContent.donate_details.content)) } catch (e) { }
      }

    }
  }, [siteContent])

  // -- UPLOAD HELPER --
  const handleFileUpload = async (e, callback, loadingKey) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(loadingKey)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await api.post("/site-content/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
      callback(res.data.url)
      // toast.success("Image uploaded! Don't forget to click 'Save' below.")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image")
    }
    setUploadingImage(null)
  }

  // -- SAVE HELPERS --
  const saveContent = async (key, title, contentData) => {
    setIsSaving(true)
    try {
      const payload = typeof contentData === 'object' ? JSON.stringify(contentData) : contentData
      await api.post("/site-content", { key, title, content: payload })
      toast.success(`${title} updated successfully!`)
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  const handleSaveFounder = async () => {
    setIsSaving(true)
    try {
      const contentJson = JSON.stringify({
        name: founderForm.name,
        designation: founderForm.designation,
        message: founderForm.message,
      });

      const formData = new FormData()
      formData.append("key", "founder_message")
      formData.append("title", founderForm.title)
      formData.append("content", contentJson)
      if (founderForm.file) formData.append("image", founderForm.file)

      await api.post("/site-content", formData, { headers: { "Content-Type": "multipart/form-data" } })
      toast.success("Founder Message updated successfully!")
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  if (isLoading && !siteContent.founder_message) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <LayoutDashboard className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-serif">Manage Site Content</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Update static text, pages, and images across the website.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-8 flex overflow-x-auto gap-1.5 bg-primary/8 border border-primary/15 p-1.5 rounded-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabsTrigger value="site_logo" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">🖼️ Site Logo</TabsTrigger>
          <TabsTrigger value="site_seo" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">🔍 SEO</TabsTrigger>
          <TabsTrigger value="founder_message" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">👤 Founder</TabsTrigger>
          <TabsTrigger value="home_hero" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">🎯 Hero Slider</TabsTrigger>
          <TabsTrigger value="about_preview" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">🏠 About (Home)</TabsTrigger>
          <TabsTrigger value="about_main" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">📄 About (Main)</TabsTrigger>
          <TabsTrigger value="vision_mission" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">🌟 Vision & Mission</TabsTrigger>
          <TabsTrigger value="focus_areas" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">🎯 Focus Areas</TabsTrigger>
          <TabsTrigger value="impact_stats" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">📊 Impact Stats</TabsTrigger>
          <TabsTrigger value="faqs" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">❓ FAQs</TabsTrigger>
          <TabsTrigger value="legal_pages" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">⚖️ Legal</TabsTrigger>
          <TabsTrigger value="contact_info" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">📞 Contact Info</TabsTrigger>
          <TabsTrigger value="donate_details" className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-4 font-semibold transition-all">💳 Donate Details</TabsTrigger>
        </TabsList>

        {/* SITE LOGO TAB */}
        <TabsContent value="site_logo">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={ImageIcon} title="Site Logo & Branding" description="Upload your website logo and browser tab icon" />
            <div className="p-6 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-primary/10 bg-emerald-50/30 p-5 space-y-3 col-span-1 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldGroup label="Organization / Site Name" hint="Full name of the organization">
                      <Input value={siteLogo.siteName || ""} onChange={e => setSiteLogo({ ...siteLogo, siteName: e.target.value })} className="border-primary/20" />
                    </FieldGroup>
                    <FieldGroup label="Short Name" hint="Used in mobile view or constrained spaces">
                      <Input value={siteLogo.shortName || ""} onChange={e => setSiteLogo({ ...siteLogo, shortName: e.target.value })} className="border-primary/20" />
                    </FieldGroup>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/10 bg-emerald-50/30 p-5 space-y-3">
                  <FieldGroup label="🌐 Main Logo" hint="Recommended: PNG with transparent background">
                    {siteLogo.logo && <Image src={siteLogo.logo} width={120} height={60} className="rounded-lg border bg-white p-2 object-contain" alt="Logo" />}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => {
                      const newData = { ...siteLogo, logo: url };
                      setSiteLogo(newData);
                      saveContent("site_logo", "Site Logo", newData);
                    }, "main_logo")} className="border-primary/20 focus:border-primary" />
                    {uploadingImage === "main_logo" && <div className="flex items-center gap-2 text-primary text-sm"><Loader2 className="animate-spin h-4 w-4" /> Uploading...</div>}
                  </FieldGroup>
                </div>
                <div className="rounded-xl border border-primary/10 bg-emerald-50/30 p-5 space-y-3">
                  <FieldGroup label="⭐ Favicon" hint="Should be a square image (32x32 or 64x64)">
                    {siteLogo.favicon && <Image src={siteLogo.favicon} width={48} height={48} className="rounded-lg border bg-white p-1 object-cover" alt="Favicon" />}
                    <Input type="file" accept="image/*,.ico" onChange={(e) => handleFileUpload(e, (url) => {
                      const newData = { ...siteLogo, favicon: url };
                      setSiteLogo(newData);
                      saveContent("site_logo", "Site Logo", newData);
                    }, "favicon")} className="border-primary/20 focus:border-primary" />
                    {uploadingImage === "favicon" && <div className="flex items-center gap-2 text-primary text-sm"><Loader2 className="animate-spin h-4 w-4" /> Uploading...</div>}
                  </FieldGroup>
                </div>

                <div className="rounded-xl border border-primary/10 bg-emerald-50/30 p-5 space-y-3">
                  <FieldGroup label="✍️ Official Signature" hint="Recommended: PNG with transparent background">
                    {siteLogo.signature && <Image src={siteLogo.signature} width={120} height={60} className="rounded-lg border bg-white p-2 object-contain" alt="Signature" />}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => {
                      const newData = { ...siteLogo, signature: url };
                      setSiteLogo(newData);
                      saveContent("site_logo", "Site Logo", newData);
                    }, "signature")} className="border-primary/20 focus:border-primary" />
                    {uploadingImage === "signature" && <div className="flex items-center gap-2 text-primary text-sm"><Loader2 className="animate-spin h-4 w-4" /> Uploading...</div>}
                  </FieldGroup>
                </div>
              </div>
              <SaveBtn onClick={() => saveContent("site_logo", "Site Logo", siteLogo)} disabled={isSaving || !!uploadingImage}>Save Details</SaveBtn>
            </div>
          </div>
        </TabsContent>

        {/* SITE SEO TAB */}
        <TabsContent value="site_seo">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={Target} title="Website SEO & Meta Tags" description="Update the main website title, description and keywords for search engines" />
            <div className="p-6 space-y-5 bg-white">
              <FieldGroup label="Website Title" hint="This is the main title shown on the browser tab">
                <Input value={siteSeo.title || ""} onChange={(e) => setSiteSeo({ ...siteSeo, title: e.target.value })} className="border-primary/20" />
              </FieldGroup>
              <FieldGroup label="Website Description" hint="Shown in Google search results">
                <Textarea value={siteSeo.description || ""} onChange={(e) => setSiteSeo({ ...siteSeo, description: e.target.value })} className="border-primary/20" />
              </FieldGroup>
              <FieldGroup label="Keywords" hint="Comma-separated keywords for SEO (e.g., NGO, Charity, Education)">
                <Textarea value={siteSeo.keywords || ""} onChange={(e) => setSiteSeo({ ...siteSeo, keywords: e.target.value })} className="border-primary/20" />
              </FieldGroup>
              <SaveBtn onClick={() => saveContent("site_seo", "Site SEO Settings", siteSeo)} disabled={isSaving}>Save SEO Settings</SaveBtn>
            </div>
          </div>
        </TabsContent>

        {/* FOUNDER MESSAGE TAB */}
        <TabsContent value="founder_message">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={MessageSquare} title="Founder's Message" description="This message appears on the Founder's page" />
            <div className="p-6 space-y-5 bg-white">
              <FieldGroup label="Page Heading / Title">
                <Input value={founderForm.title} onChange={(e) => setFounderForm({ ...founderForm, title: e.target.value })} placeholder="e.g. President's Message" className="border-primary/20 focus-visible:ring-primary" />
              </FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup label="Founder Name">
                  <Input value={founderForm.name} onChange={(e) => setFounderForm({ ...founderForm, name: e.target.value })} placeholder="Dr. Mubeen Saleem Al-Azhari" className="border-primary/20 focus-visible:ring-primary" />
                </FieldGroup>
                <FieldGroup label="Designation / Post">
                  <Input value={founderForm.designation} onChange={(e) => setFounderForm({ ...founderForm, designation: e.target.value })} placeholder="President" className="border-primary/20 focus-visible:ring-primary" />
                </FieldGroup>
              </div>
              <FieldGroup label="Detailed Message" hint="Use the formatting tools to style your message">
                <RichTextEditor value={founderForm.message} onChange={(val) => setFounderForm({ ...founderForm, message: val })} />
              </FieldGroup>
              <FieldGroup label="Founder's Photo">
                {founderForm.existingImage && !founderForm.file && (
                  <Image src={founderForm.existingImage} alt="Current" width={80} height={80} className="mb-2 rounded-xl object-cover border-2 border-primary/20" />
                )}
                <Input type="file" accept="image/*" onChange={(e) => setFounderForm({ ...founderForm, file: e.target.files[0] })} className="border-primary/20" />
              </FieldGroup>
              <SaveBtn onClick={handleSaveFounder} disabled={isSaving}>Save Founder Message</SaveBtn>
            </div>
          </div>
        </TabsContent>

        {/* VISION MISSION TAB */}
        <TabsContent value="vision_mission">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={Eye} title="Vision, Mission & Objectives" description="Core values displayed on the Vision & Mission page" />
            <div className="p-6 space-y-6 bg-white">
              <FieldGroup label="🌄 Our Vision" hint="What does the organization aspire to achieve?">
                <RichTextEditor value={visionMission.vision} onChange={val => setVisionMission({ ...visionMission, vision: val })} />
              </FieldGroup>
              <div className="border-t border-primary/10 pt-6">
                <FieldGroup label="🚀 Our Mission" hint="What actions does the organization take to achieve the vision?">
                  <RichTextEditor value={visionMission.mission} onChange={val => setVisionMission({ ...visionMission, mission: val })} />
                </FieldGroup>
              </div>
              <div className="border-t border-primary/10 pt-6">
                <FieldGroup label="🎯 Our Objectives" hint="Specific, measurable goals">
                  <RichTextEditor value={visionMission.objectives} onChange={val => setVisionMission({ ...visionMission, objectives: val })} />
                </FieldGroup>
              </div>
              <SaveBtn onClick={() => saveContent("vision_mission", "Vision & Mission", visionMission)} disabled={isSaving}>Save Vision & Mission</SaveBtn>
            </div>
          </div>
        </TabsContent>

        {/* LEGAL PAGES TAB */}
        <TabsContent value="legal_pages">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={Scale} title="Privacy Policy & Terms" description="Legal pages content shown to website visitors" />
            <div className="p-6 space-y-6 bg-white">
              <FieldGroup label="🔒 Privacy Policy">
                <RichTextEditor value={legalPages.privacy} onChange={val => setLegalPages({ ...legalPages, privacy: val })} />
                <div className="mt-3"><SaveBtn onClick={() => saveContent("privacy_policy", "Privacy Policy", legalPages.privacy)} disabled={isSaving}>Save Privacy Policy</SaveBtn></div>
              </FieldGroup>
              <div className="border-t border-primary/10 pt-6">
                <FieldGroup label="📋 Terms & Conditions">
                  <RichTextEditor value={legalPages.terms} onChange={val => setLegalPages({ ...legalPages, terms: val })} />
                  <div className="mt-3"><SaveBtn onClick={() => saveContent("terms_conditions", "Terms & Conditions", legalPages.terms)} disabled={isSaving}>Save Terms</SaveBtn></div>
                </FieldGroup>
              </div>
            </div>
          </div>
        </TabsContent>


        {/* FAQS TAB */}
        <TabsContent value="faqs">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={HelpCircle} title="Frequently Asked Questions" description="Questions and answers shown on the FAQ page" />
            <div className="p-6 space-y-4 bg-white">
              {faqs.map((faq, index) => (
                <ItemCard key={index} label={`Question ${index + 1}`} onDelete={() => setFaqs(faqs.filter((_, i) => i !== index))}>
                  <FieldGroup label="Question">
                    <Input value={faq.q} onChange={(e) => { const newFaqs = [...faqs]; newFaqs[index].q = e.target.value; setFaqs(newFaqs) }} placeholder="Enter the question..." className="border-primary/20" />
                  </FieldGroup>
                  <FieldGroup label="Answer">
                    <RichTextEditor value={faq.a} onChange={val => { const newFaqs = [...faqs]; newFaqs[index].a = val; setFaqs(newFaqs) }} />
                  </FieldGroup>
                </ItemCard>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <AddBtn onClick={() => setFaqs([...faqs, { q: "", a: "" }])}>Add New Question</AddBtn>
                <SaveBtn onClick={() => saveContent("faqs", "FAQs", faqs)} disabled={isSaving}>Save All FAQs</SaveBtn>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* CONTACT INFO TAB */}
        <TabsContent value="contact_info">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={Phone} title="Contact Info & Social Links" description="Phone, email, address and social media links" />
            <div className="p-6 space-y-6 bg-white">
              <div>
                <FieldGroup label="📞 Phone Numbers">
                  <div className="space-y-3">
                    {contactInfo.phones?.map((phone, idx) => (
                      <div key={idx} className="rounded-xl border border-primary/10 bg-emerald-50/30 p-4 space-y-3">
                        <div className="flex gap-2 items-center">
                          <Input className="flex-1 border-primary/20" value={phone.number} onChange={(e) => {
                            const newPhones = [...contactInfo.phones]
                            newPhones[idx].number = e.target.value
                            setContactInfo({ ...contactInfo, phones: newPhones })
                          }} placeholder="+91 XXXXXXXXXX" />
                          <button onClick={() => {
                            const newPhones = [...contactInfo.phones]
                            newPhones.splice(idx, 1)
                            setContactInfo({ ...contactInfo, phones: newPhones })
                          }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {[['showInNavbar','Show in Navbar'],['showInFooter','Show in Footer'],['showInContact','Show in Contact Page']].map(([key, label]) => (
                            <label key={key} className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium">
                              <input type="checkbox" className="accent-primary" checked={phone[key]} onChange={(e) => {
                                const newPhones = [...contactInfo.phones]; newPhones[idx][key] = e.target.checked; setContactInfo({ ...contactInfo, phones: newPhones })
                              }} /> {label}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <AddBtn onClick={() => setContactInfo({ ...contactInfo, phones: [...(contactInfo.phones || []), { number: "", showInNavbar: true, showInFooter: true, showInContact: true }] })}>Add Phone Number</AddBtn>
                  </div>
                </FieldGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup label="📧 Email Address">
                  <Input value={contactInfo.email} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder="info@example.com" className="border-primary/20" />
                </FieldGroup>
                <FieldGroup label="🏢 Office Address">
                  <Textarea value={contactInfo.address} onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })} className="border-primary/20" />
                </FieldGroup>
              </div>
              <div className="border-t border-primary/10 pt-6">
                <p className="text-sm font-bold text-primary mb-3">📱 Social Media Links</p>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Facebook"><Input value={contactInfo.facebook} onChange={e => setContactInfo({ ...contactInfo, facebook: e.target.value })} className="border-primary/20" /></FieldGroup>
                  <FieldGroup label="Instagram"><Input value={contactInfo.instagram} onChange={e => setContactInfo({ ...contactInfo, instagram: e.target.value })} className="border-primary/20" /></FieldGroup>
                  <FieldGroup label="Twitter / X"><Input value={contactInfo.twitter} onChange={e => setContactInfo({ ...contactInfo, twitter: e.target.value })} className="border-primary/20" /></FieldGroup>
                  <FieldGroup label="YouTube"><Input value={contactInfo.youtube} onChange={e => setContactInfo({ ...contactInfo, youtube: e.target.value })} className="border-primary/20" /></FieldGroup>
                </div>
              </div>
              <SaveBtn onClick={() => saveContent("contact_info", "Contact Info", contactInfo)} disabled={isSaving}>Save Contact Info</SaveBtn>
            </div>
          </div>
        </TabsContent>

        {/* DONATE DETAILS TAB */}
        <TabsContent value="donate_details">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={CreditCard} title="Donate Page Details" description="Bank account and UPI information for donations" />
            <div className="p-6 space-y-5 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup label="🏦 Bank Name"><Input value={donateDetails.bankName} onChange={e => setDonateDetails({ ...donateDetails, bankName: e.target.value })} className="border-primary/20" /></FieldGroup>
                <FieldGroup label="Account Name"><Input value={donateDetails.accountName} onChange={e => setDonateDetails({ ...donateDetails, accountName: e.target.value })} className="border-primary/20" /></FieldGroup>
                <FieldGroup label="Account Number"><Input value={donateDetails.accountNumber} onChange={e => setDonateDetails({ ...donateDetails, accountNumber: e.target.value })} className="border-primary/20" /></FieldGroup>
                <FieldGroup label="IFSC Code"><Input value={donateDetails.ifscCode} onChange={e => setDonateDetails({ ...donateDetails, ifscCode: e.target.value })} className="border-primary/20" /></FieldGroup>
                <FieldGroup label="📱 UPI ID"><Input value={donateDetails.upiId} onChange={e => setDonateDetails({ ...donateDetails, upiId: e.target.value })} className="border-primary/20" /></FieldGroup>
              </div>
              <div className="border-t border-primary/10 pt-5">
                <FieldGroup label="🔲 UPI QR Code Image" hint="Upload a clear QR code image for donors to scan">
                  <div className="flex gap-4 items-center">
                    {donateDetails.qrImage && <Image src={donateDetails.qrImage} width={100} height={100} className="rounded-xl border-2 border-primary/20 p-1" alt="QR" />}
                    <div className="flex-1">
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setDonateDetails({ ...donateDetails, qrImage: url }), "qr_image")} className="border-primary/20" />
                      {uploadingImage === "qr_image" && <div className="flex items-center gap-2 text-primary text-sm mt-2"><Loader2 className="animate-spin h-4 w-4" /> Uploading...</div>}
                    </div>
                  </div>
                </FieldGroup>
              </div>
              <SaveBtn onClick={() => saveContent("donate_details", "Donate Details", donateDetails)} disabled={isSaving}>Save Donate Details</SaveBtn>
            </div>
          </div>
        </TabsContent>


        {/* HERO SLIDER TAB */}
        <TabsContent value="home_hero">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={Layers} title="Hero Slider (Homepage)" description="The large banner slides shown at the top of the homepage" />
            <div className="p-6 space-y-4 bg-white">
              {heroSlides.map((slide, index) => (
                <ItemCard key={index} label={`Slide ${index + 1}`} onDelete={() => setHeroSlides(heroSlides.filter((_, i) => i !== index))}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldGroup label="Normal Title"><Input value={slide.title} onChange={(e) => { const newS = [...heroSlides]; newS[index].title = e.target.value; setHeroSlides(newS) }} className="border-primary/20" /></FieldGroup>
                    <FieldGroup label="✨ Highlighted Title" hint="This title shows in gold/accent color"><Input value={slide.highlight} onChange={(e) => { const newS = [...heroSlides]; newS[index].highlight = e.target.value; setHeroSlides(newS) }} className="border-primary/20" /></FieldGroup>
                  </div>
                  <FieldGroup label="Description"><Textarea value={slide.desc} onChange={(e) => { const newS = [...heroSlides]; newS[index].desc = e.target.value; setHeroSlides(newS) }} className="border-primary/20" /></FieldGroup>
                  <FieldGroup label="Background Image">
                    <div className="flex gap-3 items-center">
                      {slide.image && <Image src={slide.image} width={60} height={40} className="rounded-lg object-cover h-12 w-20 shrink-0 border-2 border-primary/20" alt="preview" />}
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const newS = [...heroSlides]; newS[index].image = url; setHeroSlides(newS) }, `hero_${index}`)} className="border-primary/20" />
                      {uploadingImage === `hero_${index}` && <div className="flex items-center gap-1 text-primary text-xs shrink-0"><Loader2 className="animate-spin h-4 w-4" /> Uploading</div>}
                    </div>
                  </FieldGroup>
                </ItemCard>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <AddBtn onClick={() => setHeroSlides([...heroSlides, { title: "", highlight: "", desc: "", image: "" }])}>Add New Slide</AddBtn>
                <SaveBtn onClick={() => saveContent("home_hero", "Hero Slider", heroSlides)} disabled={isSaving}>Save Hero Slider</SaveBtn>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ABOUT PREVIEW TAB */}
        <TabsContent value="about_preview">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={Info} title="About Section (Homepage)" description="The short 'About Us' preview shown on the homepage" />
            <div className="p-6 space-y-5 bg-white">
              <FieldGroup label="Section Heading"><Input value={aboutPreview.title} onChange={(e) => setAboutPreview({ ...aboutPreview, title: e.target.value })} className="border-primary/20" /></FieldGroup>
              <FieldGroup label="Description" hint="A short paragraph introducing the organization"><Textarea className="min-h-[120px] border-primary/20" value={aboutPreview.content} onChange={(e) => setAboutPreview({ ...aboutPreview, content: e.target.value })} /></FieldGroup>
              <FieldGroup label="✅ Bullet Points" hint="Key highlights shown as a list">
                <div className="space-y-2">
                  {aboutPreview.points.map((point, index) => (
                    <Input key={index} value={point} onChange={(e) => {
                      const newP = [...aboutPreview.points]; newP[index] = e.target.value; setAboutPreview({ ...aboutPreview, points: newP });
                    }} placeholder={`Point ${index + 1}`} className="border-primary/20" />
                  ))}
                </div>
              </FieldGroup>
              <SaveBtn onClick={() => saveContent("about_preview", aboutPreview.title, { description: aboutPreview.content, points: aboutPreview.points.filter(p => p.trim() !== "") })} disabled={isSaving}>Save About Section</SaveBtn>
            </div>
          </div>
        </TabsContent>

        {/* ABOUT MAIN PAGE TAB */}
        <TabsContent value="about_main">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={Info} title="About Us (Main Page)" description="Full content of the /about page" />
            <div className="p-6 space-y-6 bg-white">
              <FieldGroup label="Side Image" hint="Displayed alongside the content on the About page">
                <div className="flex gap-3 items-center">
                  {aboutMain.image && <Image src={aboutMain.image} width={60} height={60} className="rounded-xl object-cover h-16 w-16 shrink-0 border-2 border-primary/20" alt="preview" />}
                  <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setAboutMain({ ...aboutMain, image: url }), "about_main")} className="border-primary/20" />
                  {uploadingImage === "about_main" && <div className="flex items-center gap-1 text-primary text-xs"><Loader2 className="animate-spin h-4 w-4" /> Uploading</div>}
                </div>
              </FieldGroup>
              <FieldGroup label="🏷️ Highlight Tags" hint="3 short tags shown as badge buttons">
                <div className="grid grid-cols-3 gap-2">
                  {aboutMain.stats.map((stat, idx) => (
                    <Input key={idx} value={stat} onChange={(e) => {
                      const newStats = [...aboutMain.stats]; newStats[idx] = e.target.value; setAboutMain({ ...aboutMain, stats: newStats });
                    }} placeholder={`Tag ${idx + 1}`} className="border-primary/20" />
                  ))}
                </div>
              </FieldGroup>
              <div className="border-t border-primary/10 pt-6 space-y-4">
                <p className="text-sm font-bold text-primary">📝 Content Sections</p>
                {aboutMain.sections.map((section, idx) => (
                  <ItemCard key={idx} label={`Section ${idx + 1}`} onDelete={() => setAboutMain({ ...aboutMain, sections: aboutMain.sections.filter((_, i) => i !== idx) })}>
                    <FieldGroup label="Heading"><Input value={section[0]} onChange={(e) => { const newS = [...aboutMain.sections]; newS[idx][0] = e.target.value; setAboutMain({ ...aboutMain, sections: newS }) }} placeholder="Enter section heading..." className="border-primary/20" /></FieldGroup>
                    <FieldGroup label="Paragraph"><RichTextEditor value={section[1]} onChange={(val) => { const newS = [...aboutMain.sections]; newS[idx][1] = val; setAboutMain({ ...aboutMain, sections: newS }) }} /></FieldGroup>
                  </ItemCard>
                ))}
                <div className="flex flex-wrap gap-3">
                  <AddBtn onClick={() => setAboutMain({ ...aboutMain, sections: [...aboutMain.sections, ["", ""]] })}>Add Section</AddBtn>
                  <SaveBtn onClick={() => saveContent("about_main", "About Us (Main Page)", aboutMain)} disabled={isSaving}>Save About Page</SaveBtn>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* FOCUS AREAS TAB */}
        <TabsContent value="focus_areas">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={Target} title="Focus Areas" description="The 6 program cards shown on the homepage" />
            <div className="p-6 space-y-4 bg-white">
              {focusAreas.map((area, index) => (
                <ItemCard key={index} label={`Area ${index + 1}: ${area.title || 'Untitled'}`} onDelete={() => setFocusAreas(focusAreas.filter((_, i) => i !== index))}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldGroup label="Title"><Input value={area.title} onChange={(e) => { const newA = [...focusAreas]; newA[index].title = e.target.value; setFocusAreas(newA) }} placeholder="e.g. Education" className="border-primary/20" /></FieldGroup>
                    <FieldGroup label="Icon" hint="Choose from the icon list"><IconPicker value={area.icon} onChange={(val) => { const newA = [...focusAreas]; newA[index].icon = val; setFocusAreas(newA) }} /></FieldGroup>
                  </div>
                  <FieldGroup label="Description"><Textarea value={area.desc} onChange={(e) => { const newA = [...focusAreas]; newA[index].desc = e.target.value; setFocusAreas(newA) }} placeholder="Short description of this focus area..." className="border-primary/20" /></FieldGroup>
                  <FieldGroup label="Card Image">
                    <div className="flex gap-3 items-center">
                      {area.image && <Image src={area.image} width={60} height={40} className="rounded-xl object-cover h-14 w-20 shrink-0 border-2 border-primary/20" alt="preview" />}
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const newA = [...focusAreas]; newA[index].image = url; setFocusAreas(newA) }, `focus_${index}`)} className="border-primary/20" />
                      {uploadingImage === `focus_${index}` && <div className="flex items-center gap-1 text-primary text-xs"><Loader2 className="animate-spin h-4 w-4" /> Uploading</div>}
                    </div>
                  </FieldGroup>
                </ItemCard>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <AddBtn onClick={() => setFocusAreas([...focusAreas, { title: "", desc: "", image: "", icon: "" }])}>Add Focus Area</AddBtn>
                <SaveBtn onClick={() => saveContent("focus_areas", "Focus Areas", focusAreas)} disabled={isSaving}>Save Focus Areas</SaveBtn>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* IMPACT STATS TAB */}
        <TabsContent value="impact_stats">
          <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
            <GreenCardHeader icon={BarChart3} title="Impact Stats" description="Numbers shown on the homepage (e.g. 5000+ Lives Impacted)" />
            <div className="p-6 space-y-4 bg-white">
              {impactStats.map((stat, index) => (
                <ItemCard key={index} label={`Stat ${index + 1}: ${stat.label || 'Untitled'}`} onDelete={() => setImpactStats(impactStats.filter((_, i) => i !== index))}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FieldGroup label="Number / Value" hint="e.g. 5000+"><Input value={stat.value} onChange={(e) => { const newS = [...impactStats]; newS[index].value = e.target.value; setImpactStats(newS) }} placeholder="5000+" className="border-primary/20" /></FieldGroup>
                    <FieldGroup label="Label" hint="e.g. Lives Impacted"><Input value={stat.label} onChange={(e) => { const newS = [...impactStats]; newS[index].label = e.target.value; setImpactStats(newS) }} placeholder="Lives Impacted" className="border-primary/20" /></FieldGroup>
                    <FieldGroup label="Icon"><IconPicker value={stat.icon} onChange={(val) => { const newS = [...impactStats]; newS[index].icon = val; setImpactStats(newS) }} /></FieldGroup>
                  </div>
                </ItemCard>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <AddBtn onClick={() => setImpactStats([...impactStats, { value: "", label: "", icon: "" }])}>Add Stat</AddBtn>
                <SaveBtn onClick={() => saveContent("impact_stats", "Impact Stats", impactStats)} disabled={isSaving}>Save Impact Stats</SaveBtn>
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
