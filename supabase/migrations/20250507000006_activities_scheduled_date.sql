-- =============================================================================
-- Migration 0006: Add scheduled_date to activities
-- =============================================================================

alter table activities
  add column if not exists scheduled_date date;
