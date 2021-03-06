![LOGO](https://github.com/JackBlakeston/BEETBOX/blob/main/client/src/assets/images/BEETBOX_LOGO.png)

# BEETBOX
Beetbox is a drum sequencer that you can run in your browser. 
With hundreds of samples available, all the user needs to do is log in, load some sounds and start making beets.

[Try BEETBOX!](https://beetbox.netlify.app/)

[Watch the video!](https://www.youtube.com/watch?v=e780VrMg_1k&ab_channel=JackBlakeston)

## Start

In client folder:
```bash
npm i
npm start
````

## Features

The sequencer allows for an indefinite ammount of tracks (although there can be performance issues on high track counts and low end machines).
Tracks are fully customizeable, you can add any sample from the library.
Global controls allow for the adjusting of tempo, grid size, and grid precision (how many pads represent one beat).
Every track has track controls that allow to set bank and sample, change volume and panning, and mute or solo the track.
Beets can be saved and accessed by their creators. Users have full access to their entire library of beets at any time.

## Tech stack

- React, Javascript, Tone.js, MUI
- Firebase authentication, firebase database, firebase storage

## Planned features

- Rework of audio triggering system.
- Audio effects for each track.
- Audio tracks that can record your audio input and loop it.
- Export beets.
- Tracks can be grabbed and moved. 
- Midi instruments.
- Zoom
- Track colors.

## Contribute

This project is actively looking for contributors who want to take BEETBOX to the next level. If you want to contribute, feel free to open a PR, or get in touch and we can discuss!
