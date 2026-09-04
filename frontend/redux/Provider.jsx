"use client"
import { Provider, useDispatch } from "react-redux"
import { useEffect } from "react"
import store from "./Store"
import { fetchUser } from "./features/userSlice"
import { fetchSiteContent } from "./features/siteContentSlice"

function AppInitializer({ children }) {
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Fetch site content globally
    dispatch(fetchSiteContent())

    // Fetch user if token exists
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      dispatch(fetchUser())
    }
  }, [dispatch])

  return <>{children}</>
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  )
}
