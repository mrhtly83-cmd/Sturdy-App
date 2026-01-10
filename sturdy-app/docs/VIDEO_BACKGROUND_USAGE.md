# VideoBackground Component Usage

## Overview

The `VideoBackground` component is a reusable React Native component that provides a video background with gradient overlay, perfect for creating polished, professional onboarding and landing screens.

## Current Usage

### Onboarding Screen

The onboarding screen (`app/onboarding/index.tsx`) is already set up to use VideoBackground:

```typescript
import { VideoBackground } from '@/components/ui';

export default function OnboardingScreen() {
  return (
    <VideoBackground 
      videoSource={null} // Change this to add your video
      showMuteToggle={true}
    >
      {/* Your content here */}
    </VideoBackground>
  );
}
```

## Adding Your Video

### Step 1: Prepare Your Video

1. **Get or create a video** (see recommendations below)
2. **Optimize for mobile:**
   - Resolution: 1080p or 720p
   - Format: MP4 (H.264 codec)
   - File size: < 10MB
   - Duration: 10-30 seconds
3. **Name it:** `onboarding.mp4`

### Step 2: Add to Assets

Place your video file in:
```
sturdy-app/assets/videos/onboarding.mp4
```

### Step 3: Update the Code

In `app/onboarding/index.tsx`, change:

```typescript
// FROM:
<VideoBackground 
  videoSource={null}
  showMuteToggle={true}
>

// TO:
<VideoBackground 
  videoSource={require('@/assets/videos/onboarding.mp4')}
  showMuteToggle={true}
>
```

### Step 4: Restart Expo

```bash
cd sturdy-app
npm start
# Press 'r' to reload the app
```

## Component Props

```typescript
interface VideoBackgroundProps {
  videoSource: any | null;           // Video source or null for gradient only
  showMuteToggle?: boolean;          // Show mute button (default: true)
  gradientColors?: readonly string[]; // Overlay gradient (default: dark blue-gray)
  children?: React.ReactNode;        // Content to render on top
  fallbackGradient?: readonly string[]; // Fallback gradient if video fails
}
```

## Customization Examples

### Custom Gradient Overlay

```typescript
<VideoBackground 
  videoSource={require('@/assets/videos/onboarding.mp4')}
  gradientColors={[
    'rgba(0, 0, 0, 0.6)',     // Dark with transparency
    'rgba(0, 0, 0, 0.8)',     // Darker at bottom
  ]}
>
  {children}
</VideoBackground>
```

### No Mute Button

```typescript
<VideoBackground 
  videoSource={require('@/assets/videos/onboarding.mp4')}
  showMuteToggle={false}
>
  {children}
</VideoBackground>
```

### Custom Fallback

```typescript
<VideoBackground 
  videoSource={require('@/assets/videos/onboarding.mp4')}
  fallbackGradient={[
    '#1a1a2e',  // Dark purple
    '#16213e',  // Navy
  ]}
>
  {children}
</VideoBackground>
```

## Video Recommendations

### Free Stock Video Sources

1. **Pexels Videos** - https://www.pexels.com/videos/
2. **Pixabay** - https://pixabay.com/videos/
3. **Videvo** - https://www.videvo.net/
4. **Coverr** - https://coverr.co/

### Recommended Search Terms

- "peaceful background"
- "calm nature"
- "abstract motion"
- "soft gradient"
- "gentle movement"
- "parenting family"

### Optimization Tools

- **HandBrake** - Free video transcoder (desktop app)
- **FFmpeg** - Command-line video processing
- **Online tools:**
  - https://www.freeconvert.com/video-compressor
  - https://www.online-convert.com/

### Example FFmpeg Optimization

```bash
ffmpeg -i input.mp4 \
  -vf "scale=1080:-1" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  onboarding.mp4
```

This command:
- Scales to 1080p width
- Compresses with H.264
- Optimizes for streaming
- Keeps file size small

## Features

### Automatic

- ✅ Auto-play on screen mount
- ✅ Seamless looping
- ✅ Pause when screen loses focus (battery saving)
- ✅ Resume when screen gains focus
- ✅ Muted by default (better UX)

### Error Handling

- ✅ Shows loading spinner while video loads
- ✅ Gracefully falls back to gradient if:
  - Video file is missing
  - Video fails to load
  - videoSource is null
- ✅ Logs errors to console for debugging
- ✅ App continues to function normally

## Using in Other Screens

You can use VideoBackground in any screen:

```typescript
import { VideoBackground } from '@/components/ui';

export default function YourScreen() {
  return (
    <VideoBackground videoSource={require('@/assets/videos/your-video.mp4')}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Your screen content */}
      </SafeAreaView>
    </VideoBackground>
  );
}
```

## Troubleshooting

### Video not showing?

1. **Check file path:** Make sure video is at `assets/videos/onboarding.mp4`
2. **Check videoSource:** Should be `require('@/assets/videos/onboarding.mp4')`
3. **Restart Expo:** Assets need a fresh start sometimes
4. **Check console:** Look for error messages

### Performance issues?

1. **Compress video:** Should be < 10MB
2. **Lower resolution:** Try 720p instead of 1080p
3. **Reduce duration:** Shorter loops use less memory
4. **Check frame rate:** 30fps is sufficient

### Video quality poor?

1. **Use higher bitrate** during encoding
2. **Start with better source video**
3. **Use 1080p resolution**
4. **Avoid over-compression**

## Best Practices

1. **Keep it simple:** Subtle motion works best
2. **Test on device:** Performance differs from simulator
3. **Optimize file size:** Mobile users appreciate smaller downloads
4. **Consider accessibility:** Ensure text remains readable over video
5. **Provide fallback:** Always works without video

## Performance Metrics

- **Video load time:** < 2 seconds (on good connection)
- **Memory usage:** ~50-100MB for 10-30 second video
- **Battery impact:** Minimal (video pauses when screen not active)
- **File size target:** 5-10MB for best balance

## License & Attribution

If using stock videos, check licensing:
- **Pexels/Pixabay:** Free for commercial use, no attribution required
- **Others:** Check individual license terms
- **Custom videos:** Ensure you have rights to use

## Need Help?

- Check `assets/videos/README.md` for video specs
- Review `components/ui/VideoBackground.tsx` source code
- Test with gradient-only first (videoSource={null})
- Reach out if issues persist

---

**Remember:** The app works perfectly without video - it's an enhancement, not a requirement!
