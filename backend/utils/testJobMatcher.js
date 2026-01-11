// Test file for job matching logic
const { matchCandidateToJob, generateImprovementSuggestions } = require('./jobMatcher');

// Mock candidate data
const mockCandidate = {
  name: "John Doe",
  skills: ["JavaScript", "React", "Node.js"],
  location: "Mumbai, Maharashtra",
  resumeData: {
    formData: {
      location: "Mumbai, Maharashtra"
    },
    skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
    experiences: [
      {
        company: "Tech Corp",
        position: "Junior Developer",
        startDate: "2022-01-01",
        endDate: "2023-12-31",
        current: false
      }
    ],
    educations: [
      {
        institution: "University of Mumbai",
        degree: "Bachelor of Technology",
        field: "Computer Science",
        startDate: "2018-06-01",
        endDate: "2022-05-31"
      }
    ]
  }
};

// Mock job data
const mockJob = {
  title: "Frontend Developer Internship",
  company: "StartupXYZ",
  experience: "1-2 years",
  skills: ["JavaScript", "React", "HTML", "CSS"],
  location: "Mumbai, Maharashtra",
  requirements: [
    "Bachelor's degree in Computer Science or related field",
    "1-2 years of experience in web development",
    "Strong knowledge of JavaScript and React"
  ]
};

// Test fresh graduate scenario
const freshGraduateCandidate = {
  ...mockCandidate,
  resumeData: {
    ...mockCandidate.resumeData,
    experiences: [] // No experience
  }
};

const freshGraduateJob = {
  ...mockJob,
  experience: "Fresh graduate",
  skills: ["JavaScript", "React"]
};

// Test mismatched scenario
const mismatchedJob = {
  ...mockJob,
  experience: "5+ years",
  skills: ["Python", "Django", "Machine Learning"],
  location: "Bangalore, Karnataka"
};

console.log("=== Job Matching Tests ===\n");

console.log("1. Good Match Test:");
const goodMatch = matchCandidateToJob(mockCandidate, mockJob);
console.log(`Score: ${goodMatch.overallScore}%`);
console.log(`Is Match: ${goodMatch.isMatch}`);
console.log(`Recommendation: ${goodMatch.recommendation}`);
console.log(`Experience Match: ${goodMatch.experienceMatch.score}% (${goodMatch.experienceMatch.match})`);
console.log(`Skills Match: ${goodMatch.skillsMatch.score}% (${goodMatch.skillsMatch.matched.length}/${goodMatch.skillsMatch.matched.length + goodMatch.skillsMatch.missing.length} skills)`);
console.log("\n");

console.log("2. Fresh Graduate Test:");
const freshMatch = matchCandidateToJob(freshGraduateCandidate, freshGraduateJob);
console.log(`Score: ${freshMatch.overallScore}%`);
console.log(`Is Match: ${freshMatch.isMatch}`);
console.log(`Recommendation: ${freshMatch.recommendation}`);
console.log("\n");

console.log("3. Poor Match Test:");
const poorMatch = matchCandidateToJob(mockCandidate, mismatchedJob);
console.log(`Score: ${poorMatch.overallScore}%`);
console.log(`Is Match: ${poorMatch.isMatch}`);
console.log(`Recommendation: ${poorMatch.recommendation}`);
console.log(`Feedback: ${poorMatch.feedback.join(', ')}`);

const suggestions = generateImprovementSuggestions(poorMatch);
console.log(`Suggestions: ${suggestions.length} items`);
suggestions.forEach((suggestion, index) => {
  console.log(`  ${index + 1}. ${suggestion.message} (${suggestion.priority})`);
});