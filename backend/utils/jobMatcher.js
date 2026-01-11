const mongoose = require('mongoose');

/**
 * Job Profile Matching Utility
 * Matches candidate profile with job requirements
 */

/**
 * Parse experience from string (e.g., "1-2 years", "3+ years", "Fresh graduate")
 * @param {string} experienceStr - Experience string from job or user profile
 * @returns {number} - Experience in years (0 for fresh graduate)
 */
const parseExperience = (experienceStr) => {
  if (!experienceStr) return 0;
  
  const str = experienceStr.toLowerCase().trim();
  
  // Handle fresh graduate cases
  if (str.includes('fresh') || str.includes('fresher') || str.includes('entry level') || str.includes('0 year')) {
    return 0;
  }
  
  // Extract numbers from experience string
  const numbers = str.match(/\d+/g);
  if (!numbers) return 0;
  
  // For ranges like "1-2 years", take the minimum required
  // For "3+ years", take the number
  const firstNumber = parseInt(numbers[0]);
  return firstNumber;
};

/**
 * Calculate skill match percentage
 * @param {Array} candidateSkills - Skills from candidate profile
 * @param {Array} jobSkills - Required skills from job
 * @returns {number} - Match percentage (0-100)
 */
const calculateSkillMatch = (candidateSkills = [], jobSkills = []) => {
  if (!jobSkills || jobSkills.length === 0) return 100; // No specific skills required
  if (!candidateSkills || candidateSkills.length === 0) return 0; // Candidate has no skills
  
  const normalizedCandidateSkills = candidateSkills.map(skill => 
    skill.toLowerCase().trim()
  );
  
  const normalizedJobSkills = jobSkills.map(skill => 
    skill.toLowerCase().trim()
  );
  
  const matchedSkills = normalizedJobSkills.filter(jobSkill => 
    normalizedCandidateSkills.some(candidateSkill => 
      candidateSkill.includes(jobSkill) || jobSkill.includes(candidateSkill)
    )
  );
  
  return Math.round((matchedSkills.length / normalizedJobSkills.length) * 100);
};

/**
 * Calculate education match
 * @param {Array} candidateEducation - Education from candidate profile
 * @param {Array} jobRequirements - Job requirements
 * @returns {number} - Match score (0-100)
 */
const calculateEducationMatch = (candidateEducation = [], jobRequirements = []) => {
  if (!jobRequirements || jobRequirements.length === 0) return 100;
  
  const educationKeywords = [
    'bachelor', 'master', 'phd', 'diploma', 'degree', 'graduation', 
    'btech', 'mtech', 'mba', 'bca', 'mca', 'engineering', 'computer science',
    'bsc', 'msc', 'bcom', 'mcom'
  ];
  
  const requirementsStr = jobRequirements.join(' ').toLowerCase();
  const hasEducationRequirement = educationKeywords.some(keyword => 
    requirementsStr.includes(keyword)
  );
  
  if (!hasEducationRequirement) return 100; // No specific education requirement
  
  if (!candidateEducation || candidateEducation.length === 0) return 0;
  
  // Basic matching - if candidate has any education, give partial score
  let score = 50;
  
  // Check for degree level matching
  candidateEducation.forEach(edu => {
    const eduStr = `${edu.degree} ${edu.field}`.toLowerCase();
    if (requirementsStr.includes('bachelor') && eduStr.includes('bachelor')) score += 25;
    if (requirementsStr.includes('master') && eduStr.includes('master')) score += 25;
    if (requirementsStr.includes('engineering') && eduStr.includes('engineering')) score += 25;
  });
  
  return Math.min(score, 100);
};

/**
 * Main job matching function
 * @param {Object} candidate - Candidate user object
 * @param {Object} job - Job object
 * @returns {Object} - Match result with score and details
 */
const matchCandidateToJob = (candidate, job) => {
  const result = {
    isMatch: false,
    overallScore: 0,
    experienceMatch: { score: 0, required: '', candidate: '', match: false },
    skillsMatch: { score: 0, matched: [], missing: [] },
    educationMatch: { score: 0, hasRequirement: false },
    locationMatch: { match: false, required: '', candidate: '' },
    feedback: [],
    recommendation: ''
  };

  try {
    // 1. Experience Matching
    const requiredExperience = parseExperience(job.experience);
    const candidateExperience = parseExperience(candidate.resumeData?.experiences?.length > 0 ? 
      `${candidate.resumeData.experiences.length} years` : '0 years');
    
    result.experienceMatch = {
      score: candidateExperience >= requiredExperience ? 100 : 
             Math.max(0, 100 - ((requiredExperience - candidateExperience) * 30)),
      required: job.experience || 'Not specified',
      candidate: `${candidateExperience} years`,
      match: candidateExperience >= requiredExperience
    };

    // 2. Skills Matching
    const candidateSkills = [
      ...(candidate.skills || []),
      ...(candidate.resumeData?.skills || [])
    ];
    
    const skillMatchPercentage = calculateSkillMatch(candidateSkills, job.skills);
    const matchedSkills = [];
    const missingSkills = [];
    
    if (job.skills && job.skills.length > 0) {
      job.skills.forEach(jobSkill => {
        const isMatched = candidateSkills.some(candidateSkill => 
          candidateSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
          jobSkill.toLowerCase().includes(candidateSkill.toLowerCase())
        );
        
        if (isMatched) {
          matchedSkills.push(jobSkill);
        } else {
          missingSkills.push(jobSkill);
        }
      });
    }
    
    result.skillsMatch = {
      score: skillMatchPercentage,
      matched: matchedSkills,
      missing: missingSkills
    };

    // 3. Education Matching
    const educationScore = calculateEducationMatch(
      candidate.resumeData?.educations || candidate.education,
      job.requirements
    );
    
    result.educationMatch = {
      score: educationScore,
      hasRequirement: job.requirements && job.requirements.length > 0
    };

    // 4. Location Matching
    const candidateLocation = candidate.location || candidate.resumeData?.formData?.location || '';
    const jobLocation = job.location || '';
    
    const locationMatch = !jobLocation || 
                         jobLocation.toLowerCase().includes('remote') ||
                         jobLocation.toLowerCase().includes('work from home') ||
                         candidateLocation.toLowerCase().includes(jobLocation.toLowerCase()) ||
                         jobLocation.toLowerCase().includes(candidateLocation.toLowerCase());
    
    result.locationMatch = {
      match: locationMatch,
      required: jobLocation,
      candidate: candidateLocation
    };

    // 5. Calculate Overall Score (weighted)
    const weights = {
      experience: 0.35,
      skills: 0.35,
      education: 0.20,
      location: 0.10
    };

    result.overallScore = Math.round(
      (result.experienceMatch.score * weights.experience) +
      (result.skillsMatch.score * weights.skills) +
      (result.educationMatch.score * weights.education) +
      (result.locationMatch.match ? 100 : 50) * weights.location
    );

    // 6. Generate Feedback
    if (!result.experienceMatch.match) {
      result.feedback.push(`Required ${job.experience || 'experience'}, but you have ${candidateExperience} years experience`);
    }
    
    if (result.skillsMatch.missing.length > 0) {
      result.feedback.push(`Missing required skills: ${result.skillsMatch.missing.join(', ')}`);
    }
    
    if (!result.locationMatch.match && jobLocation && !jobLocation.toLowerCase().includes('remote')) {
      result.feedback.push(`Location preference doesn't match. Job requires: ${jobLocation}`);
    }

    // 7. Determine if it's a match and generate recommendation
    result.isMatch = result.overallScore >= 70; // 70% threshold for good match

    if (result.overallScore >= 85) {
      result.recommendation = 'Excellent match! You meet all the requirements for this position.';
    } else if (result.overallScore >= 70) {
      result.recommendation = 'Good match! You meet most of the requirements. Consider applying.';
    } else if (result.overallScore >= 50) {
      result.recommendation = 'Partial match. You might want to improve your skills before applying.';
    } else {
      result.recommendation = 'This position may not be the best fit for your current profile. Consider developing the required skills first.';
    }

    return result;

  } catch (error) {
    console.error('Error in job matching:', error);
    result.feedback.push('Error occurred while matching profile');
    return result;
  }
};

/**
 * Generate detailed mismatch reasons
 * @param {Object} matchResult - Result from matchCandidateToJob
 * @returns {Array} - Array of detailed mismatch reasons
 */
const generateMismatchReasons = (matchResult) => {
  const reasons = [];

  // Experience mismatch
  if (!matchResult.experienceMatch.match) {
    reasons.push({
      category: 'experience',
      reason: `Experience requirement not met. Required: ${matchResult.experienceMatch.required}, You have: ${matchResult.experienceMatch.candidate}`,
      severity: 'high',
      impact: 'This significantly affects your application as most roles require minimum experience.'
    });
  }

  // Skills mismatch
  if (matchResult.skillsMatch.missing.length > 0) {
    const severity = matchResult.skillsMatch.missing.length > 2 ? 'high' : 
                    matchResult.skillsMatch.missing.length > 1 ? 'medium' : 'low';
    
    reasons.push({
      category: 'skills',
      reason: `Missing required skills: ${matchResult.skillsMatch.missing.join(', ')}`,
      severity: severity,
      impact: `Having these skills is essential for this role. Consider learning: ${matchResult.skillsMatch.missing.slice(0, 3).join(', ')}`
    });
  }

  // Education mismatch
  if (matchResult.educationMatch.score < 70 && matchResult.educationMatch.hasRequirement) {
    reasons.push({
      category: 'education',
      reason: 'Educational background may not fully align with job requirements',
      severity: 'medium',
      impact: 'While not always a deal-breaker, having the required education can strengthen your application.'
    });
  }

  // Location mismatch
  if (!matchResult.locationMatch.match && matchResult.locationMatch.required && 
      !matchResult.locationMatch.required.toLowerCase().includes('remote')) {
    reasons.push({
      category: 'location',
      reason: `Location preference mismatch. Job requires: ${matchResult.locationMatch.required}, Your location: ${matchResult.locationMatch.candidate || 'Not specified'}`,
      severity: 'medium',
      impact: 'Consider if you can relocate or work from the required location.'
    });
  }

  return reasons;
};

/**
 * Generate improvement suggestions for candidate
 * @param {Object} matchResult - Result from matchCandidateToJob
 * @returns {Array} - Array of improvement suggestions
 */
const generateImprovementSuggestions = (matchResult) => {
  const suggestions = [];

  if (matchResult.skillsMatch.missing.length > 0) {
    suggestions.push({
      type: 'skills',
      message: `Consider learning these skills: ${matchResult.skillsMatch.missing.join(', ')}`,
      priority: 'high'
    });
  }

  if (!matchResult.experienceMatch.match) {
    suggestions.push({
      type: 'experience',
      message: 'Consider gaining more relevant work experience through projects or internships',
      priority: 'medium'
    });
  }

  if (matchResult.educationMatch.score < 70 && matchResult.educationMatch.hasRequirement) {
    suggestions.push({
      type: 'education',
      message: 'Consider pursuing relevant educational qualifications',
      priority: 'low'
    });
  }

  return suggestions;
};

module.exports = {
  matchCandidateToJob,
  generateImprovementSuggestions,
  generateMismatchReasons,
  parseExperience,
  calculateSkillMatch
};