# Auto Mute Tabs

Firefox extension. When a tab starts playing audio, every other audible tab
is muted.

## Configuration
Click the toolbar icon to open Settings. Add hostnames (e.g. `youtube.com`)
to exclude; subdomains are matched automatically.

## Behavior
- Triggered when a tab becomes audible, or is unmuted while playing.
- Tabs on excluded domains do not mute others when they start playing, but
  can still be muted when a non-excluded tab starts.
- Only tabs that are currently audible are muted.
