import type { Status } from '../lib/types'
import { STATUS_ICON, STATUS_LABEL } from '../lib/status'

interface Props {
  status: Status
  label?: string
  large?: boolean
}

export default function StatusBadge({ status, label, large }: Props) {
  return (
    <span className={`badge badge-${status}${large ? ' badge-lg' : ''}`}>
      <span aria-hidden>{STATUS_ICON[status] ?? ''}</span>
      {label ?? STATUS_LABEL[status] ?? status}
    </span>
  )
}
