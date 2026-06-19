import { useGetDashboardSummary, useGetSkillsCategories } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

export function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: skillsInfo, isLoading: isLoadingSkills } = useGetSkillsCategories();

  if (isLoadingSummary || isLoadingSkills) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!summary || !skillsInfo) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      
      {/* Top Row: Hero Metric & Career Insights */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 relative overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
            <h2 className="text-lg font-medium text-muted-foreground mb-4">Overall Readiness</h2>
            <div className="h-40 w-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" cy="50%" 
                  innerRadius="80%" outerRadius="100%" 
                  barSize={12} 
                  data={[{ value: summary.readinessScore, fill: "var(--color-primary)" }]}
                  startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{summary.readinessScore}</span>
                <span className="text-sm font-medium text-primary">Grade {summary.readinessGrade}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-8 grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {summary.careerInsights.map((insight, i) => (
            <Card key={i} className="flex flex-col justify-center">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground mb-1">{insight.title}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold">{insight.value}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    {insight.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {insight.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                    {insight.trend === 'stable' && <Minus className="w-4 h-4 text-muted-foreground" />}
                    <span className={insight.trend === 'up' ? "text-green-500" : insight.trend === 'down' ? "text-red-500" : "text-muted-foreground"}>
                      {insight.changePercent}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="flex flex-col justify-center sm:col-span-2 xl:col-span-1">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Analyses</p>
              <h3 className="text-2xl font-bold">{summary.totalAnalyses}</h3>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle Row: Progress & Skills */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Goals Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {summary.progressCards.map((prog, i) => {
              const percent = Math.min(100, Math.round((prog.current / prog.target) * 100));
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{prog.category}</span>
                    <span className="text-muted-foreground">{prog.current} / {prog.target} {prog.unit}</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {skillsInfo.categories.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-primary font-medium">{cat.avgProficiency}%</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cat.skills.map((skill, j) => (
                    <Badge 
                      key={j} 
                      variant="secondary"
                      className={skill.demand === 'high' ? 'border-primary/50 text-primary bg-primary/10' : ''}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.recentActivity.map((activity, i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className="mt-0.5 bg-primary/10 p-2 rounded-full text-primary">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
