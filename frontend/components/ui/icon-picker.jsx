import React, { useState } from "react"
import * as LucideIcons from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// A curated list of icons relevant to NGOs, trusts, and general UI
const CURATED_ICONS = [
  "Heart", "HeartPulse", "HeartHandshake", "Users", "Users2", "User", "UserPlus",
  "GraduationCap", "BookOpen", "School", "Library", "Pencil",
  "TreePine", "Leaf", "Sprout", "Apple", "Wheat", "Flower",
  "Hospital", "Stethoscope", "Pill", "Activity", "Cross", "Syringe",
  "Coins", "HandCoins", "Wallet", "Banknote", "PiggyBank", "TrendingUp",
  "Shield", "ShieldCheck", "Target", "Home", "Globe", "MapPin", "Map",
  "Phone", "Mail", "MessageCircle", "CheckCircle", "Check", "Star",
  "Smile", "Sun", "Droplet", "Flame", "Wind", "Mountain", "Tent",
  "Truck", "Package", "Gift", "Briefcase", "Building", "Building2"
]

export function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredIcons = CURATED_ICONS.filter(name => name.toLowerCase().includes(search.toLowerCase()))
  
  const SelectedIcon = LucideIcons[value] || LucideIcons.HelpCircle

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-between w-full h-10 px-3 font-normal border rounded-md shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
          <div className="flex items-center gap-2 truncate">
            {value ? (
              <>
                <SelectedIcon className="size-4 shrink-0 text-navy" />
                <span className="truncate">{value}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Select an icon...</span>
            )}
          </div>
          <LucideIcons.ChevronDown className="size-4 opacity-50 shrink-0" />
      </DialogTrigger>
      
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Choose an Icon</DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search icons..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </DialogHeader>
        
        <div className="p-4 max-h-[350px] overflow-y-auto">
          {filteredIcons.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">No icons found.</p>
          ) : (
            <div className="grid grid-cols-6 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComp = LucideIcons[iconName]
                const isSelected = value === iconName
                return (
                  <button
                    key={iconName}
                    onClick={() => {
                      onChange(iconName)
                      setOpen(false)
                    }}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 transition-all hover:bg-secondary ${isSelected ? "bg-accent/20 text-navy ring-1 ring-accent" : "text-muted-foreground hover:text-navy"}`}
                    title={iconName}
                  >
                    <IconComp className="size-5" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
