import { cn } from '@/lib/utils'
import type { CampaignStatus } from '@/lib/types'

const STATUS_STYLES: Record<CampaignStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
  RESEARCHING: 'bg-blue-50 text-blue-700 border-blue-200',
  STRATEGY_READY: 'bg-blue-50 text-blue-700 border-blue-200',
  BUILDING: 'bg-blue-50 text-blue-700 border-blue-200',
  QA: 'bg-amber-50 text-amber-800 border-amber-200',
  DEPLOYING: 'bg-amber-50 text-amber-800 border-amber-200',
  DEPLOYED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  READY_FOR_REVIEW: 'bg-violet-50 text-violet-700 border-violet-200',
  APPROVED: 'bg-violet-100 text-violet-800 border-violet-300',
  LIVE: 'bg-primary/10 text-primary border-primary/30',
  PAUSED: 'bg-gray-100 text-gray-600 border-gray-200',
  ARCHIVED: 'bg-gray-50 text-gray-400 border-gray-200',
  ERROR: 'bg-red-50 text-red-700 border-red-200',
}

const STATUS_LABELS: Record<CampaignStatus, string> = {
  DRAFT: 'Draft',
  RESEARCHING: 'Researching',
  STRATEGY_READY: 'Strategy ready',
  BUILDING: 'Building',
  QA: 'QA',
  DEPLOYING: 'Deploying',
  DEPLOYED: 'Deployed',
  READY_FOR_REVIEW: 'Ready for review',
  APPROVED: 'Approved',
  LIVE: 'Live',
  PAUSED: 'Paused',
  ARCHIVED: 'Archived',
  ERROR: 'Error',
}

export default function StatusBadge({ status, className }: { status: CampaignStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold font-display',
        STATUS_STYLES[status],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
