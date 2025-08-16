import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#1a1a40] via-[#3a0ca3] to-[#7209b7] text-white pt-16 pb-10 px-4 lg:px-8">
      <div className="max-w-[1580px] lg:flex lg:justify-between mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

       
        <div>
          <h2 className="text-xl font-semibold mb-4 text-pink-300">Pages</h2>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              <Link to="/" className="hover:text-pink-400 transition-all duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-articles" className="hover:text-pink-400 transition-all duration-300">
                All Articles
              </Link>
            </li>
            <li>
              <Link to="/myArticle" className="hover:text-pink-400 transition-all duration-300">
                My Articles
              </Link>
            </li>
            <li>
              <Link to="/add-article" className="hover:text-pink-400 transition-all duration-300">
                Add Article
              </Link>
            </li>
          </ul>
        </div>

      
        <div>
          <h2 className="text-xl font-semibold mb-4 text-pink-300">Subscription</h2>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              <Link to="/subscription" className="hover:text-pink-400 transition-all duration-300">
                Subscription
              </Link>
            </li>
            <li>
              <Link to="/premium-articles" className="hover:text-pink-400 transition-all duration-300">
                Premium Articles
              </Link>
            </li>
          </ul>
        </div>

     
        <div>
          <h2 className="text-xl font-semibold mb-4 text-pink-300">Company</h2>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              <Link to="/learnMore" className="hover:text-pink-400 transition-all duration-300">
                About Us
              </Link>
            </li>
            
            <li>
              <Link to="/admin" className="hover:text-pink-400 transition-all duration-300">
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        {/* <div>
          <h2 className="text-xl font-semibold mb-4 text-pink-300">Newsletter</h2>
          <p className="text-sm text-white/80 mb-4">
            Stay updated with the latest news and stories from NewsHub.
          </p>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg">
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full py-2 pl-4 pr-32 rounded-full text-white bg-white/20 placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button className="absolute top-0 right-0 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full rounded-l-none transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Copyright */}
      <div className="mt-16 text-center text-sm text-white/70">
        © {new Date().getFullYear()} <span className="font-semibold text-pink-300">NewsHub</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
