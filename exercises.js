// exercises.js
// Trainers/editors: you can update exercise names, levels, descriptions,
// sets, reps, and durationSeconds here. Keep the overall structure the same.

window.FIFA11_EXERCISES = [
  // ---------- PART 1: RUNNING ----------
  {
    id: "1",
    part: "Part 1 – Running exercises",
    name: "Running – Straight ahead",
    sequenceIndex: 1,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "2 × out-and-back over the cone line",
        recommendation: "Gradually increase running speed as players warm up.",
        description:
          "Jog in a straight line from the first to the last cone, then return at a slightly higher pace. " +
          "Keep the trunk upright and relaxed, and line up hips, knees and feet so the knees don’t drift inward."
      }
    ]
  },
  {
    id: "2",
    part: "Part 1 – Running exercises",
    name: "Running – Hip out",
    sequenceIndex: 2,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "2 passes along the cone line",
        recommendation: "Focus on controlled hip rotation rather than speed.",
        description:
          "Jog to the first cone, stop, lift one knee forward, then rotate the hip so the knee moves outward before stepping down. " +
          "Move to the next cone and repeat on the other leg. Keep the pelvis level and make sure the supporting leg stays stacked from hip to foot."
      }
    ]
  },
  {
    id: "3",
    part: "Part 1 – Running exercises",
    name: "Running – Hip in",
    sequenceIndex: 3,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "2 passes along the cone line",
        recommendation: "Encourage smooth, big hip movement without losing balance.",
        description:
          "Jog to the first cone, stop, lift one knee out to the side, then rotate the hip so the knee comes forward before stepping down. " +
          "Move to the next cone and switch legs. Maintain a quiet core and keep the supporting knee in line with the foot."
      }
    ]
  },
  {
    id: "4",
    part: "Part 1 – Running exercises",
    name: "Running – Circling partner",
    sequenceIndex: 4,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "2 passes with your partner",
        recommendation: "Have pairs coordinate tempo and stay light on their feet.",
        description:
          "Jog forward to the first cone, then shuffle sideways to meet your partner halfway. " +
          "Circle all the way around each other while facing the same direction, then shuffle back to the cone and move on to the next one. " +
          "Stay soft at the knees and hips and keep movements quick but controlled."
      }
    ]
  },
  {
    id: "5",
    part: "Part 1 – Running exercises",
    name: "Running – Jumping with shoulder contact",
    sequenceIndex: 5,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 jumps between each cone pair",
        recommendation: "Keep impacts gentle and landings quiet and balanced.",
        description:
          "Jog to the first cone, then shuffle sideways toward your partner. In the middle, both players jump sideways toward each other and gently touch shoulders. " +
          "Land softly with bent hips and knees, then shuffle back to the cone and move on. Emphasize landing on both feet with knees over toes."
      }
    ]
  },
  {
    id: "6",
    part: "Part 1 – Running exercises",
    name: "Running – Quick forwards and backwards",
    sequenceIndex: 6,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "1–2 full progressions along the line",
        recommendation: "Build pace gradually; quality of acceleration and deceleration matters most.",
        description:
          "Sprint forward to the second cone, then move quickly backwards to the first cone. " +
          "Next run two cones forward and one back, then three forward and two back, and so on. " +
          "Keep the trunk controlled, stay slightly flexed at the hips and knees, and avoid leaning too far backwards when moving in reverse."
      }
    ]
  },

  // ---------- PART 2: STRENGTH / PLYOMETRICS / BALANCE ----------
  {
    id: "7",
    part: "Part 2 – Strength / Core stability",
    name: "The bench (front plank)",
    sequenceIndex: 7,
    levels: [
      {
        label: "Level 1 – Static bench",
        sets: 3,
        durationSeconds: 30,
        reps: "3 × 20–30 s holds",
        recommendation: "Increase hold time only while a straight line and steady core are maintained.",
        description:
          "Lie face down and support yourself on your forearms and toes. " +
          "Lift hips so your body forms a straight line from head to heels and brace abdominals and glutes. " +
          "Hold the position without letting the lower back sag or hips rise."
      },
      {
        label: "Level 2 – Bench with alternate leg lifts",
        sets: 3,
        durationSeconds: 60,
        reps: "3 × 40–60 s (alternating legs)",
        recommendation: "Keep the pelvis steady; only the legs should move.",
        description:
          "From a strong plank, lift one leg a short distance off the ground, pause, then lower it and lift the other leg in rhythm. " +
          "Continue alternating while keeping the trunk and pelvis stable."
      },
      {
        label: "Level 3 – Bench with single-leg hold",
        sets: 3,
        durationSeconds: 30,
        reps: "3 × 20–30 s per leg",
        recommendation: "Use this once players can easily control Levels 1 and 2.",
        description:
          "Hold a solid plank and raise one leg about 10–15 cm off the ground, keeping the whole body straight. " +
          "Maintain a level pelvis without twisting or dropping before switching legs."
      }
    ]
  },

  {
    id: "8",
    part: "Part 2 – Strength / Lateral core",
    name: "Sideways bench (side plank)",
    sequenceIndex: 8,
    levels: [
      {
        label: "Level 1 – Side bench, static",
        sets: 3,
        durationSeconds: 25,
        reps: "3 × 20–30 s per side",
        recommendation: "Focus on learning the side alignment first.",
        description:
          "Lie on your side with the lower leg bent and the upper leg straight. Support on the lower forearm and lift your pelvis so shoulder, hip and upper leg form a straight line. " +
          "Hold the position, then change sides."
      },
      {
        label: "Level 2 – Side bench with hip lifts",
        sets: 3,
        durationSeconds: 25,
        reps: "3 × 10–15 controlled lifts per side",
        recommendation: "Quality of movement matters more than speed.",
        description:
          "From a straight side plank with both legs extended, lower the pelvis slowly towards the ground and then lift it back up. " +
          "Repeat while keeping shoulders and hips stacked."
      },
      {
        label: "Level 3 – Side bench with leg lift",
        sets: 3,
        durationSeconds: 25,
        reps: "3 × 10–15 leg lifts per side",
        recommendation: "Only progress if the static and hip-lift variations are stable.",
        description:
          "Hold a strong side plank and lift the top leg away from the bottom leg, then lower it again in a controlled manner. " +
          "Keep the trunk and pelvis in one plane without dipping or twisting."
      }
    ]
  },

  {
    id: "9",
    part: "Part 2 – Strength / Hamstrings",
    name: "Nordic hamstring exercise",
    sequenceIndex: 9,
    levels: [
      {
        label: "Beginner",
        sets: 1,
        durationSeconds: 0,
        reps: "1–2 sets of 3–5 repetitions",
        recommendation: "Start with fewer, very controlled reps to learn the movement.",
        description:
          "Kneel on a soft surface with your partner holding your lower legs down. " +
          "From a straight line from head to knees, lean slowly forward, controlling the movement with the hamstrings. " +
          "When you can no longer resist, catch yourself with your hands and push gently back up."
      },
      {
        label: "Intermediate",
        sets: 1,
        durationSeconds: 0,
        reps: "1–2 sets of about 7–10 repetitions",
        recommendation: "Increase the range and speed only while control stays excellent.",
        description:
          "Perform the same Nordic lean but aim for a larger range of motion and more repetitions. " +
          "Keep the hips fully extended so the movement happens mainly at the knees."
      },
      {
        label: "Advanced",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 sets of 12–15 repetitions",
        recommendation: "Use in well-prepared players to build maximal hamstring strength.",
        description:
          "Execute full-range Nordic curls with strong resistance from the hamstrings. " +
          "Maintain a straight body line from head to knees and avoid bending at the hips."
      }
    ]
  },

  {
    id: "10",
    part: "Part 2 – Balance / Proprioception",
    name: "Single-leg stance",
    sequenceIndex: 10,
    levels: [
      {
        label: "Level 1 – Hold the ball",
        sets: 2,
        durationSeconds: 30,
        reps: "2 × 30 s per leg",
        recommendation: "Use a firm surface at first; progress to softer ground later.",
        description:
          "Stand on one leg with the knee slightly bent and the trunk leaning a little forward. " +
          "Hold a ball with both hands in front of the body and maintain balance for about 30 seconds per leg."
      },
      {
        label: "Level 2 – Throwing ball with partner",
        sets: 2,
        durationSeconds: 30,
        reps: "2 × 30 s per leg while passing the ball",
        recommendation: "Players should catch and throw using their core, not by twisting the knee.",
        description:
          "Stand on one leg facing a partner 2–3 meters away and throw the ball back and forth while maintaining balance. " +
          "The supporting leg stays slightly flexed and the upper body remains upright."
      },
      {
        label: "Level 3 – Test your partner",
        sets: 2,
        durationSeconds: 30,
        reps: "2 × 30 s per leg of gentle balance challenges",
        recommendation: "Pushes should be small and controlled so players can recover balance.",
        description:
          "Stand on one leg facing your partner. Take turns giving light pushes to the shoulders or trunk while the other player tries to keep balance with good knee alignment."
      }
    ]
  },

  {
    id: "11",
    part: "Part 2 – Strength / Lower limbs",
    name: "Squats and lunges",
    sequenceIndex: 11,
    levels: [
      {
        label: "Level 1 – Squats with toe raise",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 sets of 10–15 squats",
        recommendation: "Make sure knees track over toes on every squat and during the toe raise.",
        description:
          "Stand with feet hip-width apart. Bend hips, knees and ankles to lower into a squat until the knees are about 90°. " +
          "As you stand up, rise onto your toes for a brief calf raise, then return to the start."
      },
      {
        label: "Level 2 – Walking lunges",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 passes of 8–10 lunges per leg",
        recommendation: "Shorter steps with upright posture are safer and easier to control.",
        description:
          "From standing, step forward into a lunge with both knees bent around 90°. " +
          "Keep the front knee above the middle of the foot and the trunk upright, then push off the back leg into the next lunge."
      },
      {
        label: "Level 3 – One-leg squats",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 sets of 8–10 squats per leg",
        recommendation: "Use a support at first if needed to keep alignment.",
        description:
          "Stand on one leg and bend the hip and knee to lower into a single-leg squat. " +
          "Keep the knee centered over the foot and the pelvis level as you move up and down."
      }
    ]
  },

  {
    id: "12",
    part: "Part 2 – Plyometrics / Jumping",
    name: "Jumping and landing",
    sequenceIndex: 12,
    levels: [
      {
        label: "Level 1 – Vertical jumps",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 sets of 10 jumps",
        recommendation: "Stop the set if landings become noisy or poorly controlled.",
        description:
          "From a shoulder-width stance, bend hips and knees, swing the arms, and jump straight up. " +
          "Land softly on both feet with knees flexed and knees pointing over the toes."
      },
      {
        label: "Level 2 – Lateral jumps",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 sets of 10 jumps each direction",
        recommendation: "Use a low imaginary line or flat marker; focus on soft landings.",
        description:
          "Jump sideways over a line or small marker, landing on both feet with hips and knees flexed. " +
          "Immediately jump back in the opposite direction while keeping the trunk stable."
      },
      {
        label: "Level 3 – Box jumps",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 sets of 8–10 jumps",
        recommendation: "Use a stable box of sensible height; always step down if players are tired.",
        description:
          "Stand in front of a sturdy box or step. Dip at the hips and knees, then jump up onto the box, landing with both feet fully on the surface and knees bent. " +
          "Step or lightly jump down and reset."
      }
    ]
  },

  // ---------- PART 3: RUNNING ----------
  {
    id: "13",
    part: "Part 3 – Running exercises",
    name: "Running – Across the pitch",
    sequenceIndex: 13,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 runs across the pitch with easy jog back",
        recommendation: "Use this to smoothly increase running intensity toward match pace.",
        description:
          "Run across the field at a comfortable but purposeful pace and jog back to recover. " +
          "Maintain relaxed shoulders, steady arm swing and long, efficient strides."
      }
    ]
  },
  {
    id: "14",
    part: "Part 3 – Running exercises",
    name: "Running – Bounding",
    sequenceIndex: 14,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 bounding runs of 20–30 m",
        recommendation: "Tell players to think of 'long and light' rather than 'high and heavy'.",
        description:
          "Perform exaggerated, powerful running strides so that each step covers more ground than usual. " +
          "Push strongly off the ground, land on the forefoot with the knee slightly bent, and keep the trunk upright."
      }
    ]
  },
  {
    id: "15",
    part: "Part 3 – Running exercises",
    name: "Running – Plant and cut",
    sequenceIndex: 15,
    levels: [
      {
        label: "Standard",
        sets: 2,
        durationSeconds: 0,
        reps: "2–3 sets of 6–10 cuts per side",
        recommendation: "Work at game-like speed but stop if players lose knee control.",
        description:
          "Run forward at moderate to high speed, then slow and plant one foot firmly next to a cone to change direction sharply. " +
          "Push off that leg and accelerate into the new direction, keeping the knee bent and aligned over the foot during the plant step."
      }
    ]
  }
];
