import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const LearnMoreAbout = () => {
  return (
    <div className="min-h-screen  py-12 px-4">

 <Helmet>
              <title>About | NewsHub</title>
              <meta name="description" content="Learn more about MyApp and what we do." />
              <meta property="og:title" content="About Us - MyApp" />
            </Helmet>



      <div className="max-w-[1580px] mx-auto">
       
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">About NewsHub</h1>
          <p className="text-xl text-blue-600 max-w-3xl mx-auto">
            Your trusted source for breaking news, in-depth analysis, and diverse perspectives from around the world.
          </p>
        </div>

       
        <div className="rounded-xl  mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Our Mission"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Mission</h2>
              <p className="mb-4 text-blue-600 text-lg">
                At NewsHub, we believe in the power of information to transform lives and societies. Our mission is to deliver accurate, timely, and diverse news coverage that keeps you informed and empowered.
              </p>
              <p className="text-lg text-blue-600">
                We strive to cut through the noise and provide journalism that matters - stories that inform, educate, and inspire action.
              </p>
            </div>
          </div>
        </div>

       
        <div className="mb-16">
          <h2 className="text-3xl text-blue-600 font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1  md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Truth & Accuracy",
                description: "We're committed to factual reporting and rigorous fact-checking to ensure our readers get reliable information."
              },
              {
                icon: "🌍",
                title: "Diverse Perspectives",
                description: "We showcase voices from all walks of life to provide a complete picture of every story."
              },
              {
                icon: "⚖️",
                title: "Journalistic Integrity",
                description: "We maintain the highest ethical standards in our reporting and operations."
              }
            ].map((value, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body items-center text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      
        <div className="mb-16 rounded-xl py-8 ">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Our Publishing Process</h2>
          <div className="grid grid-cols-1 text-blue-600 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Research",
                description: "Thorough investigation and source verification"
              },
              {
                step: "2",
                title: "Writing",
                description: "Clear, concise, and engaging storytelling"
              },
              {
                step: "3",
                title: "Editing",
                description: "Multiple layers of editorial review"
              },
              {
                step: "4",
                title: "Fact-Check",
                description: "Dedicated team verifies every claim"
              }
            ].map((process, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{process.title}</h3>
                <p className=" text-blue-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>

      
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Global Coverage</h2>
          <div className=" rounded-xl py-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80"
                  alt="Global Coverage"
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div className="md:w-1/2">
                <p className="mb-4 text-blue-600 text-lg">
                  With correspondents in over 30 countries, we bring you stories from every corner of the globe. Our international network ensures you get local perspectives on global events.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">🌐</span>
                    <span className="text-blue-600">24/7 news coverage across all time zones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">🗣️</span>
                    <span className="text-blue-600">Multilingual reporting team</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">📡</span>
                    <span className="text-blue-600">Real-time updates from major world events</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

    
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-12">Our Story</h2>
          <div className="relative">
    
            <div className="absolute left-1/2 h-full w-1 bg-primary transform -translate-x-1/2 hidden md:block"></div>
            
        
            <div className="space-y-8 md:space-y-16">
              {[
                {
                  year: "2018",
                  event: "Founded by a group of journalists frustrated with media bias",
                  side: "left"
                },
                {
                  year: "2019",
                  event: "Launched our first digital platform with 10 team members",
                  side: "right"
                },
                {
                  year: "2020",
                  event: "Won 'Best New Media Outlet' award for investigative reporting",
                  side: "left"
                },
                {
                  year: "2022",
                  event: "Expanded to international coverage with correspondents in 15 countries",
                  side: "right"
                },
                {
                  year: "2023",
                  event: "Reached 5 million monthly readers across all platforms",
                  side: "left"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`relative flex ${item.side === 'left' ? 'md:justify-start' : 'md:justify-end'}`}
                >
                  <div className={`w-full md:w-1/2 p-4 ${item.side === 'left' ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                    <div className="bg-base-200 rounded-xl p-6 shadow-md">
                      <h3 className="font-bold text-xl text-primary mb-2">{item.year}</h3>
                      <p className="text-gray-700">{item.event}</p>
                    </div>
                  </div>
            
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 md:hidden"></div>
          
                  <div className={`absolute top-1/2 w-4 h-4 bg-primary rounded-full transform -translate-y-1/2 hidden md:block ${
                    item.side === 'left' ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

     
        <div className="mb-16  rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Awards & Recognition</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                award: "🏆 2023 Excellence in Journalism",
                description: "Recognized for our investigative series on climate change"
              },
              {
                award: "📰 2022 Best Digital News Platform",
                description: "Awarded by the International Press Association"
              },
              {
                award: "🌟 2021 Innovation in Media",
                description: "For our interactive data journalism features"
              }
            ].map((item, index) => (
              <div key={index} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h3 className="card-title text-xl">{item.award}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      
        <div className="bg-primary text-primary-content rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="mb-6 text-lg max-w-2xl mx-auto">
            Stay informed with NewsHub's trusted journalism. Subscribe to our newsletter for daily updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/subscription" className="btn btn-secondary">
              Subscribe Now
            </Link>
            <Link to="/request-publisher" className="btn btn-outline btn-primary-content">
              Request To Be a Publisher
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMoreAbout;