
export interface ApiError {
  status: number;
  data: {
    message: string;
    name?: string;
  };
}

export type ErrorResponse = {
  response: {
    data: {
      message: string;
      error: string;
    };
  };
};

export type DashboardPeriod = "day" | "week" | "month" | "year";

export type DashboardMetricKey =
  | "visits"
  | "failedLogins"
  | "signups"
  | "deletedUsers"
  | "admins"
  | "blogs"
  | "flaggedBlogs"
  | "reviews"
  | "contactMessages";

export type DashboardRange = { from: string; to: string };

export type DashboardMetric = {
  current: number;
  previous: number;
  change: number | null;
};

export type DashboardSummary = {
  period: DashboardPeriod;
  range: DashboardRange;
  previousRange: DashboardRange;
  metrics: Record<DashboardMetricKey, DashboardMetric>;
  totals: {
    users: number;
    admins: number;
    blogs: number;
    reviews: number;
    contactMessages: number;
    visits: number;
  };
};

export type DashboardTrendPoint = { periodStart: string } & Record<
  DashboardMetricKey,
  number
>;

export type DashboardTotals = {
  totals: DashboardSummary["totals"];
};

export type DashboardSlice = { label: string; value: number };

export type DashboardBreakdown = {
  period: DashboardPeriod | "all";
  range: DashboardRange | null;
  users: {
    total: number;
    byGender: DashboardSlice[];
    byVerification: DashboardSlice[];
  };
  admins: {
    total: number;
    byStatus: DashboardSlice[];
    byRole: DashboardSlice[];
  };
  blogs: {
    total: number;
    byCategory: DashboardSlice[];
    byStatus: DashboardSlice[];
  };
};

export type DashboardTrends = {
  interval: DashboardPeriod;
  count: number;
  range: DashboardRange;
  series: DashboardTrendPoint[];
};

export type AuthorDetails = {
  userId: string;
  first_name?: string;
  last_name?: string;
  user_name?: string;
};

export type TopBlog = {
  blogId: string;
  title: string;
  category?: string;
  likeNo: number;
  dislikeNo?: number;
  isFlagged?: boolean;
  reviewCount: number;
  createdAt: string;
  author: string;
  authorDetails: AuthorDetails | null;
};

export type TopReview = {
  reviewId: string;
  blogId: string;
  blogTitle: string | null;
  review: string;
  likeNo: number;
  isEdited?: boolean;
  createdAt: string;
  author: string;
  authorDetails: AuthorDetails | null;
};

export type AdminBlogReview = {
  reviewId: string;
  review: string;
  likeNo: number;
  isEdited?: boolean;
  author: string;
  authorDetails: AuthorDetails | null;
};

export type AdminBlog = {
  blogId: string;
  title: string;
  category?: string;
  description: string[];
  likeNo: number;
  dislikeNo: number;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  authorDetails: AuthorDetails | null;
  review: AdminBlogReview[];
};

export type ActivityKind = "users" | "admins";

export type ActivityStatus = "success" | "failed";

export type ActivityLog = {
  logId: string;
  activity_type: string;
  description: string;
  activity_status: ActivityStatus;
  createdAt: string;
  userId?: string;
  adminId?: string;
  userDetails?: AuthorDetails | null;
  adminDetails?: {
    adminId: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
};

export type ActivityPage = {
  logs: ActivityLog[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type Blogger = {
  userId: string;
  first_name?: string;
  last_name?: string;
  user_name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  isEmailVerified?: boolean;
  blogCount: number;
  createdAt: string;
};

export type ContactMessage = {
  contactId: string;
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  isEmailSent?: boolean;
  createdAt: string;
};

export type AdminAccount = {
  adminId: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email: string;
  phone_number?: string;
  gender?: string;
  role?: string;
  roleId?: string;
  status?: string;
  adminRole?: { name?: string; role?: string } | null;
  is_created_password?: boolean;
  is_completed_profile?: boolean;
  permissions?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};

export type AdminRole = {
  roleId: string;
  role?: string;
  name?: string;
  code?: string;
  status?: string;
  permissions?: unknown[];
  createdAt?: string;
};
