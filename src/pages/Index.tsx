import { Button } from "@/components/ui/button";
import { Zap, Activity, Trophy, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

const ReelDemoFrame = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="relative w-full max-w-[320px] md:max-w-[360px] aspect-[9/16] rounded-[26px] overflow-hidden bg-background border border-border/30 shadow-2xl glow-orange group md:hover:scale-[1.02] transition-transform duration-500"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src="/videos/bumrah_bowling_144.mp4"
        className="absolute inset-0 w-full h-full object-contain bg-black"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Top-left Label */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-border/30 z-10">
        <span className="text-xs font-medium text-foreground">Reel • AI Motion Check</span>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/30 via-primary/10 to-transparent pointer-events-none" />

      {/* Play/Pause Button */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg glow-orange transition-opacity duration-300 cursor-pointer z-10 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-primary-foreground" />
        ) : (
          <Play className="w-6 h-6 text-primary-foreground ml-1" />
        )}
      </div>
    </div>
  );
};

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

      {/* Cadence Reels Demo Section */}
      <section className="py-24 px-6">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Cadence Reels</span> Demo
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              AI-powered motion analysis for athletes
            </p>
          </div>
          
          {/* Reel Frame Container */}
          <div className="flex justify-center">
            <ReelDemoFrame />
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
