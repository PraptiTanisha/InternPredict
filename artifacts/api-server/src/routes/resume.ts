import { Router, type IRouter } from "express";
import { AnalyzeResumeBody, AnalyzeResumeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const ROLE_KEYWORDS: Record<string, string[]> = {
  "Software Engineer": ["algorithms", "data structures", "system design", "git", "agile", "REST", "API", "testing", "CI/CD", "docker"],
  "Data Scientist": ["machine learning", "python", "pandas", "numpy", "statistics", "SQL", "tensorflow", "scikit-learn", "visualization", "deep learning"],
  "Frontend Developer": ["React", "JavaScript", "TypeScript", "CSS", "HTML", "webpack", "responsive design", "UI/UX", "Redux", "testing"],
  "Backend Developer": ["Node.js", "databases", "API", "microservices", "docker", "kubernetes", "SQL", "NoSQL", "REST", "authentication"],
  "Machine Learning Engineer": ["pytorch", "tensorflow", "python", "model deployment", "MLOps", "feature engineering", "NLP", "computer vision", "cloud", "experimentation"],
  "DevOps Engineer": ["CI/CD", "docker", "kubernetes", "terraform", "AWS", "monitoring", "bash", "linux", "infrastructure", "automation"],
  "Product Manager": ["roadmap", "stakeholders", "OKRs", "user research", "analytics", "agile", "prioritization", "launch", "metrics", "cross-functional"],
};

const ALL_KEYWORDS = ["python", "javascript", "typescript", "react", "node.js", "git", "sql", "docker", "linux", "agile",
  "REST", "API", "testing", "algorithms", "data structures", "machine learning", "cloud", "aws", "azure", "kubernetes",
  "CI/CD", "databases", "microservices", "html", "css", "java", "c++", "golang", "scala", "spark"];

const SKILL_PATTERNS: { name: string; patterns: string[]; category: string }[] = [
  { name: "Python", patterns: ["python"], category: "Programming Languages" },
  { name: "JavaScript", patterns: ["javascript", "js"], category: "Programming Languages" },
  { name: "TypeScript", patterns: ["typescript", "ts"], category: "Programming Languages" },
  { name: "Java", patterns: ["java"], category: "Programming Languages" },
  { name: "C++", patterns: ["c++", "cpp"], category: "Programming Languages" },
  { name: "Go", patterns: ["golang", " go "], category: "Programming Languages" },
  { name: "React", patterns: ["react"], category: "Frameworks & Libraries" },
  { name: "Node.js", patterns: ["node.js", "nodejs", "node js"], category: "Frameworks & Libraries" },
  { name: "Django", patterns: ["django"], category: "Frameworks & Libraries" },
  { name: "Spring Boot", patterns: ["spring boot", "spring"], category: "Frameworks & Libraries" },
  { name: "TensorFlow", patterns: ["tensorflow"], category: "ML & AI" },
  { name: "PyTorch", patterns: ["pytorch"], category: "ML & AI" },
  { name: "Scikit-learn", patterns: ["scikit-learn", "sklearn"], category: "ML & AI" },
  { name: "SQL", patterns: ["sql", "mysql", "postgresql", "postgres"], category: "Databases" },
  { name: "MongoDB", patterns: ["mongodb", "mongo"], category: "Databases" },
  { name: "Redis", patterns: ["redis"], category: "Databases" },
  { name: "Docker", patterns: ["docker"], category: "DevOps & Cloud" },
  { name: "Kubernetes", patterns: ["kubernetes", "k8s"], category: "DevOps & Cloud" },
  { name: "AWS", patterns: ["aws", "amazon web services"], category: "DevOps & Cloud" },
  { name: "Git", patterns: ["git", "github", "gitlab"], category: "Tools" },
  { name: "Linux", patterns: ["linux", "unix"], category: "Tools" },
];

function detectSkills(text: string) {
  const lower = text.toLowerCase();
  return SKILL_PATTERNS.filter(s => s.patterns.some(p => lower.includes(p)));
}

function scoreResumeText(text: string, targetRole?: string): {
  atsScore: number;
  formatScore: number;
  keywordScore: number;
  skillsScore: number;
} {
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  // Format score based on structure indicators
  let formatScore = 40;
  if (text.includes("\n") && wordCount > 100) formatScore += 20;
  if (/experience|work|employment/i.test(text)) formatScore += 10;
  if (/education|degree|university|college/i.test(text)) formatScore += 10;
  if (/skills|technologies|tools/i.test(text)) formatScore += 10;
  if (/project|portfolio/i.test(text)) formatScore += 5;
  if (/@|email/i.test(text)) formatScore += 5;
  formatScore = Math.min(100, formatScore);

  // Keyword score: count matched keywords
  const roleKeywords = targetRole && ROLE_KEYWORDS[targetRole]
    ? ROLE_KEYWORDS[targetRole]
    : ALL_KEYWORDS;
  const matchedCount = roleKeywords.filter(k => lower.includes(k.toLowerCase())).length;
  const keywordScore = Math.min(100, Math.round((matchedCount / roleKeywords.length) * 100));

  // Skills score
  const foundSkills = detectSkills(text);
  const skillsScore = Math.min(100, Math.round((foundSkills.length / 10) * 100));

  // ATS score = weighted average
  const atsScore = Math.round(formatScore * 0.25 + keywordScore * 0.4 + skillsScore * 0.35);

  return { atsScore, formatScore, keywordScore, skillsScore };
}

router.post("/resume/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { resumeText, targetRole } = parsed.data;
  const lower = resumeText.toLowerCase();

  const scores = scoreResumeText(resumeText, targetRole);

  const roleKeywords = targetRole && ROLE_KEYWORDS[targetRole]
    ? ROLE_KEYWORDS[targetRole]
    : ALL_KEYWORDS.slice(0, 15);

  const keywordMatches = roleKeywords.map(keyword => ({
    keyword,
    found: lower.includes(keyword.toLowerCase()),
    importance: (["algorithms", "machine learning", "python", "react", "docker", "sql", "REST"].includes(keyword)
      ? "high"
      : keyword.length > 8 ? "medium" : "low") as "high" | "medium" | "low",
  }));

  const foundSkillPatterns = detectSkills(resumeText);
  const skills = foundSkillPatterns.map(s => ({
    name: s.name,
    category: s.category,
    score: Math.round(60 + Math.random() * 40),
    level: (["Python", "JavaScript", "Git", "SQL"].includes(s.name)
      ? "advanced"
      : foundSkillPatterns.indexOf(s) < 5 ? "intermediate" : "beginner") as "beginner" | "intermediate" | "advanced" | "expert",
  }));

  const missingKeywords = roleKeywords
    .filter(k => !lower.includes(k.toLowerCase()))
    .slice(0, 8);

  const recommendations: string[] = [];
  if (scores.keywordScore < 50) recommendations.push("Add more role-specific keywords to improve ATS detection");
  if (scores.formatScore < 70) recommendations.push("Use clear section headers: Experience, Education, Skills, Projects");
  if (foundSkillPatterns.length < 5) recommendations.push("List your technical skills explicitly in a dedicated Skills section");
  if (!/github|portfolio|linkedin/i.test(resumeText)) recommendations.push("Add links to your GitHub profile, portfolio, or LinkedIn");
  if (!/project/i.test(resumeText)) recommendations.push("Include a Projects section with descriptions and technologies used");
  if (recommendations.length < 3) recommendations.push("Quantify your achievements with numbers and metrics");
  if (recommendations.length < 4) recommendations.push("Tailor your resume to match the specific job description keywords");

  const strengths: string[] = [];
  if (scores.formatScore >= 70) strengths.push("Well-structured resume with clear sections");
  if (foundSkillPatterns.length >= 5) strengths.push("Strong technical skills coverage");
  if (/project|built|developed|implemented/i.test(resumeText)) strengths.push("Demonstrates hands-on project experience");
  if (/intern|internship/i.test(resumeText)) strengths.push("Prior internship experience is a strong signal");
  if (/award|honor|distinction|gpa|cgpa/i.test(resumeText)) strengths.push("Academic achievements highlighted");
  if (strengths.length === 0) strengths.push("Resume submitted for analysis");

  const result = AnalyzeResumeResponse.parse({
    ...scores,
    keywordMatches,
    skills,
    missingKeywords,
    recommendations,
    strengths,
  });

  res.json(result);
});

export default router;
