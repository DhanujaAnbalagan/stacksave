# Metrics & Performance — StackSave

## 1. North Star Metric
**Total Identified Annual Savings (TIAS)**. 
We measure the cumulative dollar amount of savings we've identified for all users. This represents the "Gross Value Added" of the platform and directly correlates with the potential volume of credits Credex can facilitate.

## 2. Input Metrics
- **Audits-to-Lead Conversion Rate**: The percentage of users who complete an audit and then submit the lead capture form.
- **Audit Tool Density**: The average number of tools per audit. Higher density usually means more complex (and high-value) consolidation opportunities.
- **Consultation Booking Rate**: The percentage of "High Savings" users (> $500/mo) who click the "Book Consultation" CTA.

## 3. Initial Instrumentation
I would first instrument the **Audit Completion Funnel**:
1. Land on Home
2. Click "Run Audit"
3. Add First Tool
4. Select Team Size
5. View Results
6. Click "Save Report"

Identifying where users "drop off" (e.g., if adding the second tool is too high friction) is critical for the viral loop.

## 4. Pivot Trigger
If the **Audit-to-Lead Conversion Rate** stays below **5%** for more than 500 unique audits, it's time to pivot. 

**What would the pivot look like?**
A low lead conversion usually means:
- The savings aren't "painful" enough to warrant a consultation.
- The user doesn't trust the engine's numbers.

The pivot would move from a "Self-Service Audit" to an **"Expert-Led Concierge Audit,"** where the tool becomes a lead-capture landing page for a manual service, rather than an instant results dashboard.
