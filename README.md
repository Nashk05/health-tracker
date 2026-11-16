# Bloom Wellness — Health Tracker

This repository reconstructs the editable project from the HTML bundled inside the uploaded `app-debug.apk`; the APK itself is compiled and cannot be edited as source. The original page is preserved as `www/index.html` and restyled with a blush-pink / lavender floral theme.

## Included
- Original calories, diet chart, weekly meal plan, period calendar, reminders, and backup UI.
- Sticky in-app step ticker.
- Capacitor Android project scaffold.
- Android native step-counter plugin and foreground notification service.
- GitHub Actions workflow to build a debug APK.
- GitHub Pages workflow for the web version.

## Important notes
- A persistent Android notification is provided by the native foreground service. Android shows it as an ongoing notification in the notification shade / lock screen; Android does not guarantee arbitrary text permanently in the status-bar icon row.
- Step counts require a hardware step-counter sensor and the Android Physical Activity permission. Counts may reset or be affected by device reboot; test on the target phone.
- Period predictions and calorie estimates are informational only, not medical advice.
- User data is stored locally in the app/browser. Back up before uninstalling.

## Build Android APK on GitHub
1. Create a GitHub repository named `health-tracker`.
2. Upload **all files and folders** from this ZIP (not the ZIP itself).
3. Open **Actions** and enable workflows if GitHub asks.
4. Run **Build Android APK** (or push to `main`).
5. Open the completed workflow run, download the `health-tracker-debug-apk` artifact, unzip it, and install the APK on your Android phone.
6. Allow notifications and Physical activity when prompted. For Samsung, set the app battery use to Unrestricted if background tracking is stopped.

## GitHub Pages
Repository → Settings → Pages → Build and deployment → GitHub Actions. The workflow deploys `www/`.

## Local Android build
Requires Android Studio, Android SDK, JDK 17, and Node.js 20. Run:
```bash
npm install
npx cap sync android
cd android
gradle assembleDebug
```
The APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`.

## App identity
Application ID: `com.healthtracker.app`
Display name: Bloom Wellness
