"use client"

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSiteContent } from '@/redux/features/siteContentSlice'

export default function PrivacyPolicyPage() {
  const dispatch = useDispatch()
  const { data: siteContent } = useSelector((state) => state.siteContent)

  useEffect(() => {
    dispatch(fetchSiteContent())
  }, [dispatch])

  const privacyContent = siteContent?.privacy_policy?.content || "<p>Privacy policy content goes here. Please update via Admin Panel.</p>"

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-navy sm:text-4xl mb-8">Privacy Policy</h1>
        
        <div 
          className="prose prose-slate max-w-none text-muted-foreground space-y-6"
          dangerouslySetInnerHTML={{ __html: privacyContent }}
        />
      </div>
    </div>
  )
}
