"use client"

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSiteContent } from '@/redux/features/siteContentSlice'

export default function TermsPage() {
  const dispatch = useDispatch()
  const { data: siteContent } = useSelector((state) => state.siteContent)

  useEffect(() => {
    dispatch(fetchSiteContent())
  }, [dispatch])

  const termsContent = siteContent?.terms_conditions?.content || "<p>Terms and conditions go here. Please update via Admin Panel.</p>"

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-navy sm:text-4xl mb-8">Terms & Conditions</h1>
        
        <div 
          className="prose prose-slate max-w-none text-muted-foreground space-y-6"
          dangerouslySetInnerHTML={{ __html: termsContent }}
        />
      </div>
    </div>
  )
}
