# User Queries Storage

This directory stores user queries submitted through the contact form.

## File Structure

- `queries.json` - Contains all user queries in JSON format

## Accessing Queries

### Option 1: View via Admin Page
Visit `/admin/queries` in your browser to view all queries in a user-friendly interface.

### Option 2: View JSON File Directly
Open `data/queries.json` to see all queries in raw JSON format.

## Query Format

Each query contains:
- `id` - Unique identifier (timestamp)
- `name` - User's name
- `email` - User's email address
- `message` - User's message
- `timestamp` - ISO timestamp of submission
- `status` - Query status (`new` or `read`)

## Notes

- The file is automatically created when the first query is submitted
- Only the last 1000 queries are kept to prevent the file from growing too large
- The file is excluded from git (see `.gitignore`)
- Queries are stored in reverse chronological order (newest first)

