-- =============================================================================
-- Migration 0005: Add estimated_value to leads
-- =============================================================================

alter table leads
  add column if not exists estimated_value numeric default 0;
