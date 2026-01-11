export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Student Hub
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-300 hover:text-blue-400 transition font-medium hidden md:block hover:scale-105">
              Features
            </a>
            <a href="#impact" className="text-gray-300 hover:text-blue-400 transition font-medium hidden md:block hover:scale-105">
              Why It Matters
            </a>
            <a
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Get Started
            </a>

              <a
    href="/login/superadmin"
    className="px-5 py-2.5 rounded-xl border border-cyan-500 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition-all"
  >
    Register University
  </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* Hero Section */}
        <section className="text-center space-y-8 pt-8 relative">
          {/* Background glow effects */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-6 max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-blue-300 font-medium text-sm backdrop-blur-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Trusted by 50+ Institutions
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-text">
                One Platform
              </span>
              <br />
              <span className="text-gray-100">For All Student Achievements</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Smart Student Hub is a centralized digital ecosystem where students store, track, 
              and showcase verified academic and co-curricular achievements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 relative z-10">
            <a
              href="/login"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 text-lg group"
            >
              <span className="flex items-center justify-center gap-2">
                Start Your Journey
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-300 font-semibold hover:border-blue-500/50 hover:shadow-lg transition-all backdrop-blur-sm hover:scale-105"
            >
              Explore Features
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto relative z-10">
            <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg hover:border-blue-500/30 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-blue-400">10K+</div>
              <div className="text-gray-400">Active Students</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg hover:border-cyan-500/30 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-cyan-400">50+</div>
              <div className="text-gray-400">Institutions</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg hover:border-blue-500/30 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-blue-400">100K+</div>
              <div className="text-gray-400">Achievements</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg hover:border-cyan-500/30 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-cyan-400">99%</div>
              <div className="text-gray-400">Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-100">
              Everything You Need in One Place
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A comprehensive platform designed for modern education needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/20">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Digital Portfolio</h3>
              <p className="text-gray-400 mb-6">
                Students upload certificates, events, internships, volunteering, 
                competitions, and achievements — all verified and organized.
              </p>
              <div className="inline-flex items-center gap-2 text-blue-400 font-medium group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <div className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/30">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-cyan-500/20">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg shadow-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Faculty Verification</h3>
              <p className="text-gray-400 mb-6">
                Faculty members validate submissions in real-time to maintain 
                authenticity, credibility, and institutional trust.
              </p>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-medium group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            <div className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/30">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-purple-500/20">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">Accreditation Ready</h3>
              <p className="text-gray-400 mb-6">
                Generate comprehensive reports for NAAC, NIRF, AICTE, or internal 
                audits with just a few clicks.
              </p>
              <div className="inline-flex items-center gap-2 text-purple-400 font-medium group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-3xl p-12 border border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5"></div>
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <h2 className="text-4xl font-bold">
              Transforming <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Education Management</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-blue-500/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                    <span className="text-blue-400 text-xl">👨‍🎓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-100">For Students</h4>
                    <p className="text-gray-400">Build a verified digital profile that stands out to employers and institutions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-cyan-500/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                    <span className="text-cyan-400 text-xl">🏛️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-100">For Institutions</h4>
                    <p className="text-gray-400">Reduce paperwork and manual tracking by 80% with automated systems</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-purple-500/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                    <span className="text-purple-400 text-xl">👨‍🏫</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-100">For Faculty</h4>
                    <p className="text-gray-400">Real-time visibility into student progress and achievements with analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-blue-500/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                    <span className="text-blue-400 text-xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-100">For Accreditation</h4>
                    <p className="text-gray-400">Structured, verifiable data ready for all accreditation processes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold text-gray-100">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of institutions already using Smart Student Hub to 
              streamline their student achievement management.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-500/40 group"
            >
              <span className="flex items-center justify-center gap-2">
                Start Free Trial
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>
            <a
              href="/demo"
              className="px-10 py-4 rounded-xl bg-gray-800/50 border-2 border-gray-700 text-gray-300 font-semibold text-lg hover:border-blue-500 hover:shadow-xl transition-all backdrop-blur-sm hover:scale-105"
            >
              Schedule Demo
            </a>
          </div>
          
          <p className="text-gray-500 text-sm">
            No credit card required • 14-day free trial • Full access
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-100">Smart Student Hub</div>
                <div className="text-gray-400">Empowering Education Digitally</div>
              </div>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition hover:scale-105">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition hover:scale-105">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition hover:scale-105">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 mt-8 pt-8 text-center text-gray-500">
            © {new Date().getFullYear()} Smart Student Hub. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}