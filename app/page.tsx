export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Smart Student Hub
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition text-sm hidden md:block">
              Features
            </a>
            <a href="#impact" className="text-gray-600 hover:text-blue-600 transition text-sm hidden md:block">
              Why It Matters
            </a>
            <a
              href="/login"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-sm"
            >
              Get Started
            </a>
            <a
              href="/login/superadmin"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
            >
              Register University
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* Hero Section */}
        <section className="text-center space-y-8 pt-8">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-xs">
              Trusted by 50+ Institutions
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              One Platform For All<br />Student Achievements
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A centralized digital ecosystem where students store, track, 
              and showcase verified academic and co-curricular achievements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a
              href="/login"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-sm"
            >
              Start Your Journey
            </a>
            <a
              href="#features"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
            >
              Explore Features
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-gray-600 text-sm">Active Students</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600 text-sm">Institutions</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">100K+</div>
              <div className="text-gray-600 text-sm">Achievements</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">99%</div>
              <div className="text-gray-600 text-sm">Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need in One Place
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform designed for modern education needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Portfolio</h3>
              <p className="text-gray-600 text-sm">
                Students upload certificates, events, internships, and achievements — all verified and organized.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-cyan-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Faculty Verification</h3>
              <p className="text-gray-600 text-sm">
                Faculty members validate submissions in real-time to maintain authenticity and credibility.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accreditation Ready</h3>
              <p className="text-gray-600 text-sm">
                Generate comprehensive reports for NAAC, NIRF, AICTE with just a few clicks.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="bg-gray-50 rounded-2xl p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Transforming Education Management
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">For Students</h4>
                  <p className="text-gray-600 text-sm">Build a verified digital profile that stands out to employers</p>
                </div>
                
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">For Institutions</h4>
                  <p className="text-gray-600 text-sm">Reduce paperwork and manual tracking by 80%</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">For Faculty</h4>
                  <p className="text-gray-600 text-sm">Real-time visibility into student progress and achievements</p>
                </div>
                
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">For Accreditation</h4>
                  <p className="text-gray-600 text-sm">Structured, verifiable data ready for all accreditation processes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-gray-600">
              Join thousands of institutions using Smart Student Hub to streamline achievement management.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/login"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-sm"
            >
              Get Started Now
            </a>
            <a
              href="/demo"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
            >
              Schedule Demo
            </a>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Smart Student Hub</div>
                <div className="text-gray-600 text-sm">Empowering Education Digitally</div>
              </div>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition text-sm">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition text-sm">Terms</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition text-sm">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Smart Student Hub. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}