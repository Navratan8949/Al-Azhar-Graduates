// Simplified Admin Permissions
// Since the complex role hierarchy was removed, all admins have full access.

export const ADMIN_ROLES = ["admin"]

export const isAdminRole = (role) => {
    return role === "admin"
}

export const canAccessAdminPath = (pathname, user) => {
    if (!user || user.role !== "admin") return false
    // Admin has access to all admin paths
    return true
}

export const getFirstAllowedAdminPath = (user, adminNav = []) => {
    if (!user || user.role !== "admin") return "/admin-login"
    // Default dashboard path
    return "/admin"
}

export const checkPermission = (userRole, moduleName) => {
    // If the user has the admin role, they have access to all modules.
    if (!userRole) return false
    return userRole === "admin"
}

export const canAccessAdminModule = (userRole, moduleName) => {
    // Legacy support for crud-page.jsx
    return userRole === "admin"
}

export const getAdminModuleForEndpoint = (endpoint) => {
    // Legacy support for crud-page.jsx
    return "any_module"
}
