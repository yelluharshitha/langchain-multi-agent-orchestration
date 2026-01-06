import React from "react";
import { Heart, Brain, Zap, Shield, Users, TrendingUp } from "lucide-react";

function HomePage({ onLoginClick, onRegisterClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <style>{`
      `}</style>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/head-logo.png"
              alt="Arogya Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <span className="text-sm sm:text-lg font-bold text-gray-900">
              Arogya
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onLoginClick}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition"
            >
              Login
            </button>
            <button
              onClick={onRegisterClick}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-medium hover:bg-emerald-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 sm:mb-8">
                <img
                  src="/head-logo.png"
                  alt="Arogya Logo"
                  className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain flex-shrink-0"
                />
                <div className="text-center sm:text-left sm:mt-4 md:mt-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight sm:pl-5 pr-2 py-2 uppercase">
                    Arogya
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-emerald-600 font-medium tracking-widest uppercase">
                    Wellness Assistant
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed text-center sm:text-left">
                Get personalized health guidance powered by AI. Understand your
                symptoms, receive expert recommendations, and access curated
                wellness resources—all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRegisterClick}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Get Started
              </button>
              <button
                onClick={onLoginClick}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg border-2 border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50 transition text-sm sm:text-base"
              >
                Sign In
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Powered by a multi-agent AI system for personalized wellness
              insights.
            </p>
          </div>

          {/* Right: Hero Image */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-3xl opacity-30 blur-2xl"></div>
              <img
                src="/home-image.jpg"
                alt="Wellness & Health"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Arogya?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Empowering you with intelligent health insights and personalized
              wellness guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center mb-4">
                <Brain className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Advanced AI analyzes your symptoms and provides intelligent,
                personalized health insights based on your inputs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                <Heart className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Personal Health Profile
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Track your health metrics, maintain a comprehensive history, and
                get tailored recommendations over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Curated Resources
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Access expertly curated video resources and wellness content
                matched to your specific health journey.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center mb-4">
                <Shield className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                100% Private & Secure
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Your health data is encrypted and private. We prioritize your
                security and confidentiality.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-lg bg-yellow-600 flex items-center justify-center mb-4">
                <Zap className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Instant Guidance
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Get immediate wellness advice and follow-up answers to your
                health questions, anytime.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-lg bg-cyan-600 flex items-center justify-center mb-4">
                <Users className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Evidence-Based
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Recommendations backed by medical research and expert wellness
                knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 sm:mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your account in seconds",
              },
              {
                step: "2",
                title: "Share",
                desc: "Tell us about your symptoms",
              },
              {
                step: "3",
                title: "Analyze",
                desc: "AI provides personalized insights",
              },
              {
                step: "4",
                title: "Act",
                desc: "Get recommendations & resources",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Take Control of Your Wellness?
          </h2>
          <p className="text-emerald-50 mb-8 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Join thousands of users getting personalized health guidance powered
            by AI. Start your wellness journey today.
          </p>
          <button
            onClick={onRegisterClick}
            className="px-8 sm:px-10 py-3 sm:py-4 rounded-lg bg-white text-emerald-600 font-bold hover:bg-gray-50 transition shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-xs sm:text-sm">
          <p className="mb-4">
            © 2025 Arogya. Your personal wellness assistant.
          </p>
          <p>
            Disclaimer: Arogya provides general wellness information. Always
            consult healthcare professionals for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
