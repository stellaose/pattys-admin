// ! Layout
export const dashboardBody = "min-h-[100svh] w-full bg-white-100";

export const sidebar =
  "!fixed !h-[100svh] !left-0 !top-0 !bottom-0 z-30 !bg-sidebar border-r border-lilac-200/60";

export const sidebarLogo =
  "flex items-center gap-3 h-[72px] px-6 border-b border-lilac-200/60";

export const sidebarLogoText = "text-black-200 font-lora font-bold text-20";

export const sidebarFooter = "px-4 py-6 border-t border-lilac-200/60 mt-4";

export const sidebarLogout =
  "flex w-full items-center gap-3.5 rounded-10 px-4 py-3.5 text-base font-arial text-black-200 transition hover:bg-lilac-200/50 cursor-pointer";

export const sidebarOverlay = "fixed inset-0 z-20 bg-black/40 lg:hidden";

export const sidebarMark =
  "flex h-10 w-10 items-center justify-center rounded-10 bg-white text-20 font-lora font-bold text-purple-200 ring-1 ring-lilac-200";

export const sidebarToggle =
  "max-lg:hidden absolute -right-[18px] top-[54px] z-10 flex h-9 w-9 items-center justify-center rounded-full border border-lilac-200 bg-white text-purple-200 shadow-mmd transition hover:scale-110 hover:bg-lilac-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200 cursor-pointer";

// ? Header
export const dashboardHeader =
  "sticky top-0 z-10 flex h-[72px] items-center justify-between gap-4 border-b border-white-150 bg-white px-6 max-sm:px-4";

export const dashboardHeaderTitle =
  "text-24 max-sm:text-20 font-lora font-bold text-black-200 flex gap-2 items-center cursor-pointer";

export const dashboardHeaderUser =
  "flex items-center gap-3 rounded-50 py-1 pl-1 pr-3 transition hover:bg-white-100 cursor-pointer";

export const dashboardHeaderName =
  "text-sm font-bold font-arial text-black-200 max-sm:hidden";

export const dashboardHeaderRole =
  "text-xs font-arial text-grey-100 max-sm:hidden";

// & Content
export const dashboardContent = "p-6 max-sm:p-4";

// ^ Overview
export const overviewToolbar =
  "flex flex-wrap items-end justify-between gap-4 mb-6";

export const overviewHeading = "text-20 font-lora font-bold text-black-200";

export const overviewRange = "text-sm font-arial text-grey-200";

export const statGrid =
  "grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6";

// the background illustration comes from each card's `bgClass`
export const statTile =
  "stat-card-bg flex flex-col gap-3 rounded-20 border border-white-150 bg-white p-4 sm:p-5 text-left transition hover:shadow-mmd";

export const statTileLabel = "text-sm font-arial text-grey-200";

// the colour comes from each card's `iconClass`
export const statTileIcon =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-10 text-white shadow-sm";

export const statTileValue =
  "text-24 sm:text-32 font-arial font-bold leading-tight text-black-200";

export const statTileMeta = "text-xs font-arial text-grey-100";

export const chartCard = "rounded-20 border border-white-150 bg-white p-5";

export const chartTitle = "text-base font-lora font-bold text-black-200";

export const chartSubtitle = "text-xs font-arial text-grey-200";

