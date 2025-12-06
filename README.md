# Events Package

## About This Package

A lightweight, no-login event planning and voting system designed for small friend groups (1-9 people). This package helps coordinate hangouts by letting participants vote on date/time and venue/activity options without the friction of account creation or authentication.

This package is not intended for commercial use. It was built for personal use and is made public in case others find it helpful.

## Features

- **No Authentication Required**: Voters don't need accounts - just a name
- **Simple 3-Step Voting Flow**:
  1. Select/rank preferred dates and times
  2. Select/rank preferred venues/activities
  3. Enter your name and submit
- **Dual URL System**:
  - Public voting link for participants
  - Secret admin link for event management
- **Smart Ranking System**: Calculates optimal event based on ranked preferences
- **Mobile-First Design**: Tap-focused, minimal typing interface
- **Real-Time Results**: Admin view shows live vote tallies and rankings

## Installation

To add this package to your Laravel project, update your `composer.json` by adding one of the following repository configurations:

### Using Live Repository
```sh
composer config repositories.0 '{"type": "vcs", "url": "https://github.com/nickklein/events"}'
```

### Using Local Path
For local development, use:
```sh
composer config repositories.0 '{"type": "path", "url": "../events", "options": {"symlink": true}}'
```

### Install the Package
```sh
composer require nickklein/events
```

## Setup

1. Run the migrations:
   ```sh
   php artisan migrate
   ```

2. Execute the installation script to create a symlink for JSX files:
   ```sh
   ./install.sh dev
   ```

This will link the `events` JSX files to your core Laravel project.

## Usage

### Creating an Event

1. Navigate to `/events` (requires authentication)
2. Click "Create Event"
3. Fill in:
   - Event title and description
   - Multiple date/time options
   - Multiple location/venue options
   - Optional voting deadline
4. Submit to receive:
   - **Public voting link**: Share with participants
   - **Admin link**: Keep secret for managing the event

### Voting Process

Participants receive the public link and:
1. **Step 1**: Tap to select/rank date options (1st, 2nd, 3rd choice)
2. **Step 2**: Tap to select/rank location options
3. **Step 3**: Enter their name and submit

Votes are only recorded upon final submission with a name.

### Admin Features

Via the secret admin link, you can:
- View real-time vote rankings
- See the top-scoring date and location
- View individual participant votes
- Copy public voting link
- Close voting
- Delete the event

### Scoring System

The ranking algorithm uses a simple point-based system:
- 1st choice = 9 points
- 2nd choice = 8 points
- 3rd choice = 7 points
- etc.

The options with the highest total scores are recommended.

## API Routes

### Public Routes (No Auth)
- `GET /event/{hash}` - View voting page
- `POST /event/{hash}/vote` - Submit vote
- `GET /event/admin/{adminHash}` - View admin dashboard
- `POST /event/admin/{adminHash}/close` - Close voting
- `DELETE /event/admin/{adminHash}` - Delete event

### Authenticated Routes
- `GET /events` - List all events
- `GET /events/create` - Create event form
- `POST /events` - Store new event

## Database Schema

- **events**: Event details, hash, admin_hash
- **event_dates**: Date/time options for each event
- **event_locations**: Venue/activity options for each event
- **event_participants**: Voter names
- **event_date_votes**: Date rankings by participant
- **event_location_votes**: Location rankings by participant

## React Components

- `Vote.jsx` - 3-step voting flow
- `Admin.jsx` - Admin dashboard with results
- `Create.jsx` - Event creation form
- `Index.jsx` - Event list
- `Closed.jsx` - Closed event message
