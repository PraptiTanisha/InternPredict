import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Activity, BarChart3, LineChart, Code2 } from "lucide-react";
import { SiPython, SiReact, SiTypescript, SiNodedotjs, SiGo, SiDocker } from "react-icons/si";

export function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 lg:pt-48 lg:pb-32 px-4 container mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide uppercase">V2.0 NOW LIVE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
        >
          Stop Guessing.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Start Landing Internships.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
        >
          InternPredict AI analyzes your resume, evaluates your skills against industry standards, and predicts your chance of passing the resume screen for top tech roles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/analyze" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-full shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]">
              Analyze My Resume <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-full">
              View Dashboard
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 bg-card/50 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Engineer Your Career</h2>
            <p className="text-muted-foreground">Data-driven insights to optimize your profile.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Resume ATS Check",
                desc: "Real-time ATS parsing simulation to ensure your resume doesn't get auto-rejected."
              },
              {
                icon: BarChart3,
                title: "Predictive Modeling",
                desc: "ML models trained on thousands of successful internship applications."
              },
              {
                icon: LineChart,
                title: "Skill Gap Analysis",
                desc: "Identify exactly which technologies you need to learn for your target role."
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="w-full py-24 container mx-auto px-4 text-center">
        <h2 className="text-xl font-medium text-muted-foreground mb-10">We analyze skills across modern stacks</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <SiPython className="w-10 h-10 md:w-12 md:h-12 hover:text-[#3776AB]" />
          <SiTypescript className="w-10 h-10 md:w-12 md:h-12 hover:text-[#3178C6]" />
          <SiReact className="w-10 h-10 md:w-12 md:h-12 hover:text-[#61DAFB]" />
          <SiNodedotjs className="w-10 h-10 md:w-12 md:h-12 hover:text-[#339933]" />
          <SiGo className="w-10 h-10 md:w-12 md:h-12 hover:text-[#00ADD8]" />
          <SiDocker className="w-10 h-10 md:w-12 md:h-12 hover:text-[#2496ED]" />
        </div>
      </section>
    </div>
  );
}
