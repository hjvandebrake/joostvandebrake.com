"use strict";

(() => {
const MC_BLOCKS = [
  {
    heading: "Lecture 1: Teamwork theories",
    questions: [
      {
        number: 1,
        stem: "After completing its first project, a team becomes more confident. That confidence then influences how it approaches the next project. Which feature of the IMOI model does this illustrate?",
        options: [
          "A. Inputs affect outcomes only once",
          "B. Mediators must remain stable across projects",
          "C. Outcomes can feed back and become inputs in a later cycle",
          "D. The model applies only when team membership changes",
        ],
        answer: "C",
        rationale: "IMOI treats teamwork as an ongoing cycle: an outcome from one episode can shape the inputs to a later episode.",
      },
      {
        number: 2,
        stem: "Which example is an emergent state rather than a behavioral process?",
        options: [
          "A. A shared sense of confidence that develops as members work together",
          "B. Members exchanging task information during a meeting",
          "C. Members coordinating the handover of work",
          "D. Members checking whether deadlines have been met",
        ],
        answer: "A",
        rationale: "Shared confidence is a team property that emerges over time. Exchanging information, coordinating, and checking progress are actions.",
      },
      {
        number: 3,
        stem: "According to Hackman, when is assigning work to a team most appropriate?",
        options: [
          "A. When one expert can complete the work more effectively alone",
          "B. When the work consists of unrelated individual tasks",
          "C. When only individual results are valued by the organization",
          "D. When the task genuinely requires members to collaborate and combine their contributions",
        ],
        answer: "D",
        rationale: "Hackman argues that a team should be used when the task itself calls for collaboration, rather than simply because teamwork is fashionable.",
      },
      {
        number: 4,
        stem: "A team has unclear membership, vague roles, and little organizational support. Which response best follows Hackman's recommendations?",
        options: [
          "A. Add more members but leave the work design unchanged",
          "B. Clarify boundaries, roles, and stakeholder relationships, and provide leadership and support",
          "C. Remove all direction so that the team can discover its task",
          "D. Replace collective recognition with stronger individual competition",
        ],
        answer: "B",
        rationale: "Effective teams need a clear structure and boundaries as well as direction and organizational support.",
      },
    ],
  },
  {
    heading: "Lecture 2: Team membership",
    questions: [
      {
        number: 5,
        stem: "Which situation is the clearest example of social loafing?",
        options: [
          "A. A member works harder in a group because the task is important",
          "B. A member exerts less effort in a group than the same person would exert when working alone",
          "C. A member disagrees with the team's final decision",
          "D. A member lacks the technical skill needed for the task",
        ],
        answer: "B",
        rationale: "Social loafing is reduced individual effort when working collectively compared with working alone.",
      },
      {
        number: 6,
        stem: "Which change is most likely to reduce social loafing in a student project team?",
        options: [
          "A. Make individual contributions harder to identify",
          "B. Remove deadlines and performance goals",
          "C. Give only a group grade and provide no progress feedback",
          "D. Make contributions visible, set clear goals, and provide individual feedback",
        ],
        answer: "D",
        rationale: "Visibility, accountability, clear goals, and feedback make individual effort more consequential and reduce social loafing.",
      },
      {
        number: 7,
        stem: "Members disagree about who belongs to their project team. What is the most direct managerial response suggested by Mortensen's discussion?",
        options: [
          "A. State clearly who belongs, clarify roles, and discuss the shared understanding of team boundaries",
          "B. Allow every member to use a different membership list",
          "C. Focus only on the team's final output",
          "D. Avoid discussing membership because the issue will always disappear by itself",
        ],
        answer: "A",
        rationale: "Explicit membership and role clarification can align members' understandings of team boundaries.",
      },
      {
        number: 8,
        stem: "What is a likely result when an employee shifts from mainly defining the self as an individual to defining the self as a member of the team?",
        options: [
          "A. The employee becomes unable to pursue any goal",
          "B. The employee focuses only on personal recognition",
          "C. The employee is more willing to support group goals, even when this requires some personal sacrifice",
          "D. The employee automatically agrees with every other member",
        ],
        answer: "C",
        rationale: "A collective self-definition makes group goals and identity more important for motivation and behavior.",
      },
    ],
  },
  {
    heading: "Lecture 3: Team composition",
    questions: [
      {
        number: 9,
        stem: "A team contains members from engineering, finance, and marketing, but all have equal decision authority. What kind of diversity is most clearly present?",
        options: [
          "A. Horizontal diversity, because members differ in expertise rather than rank or power",
          "B. Vertical diversity, because every functional difference creates a hierarchy",
          "C. No diversity, because authority is equal",
          "D. Vertical diversity, because the team contains three functions",
        ],
        answer: "A",
        rationale: "Differences in expertise, knowledge, and perspective are horizontal; differences in status or power are vertical.",
      },
      {
        number: 10,
        stem: "Which statement best describes a possible effect of horizontal diversity?",
        options: [
          "A. It always improves performance and cannot create conflict",
          "B. It affects only formal authority and never problem solving",
          "C. It can broaden ideas and improve problem solving, but it can also create disagreement or conflict",
          "D. It makes members identical in knowledge and experience",
        ],
        answer: "C",
        rationale: "Different knowledge and perspectives may improve problem solving, while those same differences can also make coordination and agreement harder.",
      },
      {
        number: 11,
        stem: "Two teams have the same average level of experience, but one team has four similarly experienced members while the other combines novices and experts. What does this show about team composition?",
        options: [
          "A. The teams must function identically because their averages are equal",
          "B. Member attributes can be represented at team level in different ways, including both an average and the amount of diversity",
          "C. Experience is not an individual attribute",
          "D. Team composition can be studied only by counting members",
        ],
        answer: "B",
        rationale: "Bell et al. emphasize both member attributes and how those attributes are operationalized at the team level.",
      },
      {
        number: 12,
        stem: "Why may a team average alone give an incomplete picture of composition?",
        options: [
          "A. An average always identifies the most powerful member",
          "B. Averages can be calculated only for personality",
          "C. An average shows exactly how an attribute is distributed among members",
          "D. Teams with the same average can have very different distributions of knowledge, skill, or experience",
        ],
        answer: "D",
        rationale: "A team mean does not reveal whether members are similar or whether high and low values are distributed unevenly.",
      },
    ],
  },
  {
    heading: "Lecture 4: Change in teams",
    questions: [
      {
        number: 13,
        stem: "Before selecting a team development intervention, what should a manager do first?",
        options: [
          "A. Use the same activity that another team used",
          "B. Choose the most entertaining exercise",
          "C. Wait until the team has failed several times",
          "D. Identify the team's specific needs and select an intervention that addresses them",
        ],
        answer: "D",
        rationale: "Shuffler et al. emphasize interventions that are targeted to the team's diagnosed needs.",
      },
      {
        number: 14,
        stem: "A team performs useful work, but members repeatedly duplicate tasks because responsibilities are unclear. Which intervention is the best fit?",
        options: [
          "A. Add more technical tasks",
          "B. Role clarification",
          "C. Replace group goals with unrelated personal goals",
          "D. Stop all feedback",
        ],
        answer: "B",
        rationale: "Role clarification directly addresses uncertainty about who is responsible for which work.",
      },
      {
        number: 15,
        stem: "Through which mechanisms can well-chosen team development interventions improve outcomes?",
        options: [
          "A. By increasing ambiguity and reducing communication",
          "B. By making team goals less important",
          "C. By improving communication, trust, and alignment around goals",
          "D. By ensuring that members never disagree",
        ],
        answer: "C",
        rationale: "Communication, trust, and goal alignment are key pathways through which a well-chosen intervention can improve team functioning.",
      },
      {
        number: 16,
        stem: "A team completes one useful workshop, but nothing from it is discussed again. What would most improve the intervention's likely impact?",
        options: [
          "A. Reinforce and revisit the intervention as the team continues its work",
          "B. Keep its lessons separate from daily teamwork",
          "C. Avoid checking whether behavior changes",
          "D. Replace the team's goals after every meeting",
        ],
        answer: "A",
        rationale: "Team development is more effective when it is reinforced over time rather than treated as an isolated event.",
      },
    ],
  },
  {
    heading: "Lecture 5: Specific team contexts",
    questions: [
      {
        number: 17,
        stem: "A project has entered the planning phase. Which factors should receive especially careful attention according to Pinto and Slevin?",
        options: [
          "A. Only environmental events outside the team's control",
          "B. Team termination and final client satisfaction only",
          "C. Top management support and client acceptance, alongside detailed planning",
          "D. Informal social interaction instead of schedules",
        ],
        answer: "C",
        rationale: "In the planning phase, organizational support, acceptance by the client, and the development of workable plans are particularly important.",
      },
      {
        number: 18,
        stem: "Which set of concerns is especially important while a project is being executed?",
        options: [
          "A. Effective leadership, troubleshooting, and sound performance of the technical tasks",
          "B. Choosing a project idea while ignoring implementation problems",
          "C. Avoiding all communication with the client",
          "D. Replacing the project mission every week",
        ],
        answer: "A",
        rationale: "During execution, leadership, troubleshooting, and technical performance become central to keeping implementation on track.",
      },
      {
        number: 19,
        stem: "A virtual team must resolve a complicated misunderstanding. Which communication choice is most appropriate?",
        options: [
          "A. Use the shortest possible text message regardless of the issue",
          "B. Postpone the discussion until the conflict disappears",
          "C. Use a tool that no team member understands",
          "D. Use a richer medium, such as a video meeting, that allows immediate clarification",
        ],
        answer: "D",
        rationale: "Complex or conflict-laden messages are better handled through richer communication media.",
      },
      {
        number: 20,
        stem: "What should a newly formed virtual team do early in its life cycle?",
        options: [
          "A. Leave responsibilities and communication habits unstated",
          "B. Establish clear norms, task responsibilities, and mutual expectations",
          "C. Assume informal coordination will occur exactly as it does face to face",
          "D. Select technology without considering the team's work",
        ],
        answer: "B",
        rationale: "Virtual teams benefit from deliberate early planning and explicit norms because informal coordination is less available.",
      },
    ],
  },
];

const OPEN_QUESTIONS = [
  {
    number: 1,
    heading: "Lecture 1: Designing an effective team",
    scenario: "A service unit plans to create a permanent team for a monthly report that one trained analyst can complete independently. For the unit's genuinely collaborative work, however, nobody is sure who belongs to the team, responsibilities are vague, and supervisors recognize only individual achievements.",
    parts: [
      "A. Using Hackman's argument, explain whether the monthly report should be assigned to a team. (5 points)",
      "B. For the genuinely collaborative work, identify and explain two improvements to the team's structure or design. (5 points)",
      "C. Explain how leadership and organizational support could improve this team's effectiveness. Give two concrete actions. (5 points)",
    ],
  },
  {
    number: 2,
    heading: "Lecture 2: Reducing social loafing",
    scenario: "Four students prepare one group report. Tasks are not assigned to individuals, only the final group product is visible, and the group receives no feedback before the deadline. Two members gradually reduce their effort because they believe nobody can tell how much they contributed.",
    parts: [
      "A. Define social loafing and identify two features of the case that help explain it. (6 points)",
      "B. Propose three changes that could reduce social loafing and explain why each change should increase individual effort. (9 points)",
    ],
  },
  {
    number: 3,
    heading: "Lecture 3: Describing team composition",
    scenario: "Team Green has four members who each score 7 on relevant experience. Team Blue has four members who score 4, 6, 8, and 10. Both teams therefore have the same average experience, but the experience is distributed differently.",
    parts: [
      "A. According to Bell et al., what two elements must be considered when describing team composition? Apply both to the case, including why the average makes the teams look alike while a diversity measure distinguishes them. (8 points)",
      "B. Explain why the choice between an average and a diversity measure can matter when predicting how a team will function. Give one practical example. (7 points)",
    ],
  },
  {
    number: 4,
    heading: "Lecture 5: Project priorities across phases",
    scenario: "A project is moving from planning into execution and will later be closed and handed over to its client. The project manager knows that the same implementation concern will not be equally important in every phase.",
    parts: [
      "A. Identify two critical success factors that deserve particular attention during planning, and explain why. (5 points)",
      "B. Identify two critical success factors that deserve particular attention during execution, and explain why. (5 points)",
      "C. Explain why project priorities change over the life cycle and identify one concern that becomes important when the project is terminated and handed over. (5 points)",
    ],
  },
];

window.EXAM_DATA = { MC_BLOCKS, OPEN_QUESTIONS, OPEN_ANSWER_LIMIT: 1500 };
})();
