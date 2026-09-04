"use client"
import { useState, useRef } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import api from "@/service/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Eye, ExternalLink, Image as ImageIcon, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function Page() {
  const [selectedDonation, setSelectedDonation] = useState(null)
  const crudRef = useRef(null)

  const schema = [
    { name: "fullName", label: "Donor Name", required: true },
    { name: "email", label: "Email", required: true },
    { name: "phone", label: "Phone", required: true },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "paymentMethod", label: "Payment Method", type: "select", options: [
      { label: "Online (Razorpay)", value: "online" },
      { label: "UPI", value: "upi" },
      { label: "Bank Transfer", value: "bank" },
      { label: "Cash", value: "cash" }
    ], required: true },
    { name: "paymentStatus", label: "Payment Status", type: "select", options: [
      { label: "Pending", value: "pending" },
      { label: "Verified / Success", value: "verified" },
      { label: "Rejected / Failed", value: "rejected" }
    ], required: true },
    { name: "purpose", label: "Purpose" }
  ]

  const columns = [
    { 
      key: "receiptNumber", 
      label: "Receipt No.", 
      render: (r) => <span className="font-mono text-xs font-bold text-navy">{r.receiptNumber || "N/A"}</span> 
    },
    { 
      key: "donor", 
      label: "Donor", 
      render: (r) => (
        <div>
          <p className="font-semibold text-foreground">{r.fullName || r.member?.user?.fullName || "Anonymous"}</p>
          <p className="text-xs text-muted-foreground">{r.email || r.member?.user?.email || "No email"}</p>
          {r.phone && <p className="text-[11px] text-muted-foreground">{r.phone}</p>}
        </div>
      ) 
    },
    { 
      key: "amount", 
      label: "Amount", 
      render: (r) => <span className="font-bold text-emerald-700">₹{r.amount?.toLocaleString("en-IN")}</span> 
    },
    { 
      key: "transactionId", 
      label: "Ref / UTR", 
      render: (r) => (
        <span className="font-mono text-xs text-muted-foreground">
          {r.transactionId || r.paymentId || "—"}
        </span>
      ) 
    },
    { 
      key: "cause", 
      label: "Cause / Purpose", 
      render: (r) => {
        if (r.campaign) return <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">Campaign: {r.campaign.title}</span>
        if (r.project) return <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">Project: {r.project.title}</span>
        return <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-semibold">{r.purpose || "General Fund"}</span>
      } 
    },
    { 
      key: "proof", 
      label: "Proof", 
      render: (r) => r.paymentProof?.url ? (
        <a 
          href={r.paymentProof.url} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          <ImageIcon className="size-3.5" /> View
        </a>
      ) : <span className="text-xs text-muted-foreground">None</span>
    },
    { 
      key: "mode", 
      label: "Mode", 
      render: (r) => (
        <span className="uppercase text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-secondary text-navy">
          {r.paymentMethod}
        </span>
      ) 
    },
    { 
      key: "status", 
      label: "Status", 
      render: (r) => (
        <StatusBadge status={r.paymentStatus === 'success' ? 'verified' : r.paymentStatus} />
      ) 
    }
  ]

  const handleAction = async (id, status, crud) => {
    try {
      await api.put(`/donations/${id}/verify`, { status })
      toast.success(`Donation marked as ${status}`)
      
      // Update UI immediately
      if (crudRef.current && crudRef.current.updateLocalItem) {
        crudRef.current.updateLocalItem(id, { paymentStatus: status })
      } else if (crud && crud.updateLocalItem) {
        crud.updateLocalItem(id, { paymentStatus: status })
      }

      // Also trigger a background fetch to ensure sync
      if (crudRef.current && crudRef.current.fetchAll) {
        crudRef.current.fetchAll()
      } else if (crud && crud.fetchAll) {
        crud.fetchAll()
      }
      
      if (selectedDonation && selectedDonation._id === id) {
        setSelectedDonation(prev => ({ ...prev, paymentStatus: status }))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update donation status`)
    }
  }

  const actionButtons = (r, crud, permissions) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedDonation(r)}
        className="h-8 rounded-lg text-xs font-bold text-navy border-navy/20 hover:bg-navy/5"
      >
        <Eye className="mr-1 size-3.5 text-accent" /> View Details
      </Button>

      {permissions.canEdit && r.paymentStatus !== "verified" && r.paymentStatus !== "success" && (
        <Button 
          size="sm"
          onClick={() => handleAction(r._id, "verified", crud)}
          className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5"
        >
          <CheckCircle2 className="mr-1 size-3.5" /> Verify
        </Button>
      )}

      {permissions.canEdit && r.paymentStatus !== "rejected" && (
        <Button 
          size="sm"
          variant="outline"
          onClick={() => handleAction(r._id, "rejected", crud)}
          className="h-8 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold px-2.5"
        >
          <XCircle className="mr-1 size-3.5" /> Reject
        </Button>
      )}
    </div>
  )

  return (
    <>
      <AdminCrudPage
        title="Donations"
        description="Manage and verify all online and manual (UPI/Bank) donations. Verifying a manual donation generates an 80G tax receipt and sends an email to the donor."
        endpoint="/donations"
        schema={schema}
        columns={columns}
        customActions={actionButtons}
        hideDelete={true}
        hideEdit={true}
        crudRef={crudRef}
      />

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <Dialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
          <DialogContent className="max-w-md rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold text-navy flex items-center gap-2">
                <CreditCard className="size-5 text-accent" /> Donation Details
              </DialogTitle>
              <DialogDescription>
                Receipt #{selectedDonation.receiptNumber || "N/A"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm mt-2">
              <div className="rounded-xl border border-border/70 bg-secondary/30 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Donor Name:</span>
                  <span className="font-bold text-foreground">{selectedDonation.fullName || selectedDonation.member?.user?.fullName || "Donor"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-foreground">{selectedDonation.email || selectedDonation.member?.user?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium text-foreground">{selectedDonation.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-emerald-700 text-base">₹{selectedDonation.amount?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="uppercase font-semibold text-navy">{selectedDonation.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <StatusBadge status={selectedDonation.paymentStatus === 'success' ? 'verified' : selectedDonation.paymentStatus} />
                </div>
              </div>

              {selectedDonation.transactionId && (
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">Transaction ID / UTR</span>
                  <p className="font-mono text-sm bg-muted p-2 rounded-lg mt-1 font-semibold">{selectedDonation.transactionId}</p>
                </div>
              )}

              {selectedDonation.purpose && (
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">Donation Purpose</span>
                  <p className="text-sm bg-muted/60 p-2 rounded-lg mt-1">{selectedDonation.purpose}</p>
                </div>
              )}

              {selectedDonation.paymentProof?.url && (
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase block mb-2">Payment Proof Screenshot</span>
                  <a href={selectedDonation.paymentProof.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-border/80 group">
                    <img 
                      src={selectedDonation.paymentProof.url} 
                      alt="Payment Proof" 
                      className="w-full max-h-48 object-cover group-hover:scale-105 transition-transform" 
                    />
                    <span className="block bg-secondary p-2 text-center text-xs font-bold text-accent group-hover:underline flex items-center justify-center gap-1">
                      Open full image <ExternalLink className="size-3" />
                    </span>
                  </a>
                </div>
              )}

              {/* Modal Quick Actions */}
              <div className="flex items-center gap-3 pt-2">
                {selectedDonation.paymentStatus !== "verified" && selectedDonation.paymentStatus !== "success" && (
                  <Button 
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-xs h-10"
                    onClick={() => handleAction(selectedDonation._id, "verified", crudRef.current)}
                  >
                    <CheckCircle2 className="mr-1.5 size-4" /> Verify Donation
                  </Button>
                )}

                {selectedDonation.paymentStatus !== "rejected" && (
                  <Button 
                    variant="outline"
                    className="flex-1 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs h-10"
                    onClick={() => handleAction(selectedDonation._id, "rejected", crudRef.current)}
                  >
                    <XCircle className="mr-1.5 size-4" /> Reject Donation
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
