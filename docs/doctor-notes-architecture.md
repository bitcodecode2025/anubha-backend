Doctor Notes Architecture Rules:

1. Each section is an independent UI + API unit
2. No section directly mutates another section’s data
3. Attachments are handled outside form save
4. React Hook Form is the single source of form state
5. Sections mount only when toggled or scrolled
6. Saving is chunked per section
7. Partial save is allowed
