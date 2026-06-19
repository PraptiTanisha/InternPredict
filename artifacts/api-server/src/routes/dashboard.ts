import { Router, type IRouter } from "express";
import { GetDashboardSummaryResponse, GetSkillsCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const result = GetDashboardSummaryResponse.parse({
    readinessScore: 72,
    readinessGrade: "B+",
    totalAnalyses: 3,
    topSkills: ["Python", "React", "SQL", "Git", "Docker", "Machine Learning"],
    careerInsights: [
      { title: "ATS Score Avg", value: "74%", trend: "up", changePercent: 8.5 },
      { title: "Keyword Coverage", value: "68%", trend: "up", changePercent: 12.0 },
      { title: "Skills Detected", value: "12", trend: "up", changePercent: 20.0 },
      { title: "Job Match Rate", value: "61%", trend: "stable", changePercent: 1.2 },
    ],
    progressCards: [
      { category: "Technical Skills", current: 12, target: 20, unit: "skills" },
      { category: "Projects", current: 3, target: 5, unit: "projects" },
      { category: "Certifications", current: 1, target: 4, unit: "certs" },
      { category: "ATS Score", current: 74, target: 90, unit: "%" },
    ],
    recentActivity: [
      { action: "Resume Analyzed", detail: "ATS Score: 78 — Software Engineer role", timestamp: "2 hours ago" },
      { action: "Prediction Run", detail: "Internship probability: 76% — Grade A", timestamp: "1 day ago" },
      { action: "Resume Analyzed", detail: "ATS Score: 71 — Data Scientist role", timestamp: "3 days ago" },
      { action: "Prediction Run", detail: "Internship probability: 65% — Grade B+", timestamp: "5 days ago" },
      { action: "Profile Updated", detail: "Added 3 new skills to profile", timestamp: "1 week ago" },
    ],
  });

  res.json(result);
});

router.get("/skills/categories", async (_req, res): Promise<void> => {
  const result = GetSkillsCategoriesResponse.parse({
    categories: [
      {
        category: "Programming Languages",
        avgProficiency: 72,
        skills: [
          { name: "Python", proficiency: 85, demand: "high" },
          { name: "JavaScript", proficiency: 78, demand: "high" },
          { name: "TypeScript", proficiency: 70, demand: "high" },
          { name: "Java", proficiency: 60, demand: "medium" },
          { name: "C++", proficiency: 55, demand: "medium" },
        ],
      },
      {
        category: "Frameworks & Libraries",
        avgProficiency: 65,
        skills: [
          { name: "React", proficiency: 80, demand: "high" },
          { name: "Node.js", proficiency: 72, demand: "high" },
          { name: "Django", proficiency: 60, demand: "medium" },
          { name: "Spring Boot", proficiency: 45, demand: "medium" },
        ],
      },
      {
        category: "ML & AI",
        avgProficiency: 58,
        skills: [
          { name: "Scikit-learn", proficiency: 70, demand: "high" },
          { name: "TensorFlow", proficiency: 55, demand: "high" },
          { name: "PyTorch", proficiency: 50, demand: "high" },
          { name: "Pandas/NumPy", proficiency: 75, demand: "high" },
        ],
      },
      {
        category: "Databases",
        avgProficiency: 68,
        skills: [
          { name: "SQL / PostgreSQL", proficiency: 78, demand: "high" },
          { name: "MongoDB", proficiency: 65, demand: "medium" },
          { name: "Redis", proficiency: 45, demand: "medium" },
        ],
      },
      {
        category: "DevOps & Cloud",
        avgProficiency: 52,
        skills: [
          { name: "Git / GitHub", proficiency: 88, demand: "high" },
          { name: "Docker", proficiency: 62, demand: "high" },
          { name: "AWS", proficiency: 48, demand: "high" },
          { name: "Kubernetes", proficiency: 30, demand: "medium" },
          { name: "CI/CD", proficiency: 45, demand: "high" },
        ],
      },
    ],
  });

  res.json(result);
});

export default router;
