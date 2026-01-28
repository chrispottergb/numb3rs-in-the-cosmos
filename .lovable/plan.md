
## Capacitor iOS Setup Implementation

### Step 1: Install Capacitor Dependencies
Add the following packages to the project:
- `@capacitor/core` - Core runtime
- `@capacitor/cli` - Command line tools (dev dependency)
- `@capacitor/ios` - iOS platform support
- `@capacitor/android` - Android platform support (for future use)

### Step 2: Create Capacitor Configuration
Create `capacitor.config.ts` in the project root with:
- **appId**: `app.lovable.25abfcf66b104783ba1bf16b1610a1ce`
- **appName**: `numb3rs-in-the-cosmos`
- **webDir**: `dist` (Vite's build output directory)
- **Server URL**: `https://25abfcf6-6b10-4783-ba1b-f16b1610a1ce.lovableproject.com?forceHideBadge=true` (enables hot-reload during development)

### Step 3: Document iOS Background Audio Configuration
Create a `CAPACITOR_IOS_SETUP.md` file with detailed instructions for:
- Xcode project configuration
- Enabling Background Modes capability
- Configuring `AppDelegate.swift` for AVAudioSession
- Updating `Info.plist` for background audio

### Post-Implementation: Manual Steps on Your Mac
After the implementation, you will need to:
1. Export to GitHub and clone the repository locally
2. Run `npm install` to install all dependencies
3. Run `npx cap add ios` to add the iOS platform
4. Run `npx cap update ios` to update native dependencies
5. Run `npm run build` to build the web app
6. Run `npx cap sync` to sync web assets to native
7. Run `npx cap open ios` to open in Xcode
8. In Xcode: Configure signing, enable background audio capability, and add AVAudioSession setup to AppDelegate.swift
