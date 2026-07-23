export interface ReadingBlock {
  text: string;
  audioEvent?: 'whisperLeft' | 'whisperRight' | 'accelerateHeartbeat' | 'decelerateHeartbeat' | 'jumpscare' | 'none';
  bpm?: number;
}

export interface ReadingStory {
  id: string;
  title: string;
  description: string;
  bgImage: string;
  jumpscareImage?: string;
  blocks: ReadingBlock[];
}

export interface Choice {
  text: string;
  nextNodeId: string;
}

export interface InteractiveNode {
  id: string;
  text: string;
  bgImage: string;
  bpm: number;
  audioEvent?: 'whisperLeft' | 'whisperRight' | 'none';
  choices: Choice[];
  isJumpscare?: boolean;
  isEnding?: boolean;
  endingType?: 'death' | 'escape' | 'neutral';
  endingText?: string;
}

export interface InteractiveStory {
  id: string;
  title: string;
  description: string;
  bgImage: string;
  startNodeId: string;
  nodes: Record<string, InteractiveNode>;
}

// ----------------------------------------------------
// READING STORIES DATABASE
// ----------------------------------------------------
export const readingStories: ReadingStory[] = [
  {
    id: 'whispering-walls',
    title: 'The Whispering Walls',
    description: 'You awaken in a damp, decaying asylum. There is no door, only scratching noises behind the walls.',
    bgImage: '/assets/creepy_hallway.png',
    blocks: [
      {
        text: 'The concrete floor is cold beneath your bare skin. A single flickering light bulb hangs from the ceiling, casting dancing shadows.',
        audioEvent: 'none',
        bpm: 60,
      },
      {
        text: 'Then, you hear it. A quiet, rasping sound. Like fingernails scraping against dry plaster. Just behind the plaster wall to your left...',
        audioEvent: 'whisperLeft',
        bpm: 80,
      },
      {
        text: 'You press your ear against the damp wall. The scraping stops. In its place, a freezing wind seems to blow, and a dry voice whispers in your ear.',
        audioEvent: 'whisperLeft',
        bpm: 100,
      },
      {
        text: '"Do not turn around," the voice wheezes. "It has been watching you since the light began to flicker."',
        audioEvent: 'whisperRight',
        bpm: 120,
      },
      {
        text: 'A cold sweat breaks across your forehead. Your chest beats like a trapped bird. You cannot help it. You start to turn...',
        audioEvent: 'accelerateHeartbeat',
        bpm: 140,
      },
      {
        text: 'The light fixture overhead explodes. Pitch black darkness falls. And then—',
        audioEvent: 'jumpscare',
        bpm: 150,
      }
    ]
  },
  {
    id: 'solitary-cell',
    title: 'The Solitary Cell',
    description: 'A rusty chair sit in the center of the room. It was occupied, but by what?',
    bgImage: '/assets/asylum_room.png',
    blocks: [
      {
        text: 'In the center of the cracked tiled room stands a solitary metal chair, highlighted by a single surgical light. The metal is stained.',
        audioEvent: 'none',
        bpm: 60,
      },
      {
        text: 'You sit down, seeking rest. As soon as you settle, the chains hanging from the ceiling begin to sway and clatter, though there is no draft.',
        audioEvent: 'none',
        bpm: 80,
      },
      {
        text: 'A heavy sensation fills the room. The air grows freezing cold. You hear a low breathing from the shadows directly behind you.',
        audioEvent: 'whisperRight',
        bpm: 110,
      },
      {
        text: 'You try to stand, but your limbs feel heavy, paralyzed. The breathing moves closer, brushing the hairs on the back of your neck.',
        audioEvent: 'accelerateHeartbeat',
        bpm: 130,
      },
      {
        text: 'A cold, wet hand grips your shoulder. You look down, and see fingers decaying right before your eyes. You open your mouth to scream, but no sound comes out...',
        audioEvent: 'jumpscare',
        bpm: 150,
      }
    ]
  },
  {
    id: 'aakhri-photo',
    title: 'Aakhri Photo',
    description: 'Ek maasoom baccha aur uske naye mobile phone ki ek aisi tasveer jo kabhi nahi khinchani chahiye thi...',
    bgImage: '/assets/aakhri_photo_bg.png',
    jumpscareImage: '/assets/horrifying_jumpscare_face.png',
    blocks: [
      {
        text: 'Ek aurat thi jiska ek 6 saal ka beta tha. Ek din, usne ek naya mobile phone khareeda. Jab woh kaam se ghar waapas aayi, toh woh raat ka khana banane lagi aur apna phone kitchen ke table par rakh diya.',
        audioEvent: 'none',
        bpm: 60,
      },
      {
        text: 'Uska beta kitchen mein aaya aur usne phone dekha. Usne apni mummy se pucha ki kya woh phone se khel sakta hai? Mummy ne bol diya ki haan khel sakte ho, bas shart yeh hai ki kisi ko call mat karna aur koi text message delete mat karna.',
        audioEvent: 'none',
        bpm: 70,
      },
      {
        text: 'Obviously, ladka maan gaya aur phone lekar apne kamre mein khelne chala gaya. Raat ko karib 10 baje, jab woh apne bete ko sone ke liye dekhne upar gayi, toh usne dekha ki woh apne bed par geheri neend mein so raha tha.',
        audioEvent: 'none',
        bpm: 80,
      },
      {
        text: 'Naya cell phone bed ke paas zameen par pada hua tha. Usne phone uthaya aur settings check karne lagi taaki yeh confirm kar sake ki bete ne kuch delete toh nahi kiya.',
        audioEvent: 'none',
        bpm: 90,
      },
      {
        text: 'Usne dekha ki kuch chote-mote changes hue the. Beta phone ka theme, background change kar chuka tha aur ek naya ringtone bhi laga diya tha.',
        audioEvent: 'none',
        bpm: 100,
      },
      {
        text: 'Phir usne notice kiya ki uske bete ne cell phone se kuch photos bhi khinchi hain. Usne gallery folder khola aur photos dekhne lagi. "Kitna cute hai," usne socha. Beta apni hi photos khinch raha tha.',
        audioEvent: 'whisperLeft',
        bpm: 110,
      },
      {
        text: 'Lekin phir uske samne folder ki aakhri photo aayi. Jab usne pehli baar woh photo dekhi, toh usey apni aankhon par yakeen hi nahi hua. Kya uski aankhen usey dhokha de rahi thi?',
        audioEvent: 'whisperRight',
        bpm: 125,
      },
      {
        text: 'Woh uske bete ki hi photo thi, jo bed par so raha tha. Lekin sabse khaufnaak baat yeh thi ki photo ke ekdum left corner mein koi aur dikh raha tha...',
        audioEvent: 'accelerateHeartbeat',
        bpm: 140,
      },
      {
        text: 'Matlab... kisi aur ne uske bete ki woh photo khinchi thi... jab woh so raha tha. Aur tabhi, aapke peeche se ek dabi hui hansi sunai deti hai...',
        audioEvent: 'jumpscare',
        bpm: 155,
      }
    ]
  }
];

// ----------------------------------------------------
// INTERACTIVE STORIES DATABASE
// ----------------------------------------------------
export const interactiveStories: InteractiveStory[] = [
  {
    id: 'red-door',
    title: 'The Red Room',
    description: 'Locked in a basement with two ways out: a rusted iron door glowing red, or a dark trapdoor leading into the earth.',
    bgImage: '/assets/creepy_door.png',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        text: 'You wake up in a windowless room. The smell of copper and rot hangs heavy. In front of you is a heavy rusted iron door, a dim red glow leaking from its barred window. Beneath your feet is a wooden trapdoor, bolted shut but slightly rotting.',
        bgImage: '/assets/creepy_door.png',
        bpm: 60,
        choices: [
          { text: 'Try to open the Rusted Red Door', nextNodeId: 'red_door_open' },
          { text: 'Pry open the Wooden Trapdoor', nextNodeId: 'trapdoor_open' }
        ]
      },
      red_door_open: {
        id: 'red_door_open',
        text: 'The heavy iron door screeches open. It leads into a long, pitch-black hallway. The red glow fades behind you. From the darkness ahead, you hear the wet sloshing sound of rapid footsteps running towards you.',
        bgImage: '/assets/creepy_hallway.png',
        bpm: 95,
        choices: [
          { text: 'Sprint back into the room and lock the door', nextNodeId: 'lock_room' },
          { text: 'Run forward into the darkness, hoping to dodge it', nextNodeId: 'jumpscare_hallway' }
        ]
      },
      trapdoor_open: {
        id: 'trapdoor_open',
        text: 'You break the rotten wood. A dark ladder goes down. You climb down into a wet, stone cellar. It is completely pitch black. As you reach the bottom, you feel something cold and slimy brush against your ankle.',
        bgImage: '/assets/asylum_room.png', // Fallback room representation
        bpm: 100,
        audioEvent: 'whisperLeft',
        choices: [
          { text: 'Freeze and stand perfectly quiet', nextNodeId: 'stay_still' },
          { text: 'Stumble backward in panic', nextNodeId: 'jumpscare_cellar' }
        ]
      },
      lock_room: {
        id: 'lock_room',
        text: 'You slam the door shut and slide the bolt just in time. Something heavy thuds violently against the iron door, shaking the walls. Silence follows. Then, a low scratch starts on the floorboards directly beneath your feet...',
        bgImage: '/assets/creepy_door.png',
        bpm: 110,
        choices: [
          { text: 'Look through the keyhole to see what is outside', nextNodeId: 'jumpscare_keyhole' },
          { text: 'Pry open the trapdoor now as a last resort', nextNodeId: 'trapdoor_open' }
        ]
      },
      stay_still: {
        id: 'stay_still',
        text: 'You freeze. Your heart beats in your ears. The slimy presence crawls away. As your eyes adjust to the darkness, you spot a tiny crack of green moonlight coming from a cellar window high up.',
        bgImage: '/assets/asylum_room.png',
        bpm: 80,
        choices: [
          { text: 'Climb toward the window and break the glass', nextNodeId: 'escape_window' },
          { text: 'Explore the cellar shadows for tools', nextNodeId: 'jumpscare_cellar' }
        ]
      },

      // Endings & Jumpscares
      jumpscare_hallway: {
        id: 'jumpscare_hallway',
        text: 'You run headfirst into the corridor. The footsteps stop. You feel a freezing breath in front of your face...',
        bgImage: '/assets/creepy_hallway.png',
        bpm: 140,
        isJumpscare: true,
        choices: [],
        isEnding: true,
        endingType: 'death',
        endingText: 'The thing in the hallway claimed you. Your body was never found.'
      },
      jumpscare_cellar: {
        id: 'jumpscare_cellar',
        text: 'You scream and back away, tripping. The slimy creature surges forward in the dark...',
        bgImage: '/assets/asylum_room.png',
        bpm: 145,
        isJumpscare: true,
        choices: [],
        isEnding: true,
        endingType: 'death',
        endingText: 'Dragged down into the wet soil beneath the cellar. You suffocated in the dark.'
      },
      jumpscare_keyhole: {
        id: 'jumpscare_keyhole',
        text: 'You squint through the tiny keyhole. All you see is pitch black. Suddenly, an eye opens on the other side, staring directly into yours...',
        bgImage: '/assets/creepy_door.png',
        bpm: 145,
        isJumpscare: true,
        choices: [],
        isEnding: true,
        endingType: 'death',
        endingText: 'It saw you.'
      },
      escape_window: {
        id: 'escape_window',
        text: 'You pull yourself up, shattering the glass. You crawl out onto the wet grass of a forest. The cold wind hits your face, but you are free. You run and never look back.',
        bgImage: '/assets/forest_landing.png',
        bpm: 60,
        choices: [],
        isEnding: true,
        endingType: 'escape',
        endingText: 'You escaped the Red Room. But the whispers in your head will never leave.'
      }
    }
  },
  {
    id: 'haunted-woods',
    title: 'The Whispering Woods',
    description: 'Lost in a foggy forest at night. A narrow dirt path stretches ahead, but shadows move between the trees.',
    bgImage: '/assets/forest_landing.png',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        text: 'A thick fog rolls in, turning the trees into menacing silhouettes. You stand on a narrow dirt path. To your right, you see a flickering cabin light in the distance. Ahead, the path sinks into a deep ravine.',
        bgImage: '/assets/forest_landing.png',
        bpm: 60,
        choices: [
          { text: 'Walk toward the cabin light', nextNodeId: 'cabin_path' },
          { text: 'Follow the dirt path into the ravine', nextNodeId: 'ravine_path' }
        ]
      },
      cabin_path: {
        id: 'cabin_path',
        text: 'You approach the cabin. The porch light is flickering rapidly. The front door is slightly ajar, creaking back and forth. You hear a music box playing a warped lullaby from within.',
        bgImage: '/assets/asylum_room.png', // representing inside cabin
        bpm: 85,
        choices: [
          { text: 'Enter the cabin to seek shelter', nextNodeId: 'enter_cabin' },
          { text: 'Turn back and go down the ravine', nextNodeId: 'ravine_path' }
        ]
      },
      ravine_path: {
        id: 'ravine_path',
        text: 'You walk down the ravine. The trees close in above, blocking out what little light remains. A sudden whispering starts from the branches on both sides of you.',
        bgImage: '/assets/forest_landing.png',
        bpm: 100,
        audioEvent: 'whisperRight',
        choices: [
          { text: 'Run as fast as you can through the path', nextNodeId: 'jumpscare_woods' },
          { text: 'Shut your eyes and cover your ears', nextNodeId: 'cover_ears' }
        ]
      },
      enter_cabin: {
        id: 'enter_cabin',
        text: 'The floorboards groan. Inside, a single rocking chair sways by itself in front of a dying fireplace. The music box stops. The door slams shut behind you, and the lock clicks.',
        bgImage: '/assets/asylum_room.png',
        bpm: 115,
        choices: [
          { text: 'Search the drawers for a key', nextNodeId: 'jumpscare_cabin' },
          { text: 'Break the window and jump out', nextNodeId: 'escape_woods' }
        ]
      },
      cover_ears: {
        id: 'cover_ears',
        text: 'You drop to your knees, closing your eyes and pressing your hands against your ears. The whispers grow into deafening screams. You feel cold fingers wrap around your wrists, pulling them away...',
        bgImage: '/assets/forest_landing.png',
        bpm: 130,
        isJumpscare: true,
        choices: [],
        isEnding: true,
        endingType: 'death',
        endingText: 'Taken by the forest spirits. You became part of the woods.'
      },

      // Jumpscares & Endings
      jumpscare_woods: {
        id: 'jumpscare_woods',
        text: 'You trip on a thick root and fall. As you look up, a floating figure with hollow eyes dives down from the trees...',
        bgImage: '/assets/forest_landing.png',
        bpm: 145,
        isJumpscare: true,
        choices: [],
        isEnding: true,
        endingType: 'death',
        endingText: 'The woods claimed another soul.'
      },
      jumpscare_cabin: {
        id: 'jumpscare_cabin',
        text: 'You open a dusty drawer. Inside is a heart, still beating. The closet behind you flies open...',
        bgImage: '/assets/asylum_room.png',
        bpm: 145,
        isJumpscare: true,
        choices: [],
        isEnding: true,
        endingType: 'death',
        endingText: 'You should not have snooped around.'
      },
      escape_woods: {
        id: 'escape_woods',
        text: 'You crash through the glass, rolling onto the forest floor. Bleeding but alive, you spot a highway in the distance. Headlights approach. You run out, waving, and are rescued.',
        bgImage: '/assets/forest_landing.png',
        bpm: 60,
        choices: [],
        isEnding: true,
        endingType: 'escape',
        endingText: 'You escaped the forest alive. But every time you hear a wind rustle, you shudder.'
      }
    }
  }
];
