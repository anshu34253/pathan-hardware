import { useNavigate } from 'react-router';
import { Phone, Mail, MapPin, Clock, Package, Hammer, Building2, Wrench, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function LandingPage() {
  const navigate = useNavigate();

  const productCategories = [
    {
      icon: Building2,
      name: 'Cement',
      description: 'Premium quality cement from top brands',
      image: '/images/cement.jpg',
    },
    {
      icon: Wrench,
      name: 'Steel & Iron',
      description: 'TMT bars, angles, and structural steel',
      image: 'https://images.unsplash.com/photo-1755943807913-5f999c562f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMHBpcGVzJTIwY29uc3RydWN0aW9uJTIwc2l0ZXxlbnwxfHx8fDE3NzM1NTU4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Package,
      name: 'Bricks & Blocks',
      description: 'Clay bricks, concrete blocks, and tiles',
      image: 'https://images.unsplash.com/photo-1755288271423-462a0808deb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHMlMjBjZW1lbnQlMjBicmlja3N8ZW58MXx8fHwxNzczNTU1ODg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Building2,
      name: 'Sand & Aggregates',
      description: 'River sand, M-sand, and crushed stone',
      image: '/images/sand.jpg',
    },
    {
      icon: Wrench,
      name: 'Pipes & Fittings',
      description: 'PVC, CPVC, and GI pipes with fittings',
      image: '/images/pipe.jpg',
    },
    {
      icon: Hammer,
      name: 'Hardware Tools',
      description: 'Hand tools, power tools, and accessories',
      image: '/images/store.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-900 dark:text-blue-400 mr-2" />
              <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400">
                Pathan Hardware
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400">
                Home
              </a>
              <a href="#products" className="text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400">
                Products
              </a>
              <a href="#about" className="text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400">
                About
              </a>
              <a href="#contact" className="text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400">
                Contact
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/select-login')}
                className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-900 to-blue-700 dark:from-blue-950 dark:to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Your Trusted Partner for Quality Building Materials
              </h2>
              <p className="text-xl text-blue-100 dark:text-slate-300 mb-8">
                Serving the construction industry with premium quality materials, competitive pricing, and reliable service since 1995.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => navigate('/customer-login')}
                  className="bg-orange-600 hover:bg-orange-700 text-white h-12 px-6 text-lg"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-12 px-6 text-lg"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="relative h-80 lg:h-96">
              <ImageWithFallback
                src="/images/store.jpg"
                alt="Construction warehouse"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="products" className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Our Product Categories
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We offer a comprehensive range of building materials for all your construction needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-900 dark:text-blue-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        {category.name}
                      </h4>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                About Pathan Hardware & Building Materials
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                With over 25 years of experience in the building materials industry, we have established ourselves as a trusted supplier for contractors, builders, and individual homeowners.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Our commitment to quality, competitive pricing, and exceptional customer service has made us the preferred choice for construction projects of all sizes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-1">25+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Years Experience</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-1">5000+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative h-96">
              <ImageWithFallback
                src="/images/store.jpg"
                alt="Hardware store"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Visit Us or Get in Touch
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We're here to help with all your building material needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-blue-900 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Address</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  123 Main Road, Near by bank of india<br />
                  Sindi(rly), Maharashtra 442105
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-green-700 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Phone</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  +91 91563 42893<br />
                
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Email</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  info@pathanhardware.com<br />
                  
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Hours</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Mon - Sat: 8:00 AM - 8:00 PM<br />
                  Sunday: 9:00 AM - 2:00 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="w-8 h-8 text-blue-400 mr-2" />
                <h4 className="text-xl font-bold">Pathan Hardware</h4>
              </div>
              <p className="text-slate-400">
                Your Trusted Partner for Quality Building Materials
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#home" className="hover:text-blue-400">Home</a></li>
                <li><a href="#products" className="hover:text-blue-400">Products</a></li>
                <li><a href="#about" className="hover:text-blue-400">About</a></li>
                <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-slate-400">
                <li>123 Main Road, Mumbai</li>
                <li>+91 98765 43210</li>
                <li>info@pathanhardware.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2026 Pathan Hardware & Building Materials. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
