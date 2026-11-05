"use client";

import React from "react";
import Link from "next/link";

export interface StateNoticeProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionHref?: string;
  variant?: "default" | "success" | "warning" | "error" | "locked" | "empty";
  icon?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function StateNotice({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionHref,
  variant = "default",
  icon,
  className = "",
  compact = false,
}: StateNoticeProps) {
  const iconBg =
    variant === "success"
      ? "bg-[#5DAA3A]"
      : variant === "warning"
        ? "bg-[#FFE9A8]"
        : variant === "error"
          ? "bg-[#FFE0DE]"
          : variant === "locked"
            ? "bg-[#E5D5C5]"
            : "bg-[#FFE9A8]";

  const defaultIcon = (
    <svg
      viewBox="0 0 24 24"
      className="w-7 h-7 text-[#2B1B0F]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="0" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
      <line x1="8" y1="15" x2="16" y2="15" />
    </svg>
  );

  return (
    <div
      role="status"
      className={`
        bg-[#FFFDF7] border-[3px] border-[#2B1B0F]
        shadow-[4px_4px_0px_#2B1B0F] text-center
        ${compact ? "p-4 sm:p-5 space-y-3" : "p-6 sm:p-8 space-y-4"}
        ${className}
      `.trim()}
    >
      <div
        className={`
          w-12 h-12 mx-auto ${iconBg} border-[2px] border-[#2B1B0F]
          shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-center
        `}
      >
        {icon || defaultIcon}
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#2B1B0F]">
          {title}
        </h3>
        <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/80 leading-relaxed">
          {description}
        </p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          {actionLabel && (
            actionHref ? (
              <Link
                href={actionHref}
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] no-underline transition-all cursor-pointer"
              >
                {actionLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
              >
                {actionLabel}
              </button>
            )
          )}

          {secondaryActionLabel && (
            secondaryActionHref ? (
              <Link
                href={secondaryActionHref}
                className="inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 bg-white hover:bg-[#FFF7E6] text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] no-underline transition-all cursor-pointer"
              >
                {secondaryActionLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 bg-white hover:bg-[#FFF7E6] text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
              >
                {secondaryActionLabel}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 1. New student with no data
 */
export function NewStudentEmptyNotice({
  actionHref = "/student/diagnostic",
  className = "",
}: {
  actionHref?: string;
  className?: string;
}) {
  return (
    <StateNotice
      title="No check-ins yet."
      description="Take a 5-question check-in to find where to start."
      actionLabel="Start quick check"
      actionHref={actionHref}
      variant="warning"
      className={className}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2B1B0F]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="12" x2="15" y2="15" />
        </svg>
      }
    />
  );
}

/**
 * 2. New teacher with no class
 */
export function NewTeacherEmptyNotice({
  onAction,
  actionHref,
  className = "",
}: {
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}) {
  return (
    <StateNotice
      title="No classes yet."
      description="Set up your first class to see topic gaps."
      actionLabel="Make a class"
      onAction={onAction}
      actionHref={actionHref}
      variant="warning"
      className={className}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2B1B0F]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      }
    />
  );
}

/**
 * 3. No stickers
 */
export function NoBadgesNotice({
  actionHref = "/student/learn",
  className = "",
}: {
  actionHref?: string;
  className?: string;
}) {
  return (
    <StateNotice
      title="No badges earned yet."
      description="Complete lessons and practice worksheets to earn badges."
      actionLabel="Go to lessons"
      actionHref={actionHref}
      variant="default"
      className={className}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2B1B0F]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      }
    />
  );
}

/**
 * 4. No quests
 */
export function NoQuestsNotice({
  actionHref = "/student/practice",
  className = "",
}: {
  actionHref?: string;
  className?: string;
}) {
  return (
    <StateNotice
      title="All quests done."
      description="You finished today's quests. Return tomorrow for new ones."
      actionLabel="Practice more"
      actionHref={actionHref}
      variant="success"
      className={className}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2B1B0F]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      }
    />
  );
}

/**
 * 5. No search results
 */
export function NoSearchResultsNotice({
  term,
  onClear,
  className = "",
}: {
  term?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <StateNotice
      title={term ? `Nothing found for ${term}.` : "Nothing found."}
      description="Try checking for another NCERT topic."
      actionLabel={onClear ? "Clear search" : undefined}
      onAction={onClear}
      variant="default"
      className={className}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2B1B0F]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      }
    />
  );
}

/**
 * 6. Permission denied
 */
export function PermissionDeniedNotice({
  targetRole = "teachers",
  actionHref = "/",
  className = "",
}: {
  targetRole?: "teachers" | "students";
  actionHref?: string;
  className?: string;
}) {
  return (
    <StateNotice
      title={targetRole === "teachers" ? "Teachers only." : "Students only."}
      description={`This page is for ${targetRole}. Sign in with the right account to view this page.`}
      actionLabel="Go home"
      actionHref={actionHref}
      variant="locked"
      className={className}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2B1B0F]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <rect x="3" y="11" width="18" height="11" rx="0" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      }
    />
  );
}

/**
 * 7. Session expired
 */
export function SessionExpiredNotice({
  redirectPath,
  className = "",
}: {
  redirectPath?: string;
  className?: string;
}) {
  const loginHref = redirectPath
    ? `/login?redirect=${encodeURIComponent(redirectPath)}`
    : "/login";

  return (
    <StateNotice
      title="Session expired."
      description="You were signed out. Sign in to go back to your lesson."
      actionLabel="Sign in"
      actionHref={loginHref}
      variant="warning"
      className={className}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2B1B0F]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      }
    />
  );
}

/**
 * 8. Success confirmation block
 */
export function SuccessNotice({
  title = "Saved successfully.",
  description = "Your progress has been recorded.",
  actionLabel,
  onAction,
  actionHref,
  className = "",
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}) {
  return (
    <StateNotice
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
      actionHref={actionHref}
      variant="success"
      compact
      className={className}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2B1B0F]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      }
    />
  );
}

