export const EP = {
  register: "/auth/register", memberLogin: "/auth/login/member", adminLogin: "/auth/login/admin", logout: "/auth/logout", me: "/auth/me",
  members: "/members", membersApply: "/members/apply", membersMe: "/members/me", memberApprove: (id) => `/members/${id}/approve`,
  donations: "/donations", donationsMe: "/donations/me", donationManual: "/donations/manual",
  events: "/events", projects: "/projects", news: "/news", gallery: "/gallery", campaigns: "/crowdfunding",
  team: "/team", awards: "/awards", reports: "/reports", downloads: "/downloads", contact: "/contact",
  dashboardStats: "/dashboard/stats", backup: "/admin/backup",
}
