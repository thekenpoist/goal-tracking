# goal-tracking
Goal Tracking &amp; Productivity App


Feature Expansion Plan: Goal Tracking
Goal
Enhance the TrailTracker app to support weekly goal tracking, auto-completion of goals, and summary views for completed goals. This expands the core functionality from goal creation into long-term habit-building and achievement analysis.


✅ Phase 2: Goal Status Logic
Auto-set isCompleted

If endDate < current date, the goal is automatically considered complete

Consider adding completedAt timestamp later if needed

Determine status on the fly

If isCompleted is true → status = completed

Else → status = active

✅ Phase 3: Updated Goal Detail Views
Active Goals (Right-hand Panel):
Title: "Active Goals"

Display:

Title, Category, Priority, Start/End Dates

Frequency (e.g. “3x/week”)

Duration (e.g. “30 minutes/session”)

Status (always “Active” for this view)

Last Achieved (wasAchievedAt)

If within the current week → ✅ "Goal achieved this week on [date]"

Else → ❌ "Weekly goal not yet achieved"

Completed Goals (Dashboard Card or Page):
Title: "Completed Goals"

Display:

Title

"Completed on [endDate]"

(Optional future link to legacy goal stats)

🔮 Phase 4 (Future Enhancements)
Add goal_logs table:

Track all goal activity with timestamps

Enable weekly stats, streaks, consistency analysis

Create completedAt field (optional):

Records when a goal transitioned from active → completed

Add legacy goal detail view for completed goals

Full summary with performance metrics