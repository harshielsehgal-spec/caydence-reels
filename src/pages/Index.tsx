import { Button } from "@/components/ui/button";
import { Zap, Activity, Trophy } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />
        
        <div className="container relative z-10 px-6 text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="inline-block px-4 py-2 rounded-full border border-border bg-secondary/50 text-muted-foreground text-sm font-medium mb-8">
              Premium Sports Technology
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="gradient-text">Caydence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Elevate your performance with next-generation sports technology
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button variant="hero" size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Built for <span className="gradient-text">Champions</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Advanced features designed to push your limits
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Real-time performance tracking with zero latency" },
              { icon: Activity, title: "Smart Analytics", desc: "AI-powered insights to optimize your training" },
              { icon: Trophy, title: "Compete & Win", desc: "Join leagues and compete with athletes worldwide" },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 card-shadow hover:glow-orange"
              >
                <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
