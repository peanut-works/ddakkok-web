export type Status = 'PASS' | 'WARN' | 'FAIL' | 'EXPIRED' | 'UNKNOWN'

export interface FacilityContext {
  id: number
  name: string
  facility_type: string
}

export interface ClassroomContext {
  id: number
  name: string
  age_group?: string | null
}

export interface UserContext {
  id: number
  email: string
  name: string
  role: string
  facility: FacilityContext
  classroom?: ClassroomContext | null
}

export interface AuthResponse {
  access_token: string
  token_type: string
  login_method: 'FACILITY' | 'EMAIL' | 'DEMO'
  user: UserContext
}

export interface Classroom {
  id: number
  facility_id: number
  name: string
  age_group?: string | null
}

export interface ChildListItem {
  id: number
  facility_id: number
  classroom_id: number
  name: string
  birth_date?: string | null
  gender?: string | null
  memo?: string | null
  is_active: boolean
}

export interface ChildHealthProfile {
  allergies: string[]
  skin_conditions: string[]
  sensitive_ingredients: string[]
  notes?: string | null
}

export interface ChildDetail extends ChildListItem {
  health_profile?: ChildHealthProfile | null
}

export interface SafetyCheckChildSummary {
  child_id: number
  child_name: string
  status: Status
  status_label: string
}

export interface SafetyCheckListItem {
  id: number
  product: { id: number; name: string; category: string }
  classroom_id?: number | null
  overall_status: Status
  pass_count: number
  warn_count: number
  fail_count: number
  expired_count: number
  unknown_count: number
  total_count: number
  children: SafetyCheckChildSummary[]
  created_at: string
}

export interface SafetyCheckProduct {
  id: number
  name: string
  category: string
  manufacturer?: string | null
  barcode?: string | null
  expiry_date?: string | null
  ingredients?: string[]
  normalized_ingredients?: string[]
}

export interface SafetyCheckDetailChildResult {
  child_id: number
  child_name: string
  status: Status
  status_label: string
  matched_ingredients?: string[]
  matched_rule_code?: string | null
  matched_profile?: string | null
  matched_ingredient?: string | null
  reason?: string | null
  teacher_sentence: string
  explanation?: string | null
}

export interface SafetyCheckDetail {
  id: number
  product: SafetyCheckProduct
  classroom_id: number
  summary: {
    overall_status: Status
    pass_count: number
    warn_count: number
    fail_count: number
    expired_count: number
    unknown_count: number
    total_count: number
  }
  results: SafetyCheckDetailChildResult[]
  overall_explanation?: string | null
}

export interface RecallAlert {
  id: number
  product_name: string
  manufacturer?: string | null
  category?: string | null
  recall_date: string
  reason: string
  action_guide?: string | null
  is_new: boolean
  severity: string
}

export interface ExpiryAlert {
  product_id: number
  product_name: string
  expiry_date: string
  alert_type: string
  message: string
  severity: string
}

export interface AttentionProduct {
  check_id: number
  product_id: number
  product_name: string
  overall_status: Status
  status_label: string
  summary: string
  children: SafetyCheckChildSummary[]
}

export interface DashboardSummary {
  recall_alerts: RecallAlert[]
  expiry_alerts: ExpiryAlert[]
  attention_products: AttentionProduct[]
}
