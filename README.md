# Twitch rally extension
A simple extension that fetches and shows realtime rally.io CreatorCoin prices. 


## Requirements
- A [Twitch Extension](https://dev.twitch.tv/console/extensions)
- This extension uses twitch `Extension Configuration Service` to save broadcaster configs.


## Installation 
1. Create a new [extension](https://dev.twitch.tv/console/extensions/create). 
2. Upload this file as zip in `Files` tab.
3. In the `Asset hosting` tab set `Panel Viewer Path` to `src/panel.html` and `Config Path` to `src/config.html` respectfully.
4. In the `Capabilities` tab under `Select how you will configure your extension` select `Extension Configuration Service` option.
5. In the same tab, set `Broadcaster Writable Channel Segment Version` value to `1`.

## LICENSE
See [LICENSE](LICENSE)