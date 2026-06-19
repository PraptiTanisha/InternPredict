import { useState } from "react";
import { usePredictInternship } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, Award, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const formSchema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  skillsCount: z.coerce.number().min(0).max(50),
  projectsCount: z.coerce.number().min(0).max(20),
  certificationsCount: z.coerce.number().min(0).max(20),
  internshipsCount: z.coerce.number().min(0).max(10),
  hackathonsCount: z.coerce.number().min(0).max(20),
});

type FormValues = z.infer<typeof formSchema>;

export function Predict() {
  const predictMutation = usePredictInternship();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cgpa: 7.5,
      skillsCount: 5,
      projectsCount: 2,
      certificationsCount: 1,
      internshipsCount: 0,
      hackathonsCount: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    predictMutation.mutate({ data });
  };

  const result = predictMutation.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Internship Predictor</h1>
        <p className="text-muted-foreground">Adjust the parameters to see your estimated probability of landing an internship.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Enter your metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="cgpa"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>CGPA</FormLabel>
                          <span className="text-sm text-primary font-medium">{field.value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0} max={10} step={0.1}
                            value={[field.value]}
                            onValueChange={(v) => field.onChange(v[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {['skillsCount', 'projectsCount', 'certificationsCount', 'internshipsCount', 'hackathonsCount'].map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key as keyof FormValues}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel className="capitalize">{key.replace('Count', '')}</FormLabel>
                            <span className="text-sm text-primary font-medium">{field.value}</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={0} max={key === 'skillsCount' ? 30 : 10} step={1}
                              value={[field.value as number]}
                              onValueChange={(v) => field.onChange(v[0])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <Button type="submit" className="w-full" disabled={predictMutation.isPending}>
                    {predictMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                    Calculate Probability
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!result && !predictMutation.isPending && (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <div className="text-center text-muted-foreground p-8">
                <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Submit your profile to generate your prediction.</p>
              </div>
            </Card>
          )}

          {predictMutation.isPending && (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </Card>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="overflow-hidden relative bg-gradient-to-br from-background to-muted border-primary/20">
                  <div className="absolute inset-0 bg-primary/5" />
                  <CardContent className="p-8 relative z-10 flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Selection Probability</p>
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">
                      {result.probability}%
                    </div>
                    <div className="mt-4 px-4 py-1 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                      Grade: {result.grade}
                    </div>
                    <p className="mt-3 text-sm">{result.label}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Impact Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.factors} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                          {result.factors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.status === 'good' ? 'var(--color-primary)' : entry.status === 'average' ? 'var(--color-chart-4)' : 'var(--color-destructive)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tips to Improve</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Target Companies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.similarProfiles.map((p, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{p.company}</p>
                            <p className="text-xs text-muted-foreground">{p.role}</p>
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            {p.probability}% Match
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
