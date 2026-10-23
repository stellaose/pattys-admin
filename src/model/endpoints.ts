
export const endpoints = {
  auth: {
    login: "/auth/login", 
    verifyLogin: "/auth/verify-login", 
    createPassword: "/auth/create-password", 
    forgotPassword: "/auth/forgot-password", 
    verifyForgotPassword: "/auth/verify-forgot-password", 
    resetPassword: "/auth/reset-password", 
    changePassword: "/auth/change-password", 
    logout: "/auth/logout", 
  },
  admin: {
    invite: "/admins/invite", 
    profile: "/admins/me", 
    completeProfile: "/admins/me/complete-profile", 
    all: "/admins", 
    one: "/admins/:adminId", 
    edit: "/admins/:adminId", 
    updateStatus: "/admins/:adminId/status", 
    delete: "/admins/:adminId", 
  },
  role: {
    create: "/role", 
    all: "/role", 
    one: "/role/:roleId", 
    edit: "/role/:roleId", 
    updateStatus: "/role/:roleId/status", 
    delete: "/role/:roleId", 
    setPermissions: "/role/:roleId/permissions", 
  },
  resource: {
    create: "/resource", 
    all: "/resource", 
    one: "/resource/:resourceId", 
    edit: "/resource/:resourceId", 
    delete: "/resource/:resourceId", 
  },
  dashboard: {
    summary: "/dashboard/summary",
    trends: "/dashboard/trends",
    breakdown: "/dashboard/breakdown",
    totals: "/dashboard/totals",
    topBlogs: "/dashboard/top-blogs",
    topReviews: "/dashboard/top-reviews",
  },
  blogs: {
    all: "/blogs",
    one: "/blogs/:blogId",
  },
  bloggers: {
    all: "/bloggers",
  },
  comments: {
    all: "/comments",
  },
  contacts: {
    all: "/contacts",
  },
  activity: {
    users: "/activity/users",
    admins: "/activity/admins",
  },
};
