"use client"
import { useState, useEffect, useCallback } from "react"
import api from "@/service/api"

export function useCrud(endpoint) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Generic Fetch (GET)
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get(endpoint)
      const raw = res.data?.data || res.data || []
      
      let fetchedData = []
      if (Array.isArray(raw)) {
        fetchedData = raw
      } else if (raw && typeof raw === 'object') {
        // Find the first value in the object that is an array (e.g., raw.members, raw.users)
        const arrayVal = Object.values(raw).find(val => Array.isArray(val))
        if (arrayVal) fetchedData = arrayVal
      }
      
      setData(fetchedData)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    if (endpoint) {
      fetchAll()
    } else {
      setLoading(false)
    }
  }, [fetchAll, endpoint])

  // Generic Create (POST)
  const createItem = async (payload) => {
    try {
      const res = await api.post(endpoint, payload)
      let newItem = res.data?.data || res.data
      if (newItem && typeof newItem === 'object' && !newItem._id && !newItem.id) {
        const objVal = Object.values(newItem).find(val => val && typeof val === 'object' && (val._id || val.id))
        if (objVal) newItem = objVal
      }
      setData(prev => [newItem, ...prev])
      return { success: true, data: newItem }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || "Failed to create" }
    }
  }

  // Generic Update (PUT)
  const updateItem = async (id, payload) => {
    try {
      const res = await api.put(`${endpoint}/${id}`, payload)
      let updatedItem = res.data?.data || res.data
      if (updatedItem && typeof updatedItem === 'object' && !updatedItem._id && !updatedItem.id) {
        const objVal = Object.values(updatedItem).find(val => val && typeof val === 'object' && (val._id || val.id))
        if (objVal) updatedItem = objVal
      }
      setData(prev => prev.map(item => (item._id === id || item.id === id) ? { ...item, ...updatedItem } : item))
      return { success: true, data: updatedItem }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || "Failed to update" }
    }
  }

  // Generic Delete (DELETE)
  const deleteItem = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`)
      setData(prev => prev.filter(item => item._id !== id && item.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || "Failed to delete" }
    }
  }

  const updateLocalItem = (id, updatedFields) => {
    setData(prev => prev.map(item => (item._id === id || item.id === id) ? { ...item, ...updatedFields } : item))
  }

  return {
    data,
    loading,
    error,
    fetchAll,
    createItem,
    updateItem,
    deleteItem,
    updateLocalItem
  }
}
