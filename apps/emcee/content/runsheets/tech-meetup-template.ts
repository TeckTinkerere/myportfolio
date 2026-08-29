import type { RunSheetInput } from '@/lib/schema'

/**
 * A reusable shape for the room this site's event record is mostly made of:
 * a two-hour evening technology meetup with two talks and a demo slot.
 *
 * It is a template, not a claim. `sheetType: 'template'` is what keeps it
 * from reading as "this event happened on this date" — it names no
 * organiser, no venue, no speakers and no date, because it is the structure
 * that gets copied and filled in, not a record of an evening.
 *
 * Durations are the part to change per event. The transitions are the part
 * worth keeping: they are where a room's energy is won or lost, and they are
 * the same regardless of who is speaking.
 */
export const techMeetupTemplate: RunSheetInput = {
  slug: 'tech-meetup-template',
  title: 'Evening tech meetup — host run sheet',
  sheetType: 'template',
  summary:
    'The standard shape for a two-hour evening meetup with two talks and a demo slot. Copy it, change the durations, keep the transitions.',
  startTime: '18:30',
  callTime: '17:45',
  doorsOpen: '18:30',

  hostBrief: [
    'Get the organiser’s final running order in your hand before doors. It will have changed since the version you were sent.',
    'Test the microphone you will actually use, standing where you will actually stand.',
    'Write every name you have to say phonetically, and check each one with the person before they go on.',
    'Agree a hand signal with the AV desk for “we are running long” before you need it.',
    'Know who makes the call if a speaker does not arrive, and know it is not you.',
  ],

  segments: [
    {
      id: 'doors-and-registration',
      title: 'Doors, registration and settling',
      kind: 'admin',
      durationMinutes: 30,
      notes: [
        'Confirm with the organiser that the running order below is still the running order.',
        'Confirm each speaker is in the room, and confirm how they want to be introduced.',
        'Stand near the door rather than backstage — the room warms up faster if someone is talking to it.',
      ],
      techCues: [
        'House music on, holding slide up.',
        'Handheld mic tested and muted, spare battery within reach.',
      ],
      handoff:
        'Two-minute call over the mic, let people find seats, then walk on. Do not start into a half-seated room.',
    },
    {
      id: 'welcome-and-housekeeping',
      title: 'Welcome and housekeeping',
      kind: 'opening',
      durationMinutes: 6,
      cue: 'Good evening, and welcome. I’ll be your host tonight — here’s what the next two hours look like.',
      notes: [
        'Fire exits, toilets and the wifi in one breath. It is housekeeping, not a segment.',
        'Name the sponsor once and say it properly. Repeating it does not help them.',
        'Set the expectation for questions now — held to the end, or taken throughout — so nobody has to guess later.',
      ],
      handoff:
        'Introduce the first talk by what the audience will get from it, not by reading a biography. Then hand over the mic and get out of the light.',
    },
    {
      id: 'first-talk',
      title: 'First talk, with questions',
      kind: 'talk',
      durationMinutes: 30,
      notes: [
        'Start the clock when they take the mic, not when the slides appear.',
        'Five-minute and one-minute signals from the side, agreed with them beforehand.',
        'Be back at the front before questions open, so the first question goes through you and not to the loudest person in the room.',
      ],
      techCues: ['Speaker’s deck up.', 'Roving mic ready for questions.'],
      handoff:
        'Thank them by name, repeat the single most useful thing they said, then call the break with a hard return time and point at where the food is.',
    },
    {
      id: 'break-and-networking',
      title: 'Break and networking',
      kind: 'break',
      durationMinutes: 20,
      notes: [
        'Announce the return time twice: once at the start of the break and once two minutes before.',
        'Use the break to check in with the second speaker. This is the last quiet moment there will be.',
      ],
      techCues: ['House music back on, holding slide with the return time on it.'],
      handoff:
        'Bring the room back with volume, not with a plea. Start on time even if a third of the room is still standing — they sit down when you start.',
    },
    {
      id: 'second-talk',
      title: 'Second talk, with questions',
      kind: 'talk',
      durationMinutes: 30,
      notes: [
        'The room is fuller and slower after the break. Give it one line of re-orientation before introducing the speaker.',
        'If the evening is running long, this is where you take the time back — shorten questions, never the talk.',
      ],
      techCues: ['Speaker’s deck up.', 'Roving mic ready for questions.'],
      handoff:
        'Thank them, then set up the demos as something quick and informal so nobody expects a third keynote.',
    },
    {
      id: 'lightning-demos',
      title: 'Lightning demos',
      kind: 'demo',
      durationMinutes: 15,
      notes: [
        'Hard time limit per demo, stated out loud before the first one starts.',
        'Have the order written down. Asking “who’s next?” from the front loses the room every time.',
        'Assume at least one demo will not work. Have the next name ready so the silence is two seconds, not twenty.',
      ],
      techCues: ['Confirm laptop switching or screen sharing works before the segment, not during it.'],
      handoff:
        'Close the demos on the last working one if you can. Then go straight into thanks — do not let the evening trail off.',
    },
    {
      id: 'closing-and-thanks',
      title: 'Closing and thanks',
      kind: 'closing',
      durationMinutes: 7,
      cue: 'That’s the programme for tonight — before you go, a few thank-yous and one thing to take with you.',
      notes: [
        'Thank the speakers, the organisers and the venue, in that order, by name.',
        'Give one clear next action: the feedback form, or the next event date. One, not three.',
        'Say explicitly that the room stays open for networking, and for how long, or people leave immediately.',
      ],
      handoff: 'House lights up, music on, and stay on the floor for the first fifteen minutes.',
    },
  ],

  announcements: [
    {
      label: 'Photography and recording',
      text: 'Say at the top that the event is being photographed or recorded, and where someone should stand or who they should speak to if they would rather not be. Consent announced once, early, in plain words.',
      segmentId: 'welcome-and-housekeeping',
    },
    {
      label: 'Sponsor thank-you',
      text: 'One clear mention of who made the evening possible, with the specific thing they provided rather than a slogan.',
      segmentId: 'welcome-and-housekeeping',
    },
    {
      label: 'Feedback and next event',
      text: 'The single call to action for the night. Give the QR or the short link and read it out once, slowly.',
      segmentId: 'closing-and-thanks',
    },
  ],

  visibility: 'public',
  permissionStatus: 'not-required',
}
