const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PsychometricQuestion = require('../models/PsychometricQuestion');
const connectDB = require('../config/db');

dotenv.config();

const questions = [
    // Section 1: Numerical Reasoning (8 Questions)
    {
        section: "Numerical Reasoning",
        questionText: "A development team of 4 engineers can complete a backend module in 12 days. If the project manager adds 2 more engineers with the same efficiency to the team, how many days will it take to complete the same module?",
        options: ["A) 6 days", "B) 8 days", "C) 9 days", "D) 10 days"],
        correctAnswer: "B",
        explanation: "Inverse proportion. (4 engineers × 12 days) = 48 man-days. 48 / 6 engineers = 8 days.",
        skillSignal: "Resource planning, efficiency calculation"
    },
    {
        section: "Numerical Reasoning",
        questionText: "A file is 2.4 GB in size. If the download speed is stable at 8 MB per second (Mbps), how long will it take to download? (Assume 1 GB = 1000 MB).",
        options: ["A) 3 minutes", "B) 4 minutes", "C) 5 minutes", "D) 6 minutes"],
        correctAnswer: "C",
        explanation: "2.4 GB = 2400 MB. 2400 / 8 = 300 seconds. 300 / 60 = 5 minutes.",
        skillSignal: "Unit conversion, rate calculation"
    },
    {
        section: "Numerical Reasoning",
        questionText: "A startup's IT budget is $200,000. They allocate 40% to hardware, 35% to software licenses, and the remainder to cloud hosting. How much is allocated to cloud hosting?",
        options: ["A) $40,000", "B) $50,000", "C) $60,000", "D) $70,000"],
        correctAnswer: "B",
        explanation: "40% + 35% = 75%. Remaining is 25%. 25% of $200,000 is $50,000.",
        skillSignal: "Budgeting, percentage analysis"
    },
    {
        section: "Numerical Reasoning",
        questionText: "A server handles 500 requests per minute. Following a marketing campaign, traffic increases by 20% in the first hour, and then by another 10% (compounded) in the second hour. What is the request rate after two hours?",
        options: ["A) 650", "B) 660", "C) 600", "D) 700"],
        correctAnswer: "B",
        explanation: "500 + 20% = 600. 600 + 10% = 660.",
        skillSignal: "Growth trending, compound percentage"
    },
    {
        section: "Numerical Reasoning",
        questionText: "In a codebase of 15,000 lines, 45 bugs were found. In a second codebase of 20,000 lines, 50 bugs were found. Which codebase has a higher defect density (bugs per 1,000 lines)?",
        options: ["A) Codebase 1", "B) Codebase 2", "C) They are equal", "D) Cannot be determined"],
        correctAnswer: "A",
        explanation: "Codebase 1: 45/15 = 3 bugs/kloc. Codebase 2: 50/20 = 2.5 bugs/kloc.",
        skillSignal: "Ratio comparison, quality analysis"
    },
    {
        section: "Numerical Reasoning",
        questionText: "In a logic circuit, if Input A is 1 and Input B is 0: (A AND B) OR (A XOR B) = ?",
        options: ["A) 0", "B) 1", "C) Null", "D) -1"],
        correctAnswer: "B",
        explanation: "(1 AND 0) = 0. (1 XOR 0) = 1. (0 OR 1) = 1.",
        skillSignal: "Boolean logic, computational thinking"
    },
    {
        section: "Numerical Reasoning",
        questionText: "A SaaS platform charges $12/month. They have 1,000 users. If they increase the price to $15/month but lose 10% of their users, what happens to the total monthly revenue?",
        options: ["A) Decreases by $500", "B) Increases by $1,000", "C) Increases by $1,500", "D) Remains the same"],
        correctAnswer: "C",
        explanation: "Original: 1000 * 12 = $12,000. New: 900 * 15 = $13,500. Difference: +$1,500.",
        skillSignal: "Risk/Reward analysis, revenue modeling"
    },
    {
        section: "Numerical Reasoning",
        questionText: "Identify the missing number in the server response time logs (in ms): 2, 6, 12, 20, 30, ?",
        options: ["A) 38", "B) 40", "C) 42", "D) 44"],
        correctAnswer: "C",
        explanation: "The differences increase by 2 (4, 6, 8, 10, 12). 30 + 12 = 42.",
        skillSignal: "Pattern recognition, numerical series"
    },

    // Section 2: Verbal Reasoning (7 Questions)
    {
        section: "Verbal Reasoning",
        questionText: "\"Agile methodology emphasizes iterative development... However, this flexibility can lead to 'scope creep'...\" According to the text, what is a potential downside of Agile flexibility?",
        options: ["A) It requires strict upfront planning.", "B) It discourages collaboration.", "C) It prevents late changes.", "D) It can lead to uncontrolled expansion of project scope."],
        correctAnswer: "D",
        explanation: "Text explicitly states flexibility can lead to \"scope creep.\"",
        skillSignal: "Reading comprehension, detail extraction"
    },
    {
        section: "Verbal Reasoning",
        questionText: "\"Agile methodology emphasizes iterative development...\" Based on the text, which environment is Agile best suited for?",
        options: ["A) Projects where requirements are fixed and never change.", "B) Projects where documentation is the only priority.", "C) Dynamic environments where user needs may evolve.", "D) Projects with zero stakeholder interaction."],
        correctAnswer: "C",
        explanation: "Inferred from \"Agile welcomes changing requirements.\"",
        skillSignal: "Inductive reasoning"
    },
    {
        section: "Verbal Reasoning",
        questionText: "Statements: All Compilers are Programs. Some Programs are Interpreters. Conclusion: I. Some Compilers are Interpreters. II. All Interpreters are Programs.",
        options: ["A) Only I follows", "B) Only II follows", "C) Both I and II follow", "D) Neither follows"],
        correctAnswer: "D",
        explanation: "Neither strictly follows based only on the statements provided.",
        skillSignal: "Formal logic, error checking"
    },
    {
        section: "Verbal Reasoning",
        questionText: "GitHub : Repository :: Jenkins : ?",
        options: ["A) Database", "B) CI/CD Pipeline", "C) Operating System", "D) Frontend Framework"],
        correctAnswer: "B",
        explanation: "GitHub hosts repositories; Jenkins manages CI/CD pipelines.",
        skillSignal: "Domain association, functional relationships"
    },
    {
        section: "Verbal Reasoning",
        questionText: "\"The new API reduces latency by 50%. Therefore, user satisfaction will double.\" Which statement, if true, most weakens this argument?",
        options: ["A) The API is written in Python.", "B) Users value UI design significantly more than speed.", "C) The server costs will increase slightly.", "D) The API was developed by a junior team."],
        correctAnswer: "B",
        explanation: "If users don't care about speed (the metric improved), satisfaction won't necessarily rise.",
        skillSignal: "Argument analysis, identifying variables"
    },
    {
        section: "Verbal Reasoning",
        questionText: "Statement: \"We need to switch to a NoSQL database to handle the unstructured data from the new social feed feature.\" Assumption:",
        options: ["A) SQL databases are cheaper.", "B) The social feed feature is not important.", "C) Current SQL databases cannot efficiently handle the specific unstructured data required.", "D) NoSQL is older than SQL."],
        correctAnswer: "C",
        explanation: "The switch is justified by the need to handle unstructured data, assuming the current solution cannot.",
        skillSignal: "Technical justification, gap analysis"
    },
    {
        section: "Verbal Reasoning",
        questionText: "Which word best replaces \"Ephemeral\" in the context: \"The data stored in the cache is ephemeral and will be lost upon reboot.\"",
        options: ["A) Permanent", "B) Temporary", "C) Encrypted", "D) Structured"],
        correctAnswer: "B",
        explanation: "Ephemeral means lasting for a very short time.",
        skillSignal: "Vocabulary, technical literacy"
    },

    // Section 3: Logical Reasoning (6 Questions)
    {
        section: "Logical Reasoning",
        questionText: "If DEBUG is coded as EFCVH, how is LOGIC coded?",
        options: ["A) MPHJD", "B) NQJKE", "C) MPJJD", "D) LPHID"],
        correctAnswer: "A",
        explanation: "Each letter is shifted forward by +1. L->M, O->P, G->H, I->J, C->D.",
        skillSignal: "Pattern recognition, encryption logic"
    },
    {
        section: "Logical Reasoning",
        questionText: "Five processes (A, B, C, D, E) are queued. A must run before B. C must run after B. D must run before A. E runs last. What is the execution order?",
        options: ["A) D-A-B-C-E", "B) A-B-D-C-E", "C) D-B-A-C-E", "D) B-C-A-D-E"],
        correctAnswer: "A",
        explanation: "D < A < B < C. E is last.",
        skillSignal: "Scheduling, sequential logic"
    },
    {
        section: "Logical Reasoning",
        questionText: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
        options: ["A) (1/3)", "B) (1/8)", "C) (2/8)", "D) (1/16)"],
        correctAnswer: "B",
        explanation: "Each number is divided by 2 to get the next.",
        skillSignal: "Recursive logic"
    },
    {
        section: "Logical Reasoning",
        questionText: "A robot faces North. It turns 90 degrees clockwise, moves 5 meters, turns 90 degrees clockwise again, and moves 5 meters. What direction is it facing now?",
        options: ["A) North", "B) East", "C) South", "D) West"],
        correctAnswer: "C",
        explanation: "North -> Right (East) -> Right (South).",
        skillSignal: "Spatial orientation, simulation"
    },
    {
        section: "Logical Reasoning",
        questionText: "Point A is the parent of Point B. Point C is the sibling of Point B. Point D is the child of Point C. How is Point A related to Point D?",
        options: ["A) Parent", "B) Grandparent", "C) Uncle", "D) Sibling"],
        correctAnswer: "B",
        explanation: "A is parent to C (sibling of B). D is child of C. Therefore A is D's Grandparent.",
        skillSignal: "Hierarchical structures (trees)"
    },
    {
        section: "Logical Reasoning",
        questionText: "Which of the following does not belong in the group?",
        options: ["A) Linux", "B) Windows", "C) Python", "D) macOS"],
        correctAnswer: "C",
        explanation: "A, B, and D are Operating Systems. Python is a programming language.",
        skillSignal: "Classification, technical categorization"
    },

    // Section 4: Abstract / Diagrammatic Reasoning (6 Questions)
    {
        section: "Abstract Reasoning",
        questionText: "[Arrow Up] -> [Arrow Right] -> [Arrow Down] -> ? What comes next?",
        options: ["A) Arrow Up", "B) Arrow Right", "C) Arrow Left", "D) Arrow Down"],
        correctAnswer: "C",
        explanation: "The pattern is a 90-degree clockwise rotation.",
        skillSignal: "Spatial looping, rotation logic"
    },
    {
        section: "Abstract Reasoning",
        questionText: "Circle A is inside Square B. Square B is inside Triangle C. Which statement is true?",
        options: ["A) All of Circle A is inside Triangle C.", "B) Some of Triangle C is inside Circle A.", "C) Square B is outside Triangle C.", "D) Circle A is larger than Square B."],
        correctAnswer: "A",
        explanation: "Nested sets logic. If A ⊂ B and B ⊂ C, then A ⊂ C.",
        skillSignal: "Set theory, nesting logic"
    },
    {
        section: "Abstract Reasoning",
        questionText: "Rule: ⍺ flips the shape vertically. β changes the color from black to white. Input: Black Triangle pointing Up. Apply: ⍺ then β. Result?",
        options: ["A) Black Triangle pointing Down", "B) White Triangle pointing Up", "C) White Triangle pointing Down", "D) Black Triangle pointing Up"],
        correctAnswer: "C",
        explanation: "Flip vertical (Points Down) -> Change color (White).",
        skillSignal: "Algorithmic execution, state transformation"
    },
    {
        section: "Abstract Reasoning",
        questionText: "Row 1: [1 dot] [2 dots] [3 dots]. Row 2: [2 dots] [4 dots] [6 dots]. Row 3: [3 dots] [6 dots] [?]",
        options: ["A) 8 dots", "B) 9 dots", "C) 10 dots", "D) 12 dots"],
        correctAnswer: "B",
        explanation: "Row 1 is x1. Row 2 is x2. Row 3 is x3 multiplication of column index.",
        skillSignal: "Matrix patterns, arithmetic progression"
    },
    {
        section: "Abstract Reasoning",
        questionText: "Start -> Is X > 5? -> (Yes: Subtract 1) / (No: Add 1) -> End. If Input X = 4, what is the output?",
        options: ["A) 3", "B) 4", "C) 5", "D) 6"],
        correctAnswer: "C",
        explanation: "4 is not > 5. Follow \"No\" path. 4 + 1 = 5.",
        skillSignal: "Control flow analysis"
    },
    {
        section: "Abstract Reasoning",
        questionText: "[Square] is to [Cube] as [Circle] is to ?",
        options: ["A) Cylinder", "B) Sphere", "C) Oval", "D) Ring"],
        correctAnswer: "B",
        explanation: "2D shape to its 3D equivalent.",
        skillSignal: "Dimensional reasoning"
    },

    // Section 5: Situational Judgement (8 Questions)
    {
        section: "Situational Judgement",
        questionText: "You are two days away from a deadline. You realize a piece of code works but is messy and might cause bugs later (technical debt). What do you do?",
        options: ["A) Rewrite the entire module immediately to be perfect.", "B) Ship the code as is and never look at it again.", "C) Ship the working code to meet the deadline, but document the issue and schedule a refactor sprint immediately after.", "D) Hide the code so the manager doesn't see it."],
        correctAnswer: "C",
        explanation: "Balances delivery speed with long-term quality maintenance.",
        skillSignal: "Pragmatism, professional responsibility"
    },
    {
        section: "Situational Judgement",
        questionText: "You are assigned a task, but the requirements from the Product Manager are vague and contradictory. You are stuck. What is the best next step?",
        options: ["A) Guess what they want and build it.", "B) Wait until the deadline to say you couldn't do it.", "C) Ask your peer to do it for you.", "D) Proactively set up a meeting with the Product Manager to clarify specific questions before starting."],
        correctAnswer: "D",
        explanation: "Demonstrates communication skills and proactive unblocking.",
        skillSignal: "Communication, requirement gathering"
    },
    {
        section: "Situational Judgement",
        questionText: "It is 5:00 PM on Friday. You find a critical security bug in the production system that could leak user data.",
        options: ["A) Go home and fix it Monday morning.", "B) Post it on social media to warn users.", "C) Immediately escalate to the team lead/security team and stay to help fix it.", "D) Ignore it; it’s not your code."],
        correctAnswer: "C",
        explanation: "Security takes precedence over work-hours; immediate escalation is required.",
        skillSignal: "Integrity, crisis management"
    },
    {
        section: "Situational Judgement",
        questionText: "A senior engineer suggests a solution you know is inefficient because you recently read a paper on a newer method.",
        options: ["A) Stay silent; they are senior.", "B) Publicly laugh at their outdated method during the meeting.", "C) Privately or politely suggest the new method with data/evidence to support your view.", "D) Implement your method without telling anyone."],
        correctAnswer: "C",
        explanation: "Respectful challenge backed by data is the standard for engineering culture.",
        skillSignal: "Teamwork, influence"
    },
    {
        section: "Situational Judgement",
        questionText: "Your team is switching from Java to Go (a language you don't know) next month.",
        options: ["A) Start looking for a new job that uses Java.", "B) Wait for the company to pay for a training course.", "C) Complain that the switch is unnecessary.", "D) Start learning the basics of Go in your spare time or allotted learning hours to prepare."],
        correctAnswer: "D",
        explanation: "Software engineering requires continuous learning and adaptability.",
        skillSignal: "Adaptability, growth mindset"
    },
    {
        section: "Situational Judgement",
        questionText: "A team member is struggling to finish their part of the project, which is blocking you.",
        options: ["A) Complain to the manager immediately.", "B) Offer to pair program or help them debug the issue to unblock the team.", "C) Do your own work and let them fail.", "D) Take over their work completely and don't give them credit."],
        correctAnswer: "B",
        explanation: "Collaboration and unblocking the team is valued over individual isolation.",
        skillSignal: "Collaboration, leadership"
    },
    {
        section: "Situational Judgement",
        questionText: "A client asks you directly to add a \"small feature\" that is not in the project scope.",
        options: ["A) Do it quickly to make them happy.", "B) Refuse rudely.", "C) Direct them to the Project Manager to discuss scope and budget implications.", "D) Charge them cash on the side."],
        correctAnswer: "C",
        explanation: "Adherence to process and scope management protects the team and timeline.",
        skillSignal: "Professional boundaries, process adherence"
    },
    {
        section: "Situational Judgement",
        questionText: "You caused a production outage by deploying a bad config file.",
        options: ["A) Blame the QA team for not catching it.", "B) Admit the mistake, roll back the change, and write a post-mortem on how to prevent it next time.", "C) Delete the logs so no one knows it was you.", "D) Say nothing and hope it fixes itself."],
        correctAnswer: "B",
        explanation: "Psychological safety and \"blameless post-mortems\" rely on honesty and process improvement.",
        skillSignal: "Accountability, problem resolution"
    },

    // Section 6: Spatial / Mechanical Reasoning (5 Questions)
    {
        section: "Spatial / Mechanical Reasoning",
        questionText: "A flat paper shape consists of 6 squares in a 'T' shape. If folded into a cube, which square will be opposite the center square?",
        options: ["A) The top square of the 'T'", "B) The bottom square of the 'T'", "C) The left square", "D) The far end of the stem"],
        correctAnswer: "D",
        explanation: "In a T-shape fold, the stem's end usually folds over to cover the face opposite the cross-center.",
        skillSignal: "3D visualization"
    },
    {
        section: "Spatial / Mechanical Reasoning",
        questionText: "Gear A drives Gear B. Gear B drives Gear C. If Gear A turns Clockwise, which way does Gear C turn?",
        options: ["A) Clockwise", "B) Counter-Clockwise", "C) It stays still", "D) Oscillates"],
        correctAnswer: "A",
        explanation: "A (CW) -> B (CCW) -> C (CW). Odd numbers of gears reverse direction; even numbers return to original.",
        skillSignal: "Mechanical logic, system interdependencies"
    },
    {
        section: "Spatial / Mechanical Reasoning",
        questionText: "You are looking at a cylinder from directly above. What 2D shape do you see?",
        options: ["A) Square", "B) Rectangle", "C) Circle", "D) Triangle"],
        correctAnswer: "C",
        explanation: "The top-down orthographic projection of a cylinder is a circle.",
        skillSignal: "Orthographic projection"
    },
    {
        section: "Spatial / Mechanical Reasoning",
        questionText: "Which object is most stable?",
        options: ["A) A pyramid resting on its tip.", "B) A sphere on a flat surface.", "C) A cube resting on a flat face.", "D) A tall, thin column."],
        correctAnswer: "C",
        explanation: "Low center of gravity and wide base surface area provide maximum static stability.",
        skillSignal: "Physics intuition"
    },
    {
        section: "Spatial / Mechanical Reasoning",
        questionText: "Which alphanumeric string is a palindrome (looks the same forwards and backwards)?",
        options: ["A) 12345", "B) ABBA", "C) A1B2", "D) QWERTY"],
        correctAnswer: "B",
        explanation: "ABBA reads the same in reverse.",
        skillSignal: "String processing, pattern symmetry"
    }
];

const seedDB = async () => {
    try {
        await connectDB();

        console.log('Clearing existing psychometric questions...');
        await PsychometricQuestion.deleteMany({});

        console.log(`Seeding ${questions.length} questions...`);
        await PsychometricQuestion.insertMany(questions);

        console.log('Psychometric questions seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
