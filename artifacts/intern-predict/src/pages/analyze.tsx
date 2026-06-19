import { useState } from "react";
import { useAnalyzeResume } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

export function Analyze() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  
  const analyzeMutation = useAnalyzeResume();

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;
    analyzeMutation.mutate({ data: { resumeText, targetRole } });
  };

  const result = analyzeMutation.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resume Analyzer</h1>
        <p className="text-muted-foreground">Paste your resume text to get an instant ATS compatibility score and feedback.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Role (Optional)</label>
                <Input 
                  placeholder="e.g. Frontend Engineer" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Resume Text</label>
                <Textarea 
                  placeholder="Paste your resume content here..." 
                  className="min-h-[300px] font-mono text-sm"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending || !resumeText.trim()}
              >
                {analyzeMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!result && !analyzeMutation.isPending && (
            <Card className="h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px] border-dashed">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
              <p className="text-muted-foreground max-w-md">
                Paste your resume on the left and click analyze to see your ATS score, keyword matches, and personalized recommendations.
              </p>
            </Card>
          )}

          {analyzeMutation.isPending && (
            <Card className="h-full flex flex-col items-center justify-center p-12 min-h-[400px]">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium animate-pulse">Running ATS simulation...</p>
            </Card>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "ATS Score", value: result.atsScore, color: "var(--color-primary)" },
                  { label: "Format", value: result.formatScore, color: "var(--color-chart-2)" },
                  { label: "Keywords", value: result.keywordScore, color: "var(--color-chart-3)" },
                  { label: "Skills", value: result.skillsScore, color: "var(--color-chart-4)" },
                ].map((metric) => (
                  <Card key={metric.label}>
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <div className="h-24 w-24 relative mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart 
                            cx="50%" cy="50%" 
                            innerRadius="70%" outerRadius="100%" 
                            barSize={10} 
                            data={[{ value: metric.value, fill: metric.color }]}
                            startAngle={90} endAngle={-270}
                          >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                          {metric.value}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Keyword Matches</CardTitle>
                  <CardDescription>Keywords found in your resume compared to standard requirements.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordMatches.map((kw, i) => (
                      <Badge 
                        key={i} 
                        variant={kw.found ? "default" : "outline"}
                        className={!kw.found ? "border-red-500/50 text-red-400" : ""}
                      >
                        {kw.keyword}
                        {kw.found ? <CheckCircle2 className="w-3 h-3 ml-1" /> : <XCircle className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
