# Quick Start Guide

## Setup Steps

1. **Run migrations** (from the core app):
   ```bash
   cd /home/ada/Sites/lifeautomation/core
   php artisan migrate
   ```

2. **Set up symlinks** (from events package):
   ```bash
   cd /home/ada/Sites/lifeautomation/events
   ./install.sh dev
   ```

3. **Rebuild frontend assets** (from core app):
   ```bash
   cd /home/ada/Sites/lifeautomation/core
   npm run build
   # or for development:
   npm run dev
   ```

4. **Restart your Docker containers** (if running in Docker):
   ```bash
   cd /home/ada/Sites/lifeautomation/core
   docker-compose restart
   ```

## Testing the Flow

### 1. Create an Event (Authenticated)

Navigate to: `http://localhost:8080/events/create`

Fill in:
- Title: "Weekend Hangout"
- Description: "Let's grab dinner!"
- Dates: Add 2-3 date options
- Locations: Add 2-3 venue options

You'll receive:
- **Public link**: `/event/abc123` (share this)
- **Admin link**: `/event/admin/xyz789` (keep secret)

### 2. Vote (No Login Required)

Open the **public link** in an incognito window or different browser:

**Step 1 - Date Selection:**
- Tap a date to select it (shows rank #1)
- Tap another to add it (shows rank #2)
- Tap the same date again to remove it
- Tap "Next: Choose Location"

**Step 2 - Location Selection:**
- Same tap interaction as dates
- Tap "Next: Your Name"

**Step 3 - Submit:**
- Enter your name
- Click "Submit Vote"
- See success confirmation

### 3. Repeat Voting

- Use the public link in another browser/incognito session
- Submit with a different name
- Test different ranking combinations

### 4. View Results (Admin)

Open the **admin link**:

You'll see:
- Vote counts
- Calculated scores for each option
- Top picks highlighted
- Individual participant votes
- Admin actions (Close/Delete)

## Key Features to Test

- [ ] Create event with multiple date/location options
- [ ] Vote without logging in
- [ ] Submit multiple votes with different rankings
- [ ] View admin dashboard with results
- [ ] Copy public voting link
- [ ] Close voting (try voting after - should show "Closed" page)
- [ ] Delete event
- [ ] Mobile responsiveness (resize browser)

## Troubleshooting

**500 Error when creating event:**
- Check migrations ran successfully
- Verify symlinks created correctly
- Check Laravel logs: `tail -f storage/logs/laravel.log`

**Components not rendering:**
- Rebuild frontend: `npm run build`
- Clear cache: `php artisan cache:clear`
- Check browser console for JS errors

**Votes not saving:**
- Check CSRF token is present in page
- Verify database tables exist
- Check network tab for API errors
