
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground login-bg soft-glow flex flex-col">
      <header className="p-6 flex justify-between items-center glass-card border-none rounded-none bg-transparent">
        <div className="flex items-center gap-2">
          <span className="text-4xl">🚚</span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Fast Truck</h1>
        </div>
        <Link to="/auth">
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            Login / Sign Up
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">Reliable Drivers



            <span className="text-primary">Reliable Drivers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The fastest way to get your goods moving. Whether you're a client needing transport or a freelancer with a truck, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 h-auto shadow-xl shadow-primary/20 transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto backdrop-blur-sm">
              Learn More
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {[{ title: "Post Jobs", icon: "📝", desc: "Clients can easily post delivery requirements and budget." }, { title: "Get Hired", icon: "🤝", desc: "Drivers can browse jobs and submit proposals instantly." }, { title: "Fast Delivery", icon: "🚀", desc: "Efficient matching means your cargo moves faster." }].
          map((feature, i) =>
          <div key={i} className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-6 text-center text-gray-500 glass-card border-none rounded-none bg-transparent mt-12">
        <p>&copy; 2025 Fast Truck. All Rights Reserved.</p>
      </footer>
    </div>);

};

export default Index;