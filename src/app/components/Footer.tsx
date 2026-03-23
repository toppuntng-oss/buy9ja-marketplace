export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h4 className="font-semibold mb-3 text-green-600">Buy9ja</h4>
            <p className="text-sm text-gray-600">
              Your favorite Nigerian food delivery app. Fast, reliable, and
              delicious food from the best local restaurants.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-green-600 transition-colors">
                  Restaurants
                </a>
              </li>
              <li>
                <a
                  href="/orders"
                  className="hover:text-green-600 transition-colors"
                >
                  My Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>📍 Enugu, Nigeria</li>
              <li>📧 support@buy9ja.com</li>
              <li>📱 +234 XXX XXX XXXX</li>
              <li className="pt-2">
                <span className="text-xs text-gray-500">
                  Powered by Paystack
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          <p>
            &copy; {currentYear} Buy9ja. All rights reserved. Made with ❤️ in
            Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}

