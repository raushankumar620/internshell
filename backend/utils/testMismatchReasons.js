// Test mismatch reasons functionality
const { matchCandidateToJob, generateMismatchReasons } = require('./jobMatcher');

// Mock candidate with poor match
const poorMatchCandidate = {
  name: "Jane Doe",
  skills: ["HTML", "CSS"],
  location: "Mumbai, Maharashtra",
  resumeData: {
    formData: {
      location: "Mumbai, Maharashtra"
    },
    skills: ["HTML", "CSS"],
    experiences: [], // No experience
    educations: [
      {
        institution: "Local College",
        degree: "Arts",
        field: "English Literature"
      }
    ]
  }
};

// Senior developer job requiring experience and specific skills
const seniorJob = {
  title: "Senior Full Stack Developer",
  company: "TechGiant",
  experience: "5+ years",
  skills: ["JavaScript", "Python", "React", "Django", "AWS"],
  location: "Bangalore, Karnataka",
  requirements: [
    "Bachelor's degree in Computer Science or Engineering",
    "5+ years of full-stack development experience",
    "Strong knowledge of cloud platforms"
  ]
};

console.log("=== Mismatch Reasons Test ===\n");

const matchResult = matchCandidateToJob(poorMatchCandidate, seniorJob);
const mismatchReasons = generateMismatchReasons(matchResult);

console.log(`Overall Score: ${matchResult.overallScore}%`);
console.log(`Is Match: ${matchResult.isMatch}`);
console.log(`\nDetailed Mismatch Reasons:`);

mismatchReasons.forEach((reason, index) => {
  console.log(`\n${index + 1}. Category: ${reason.category.toUpperCase()}`);
  console.log(`   Severity: ${reason.severity}`);
  console.log(`   Reason: ${reason.reason}`);
  console.log(`   Impact: ${reason.impact}`);
});

console.log(`\nTotal Mismatch Issues: ${mismatchReasons.length}`);