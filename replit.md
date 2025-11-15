# Overview

This is a Vietnamese Facebook Messenger bot built with Node.js that provides automated responses and interactive features. The bot uses the `@dongdev/fca-unofficial` library to interface with Facebook Messenger and implements a modular command system with categories including games, tools, and system utilities. It features automatic login via appstate or cookies, a dynamic menu system with media attachments, and admin-controlled functionality.

**Bot Configuration:**
- Prefix: `%`
- Admin ID: `61573986054035`
- Auto-login: Supports both `appstate.json` and `cookie.txt`

**Recent Changes (November 15, 2025):**
- Created complete bot structure from scratch
- Implemented menu module with interactive category selection via reply numbers
- Added media management system for menu (add/delete images and videos)
- Fixed message deletion bug in menu module (now properly deletes both menu and user reply)
- Added 9 modules across multiple categories (Hệ thống, Trò chơi, Công cụ)
- Configured workflow for bot execution
- Redesigned menu UI with cleaner layout using 〘〙➥ characters
- Removed media management instructions from main menu for cleaner appearance

# User Preferences

Preferred communication style: Simple, everyday language (Vietnamese).

# System Architecture

## Command Module System

The bot implements a plugin-based architecture where each command is a self-contained module:

- **Module Structure**: Each module exports a `config` object (name, version, author, cooldown, category, description, adminOnly flag) and a `run` function
- **Dynamic Loading**: Modules are loaded from the `/modules` directory at startup and cached in a Map data structure keyed by command name
- **Hot Reload Support**: Module cache is cleared before loading to support potential runtime updates
- **Categories**: Commands are organized into logical categories (Hệ thống/System, Trò chơi/Games, Công cụ/Tools)

**Rationale**: The modular approach allows easy extension of bot functionality without modifying core code. New commands can be added by simply creating new files in the modules directory.

## Authentication Flow

The bot supports two authentication methods with automatic fallback:

1. **Primary Method - Appstate**: Reads `appstate.json` containing Facebook session tokens
2. **Fallback Method - Cookie**: Reads raw cookies from `cookie.txt` if appstate is unavailable
3. **Session Persistence**: Automatically saves and updates appstate after successful login

**Rationale**: Appstate authentication is preferred as it's more reliable and doesn't require password storage. Cookie fallback provides flexibility for users who prefer that method.

## Message Handling & Command Execution

- **Prefix-Based Routing**: Commands are triggered by a configurable prefix (default: `%`)
- **Cooldown System**: Each command has an individual cooldown period to prevent spam
- **Reply-Based Interactions**: The menu system uses reply-based navigation where users reply with numbers to select categories
- **Pending State Management**: Uses a Map to track pending reply interactions with automatic cleanup

**Rationale**: Prefix-based commands provide clear separation between bot commands and normal conversation. Reply-based interactions create a more conversational UX for complex multi-step operations like menu navigation.

## Admin Authorization

- **Single Admin Model**: Configuration supports one admin ID stored in `data/config.json`
- **Command-Level Restrictions**: Modules can set `adminOnly: true` to restrict access
- **Media Management Permissions**: Only admin can add/remove media files for menu attachments

**Rationale**: Simple single-admin model is sufficient for personal/small group bots while keeping authorization logic straightforward.

## Media Attachment System

The menu command includes a media management system:

- **Storage**: Media URLs are stored in `data/menuMedia.json` with separate arrays for images and videos
- **Random Selection**: Menu displays randomly select from available media when showing categories
- **Admin Controls**: Commands like `addimage`, `addvideo`, `delimage`, `delvideo` for media management
- **Fallback**: System handles missing or empty media gracefully

**Rationale**: Adding visual elements to menus improves engagement. JSON storage keeps the system simple without requiring a database for this feature.

# External Dependencies

## Facebook Chat API
- **Library**: `@dongdev/fca-unofficial` (v2.0.32)
- **Purpose**: Unofficial Facebook Chat API for sending/receiving messages and managing bot sessions
- **Configuration**: `fca-config.json` enables auto-update, MQTT for real-time messaging, and auto-login features

## HTTP Client
- **Library**: `axios` (v1.13.2)
- **Purpose**: Making HTTP requests for external APIs (e.g., fetching Facebook avatars in the avatar module)
- **Usage**: Primarily used for retrieving profile pictures via Facebook Graph API

## File System & Path
- **Built-in Modules**: `fs` and `path` (Node.js core)
- **Purpose**: Reading/writing configuration files, loading modules dynamically, managing appstate and cookie files

## Data Storage
- **Method**: JSON file-based storage
- **Files**:
  - `data/config.json` - Bot configuration (prefix, admin ID, bot name)
  - `data/menuMedia.json` - Media URLs for menu attachments
  - `appstate.json` - Facebook session data
  - `cookie.txt` - Alternative authentication method
  
**Note**: No database is currently used. All persistent data is stored in JSON files. The system could be extended to use databases like SQLite or PostgreSQL for more complex data requirements (user profiles, statistics, game scores, etc.).

## Third-Party APIs
- **Facebook Graph API**: Used in the avatar module to fetch user profile pictures
- **Access Pattern**: Direct HTTP requests to `graph.facebook.com` endpoints with hardcoded access token