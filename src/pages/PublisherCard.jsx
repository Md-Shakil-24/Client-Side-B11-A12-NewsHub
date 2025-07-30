import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const PublisherCard = ({ publisher }) => {
  return (
    <Link to={`/all-articles?publisher=${encodeURIComponent(publisher.name)}`}>
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">

 <Helmet>
              <title>PublisherCards | NewsHub</title>
              <meta name="description" content="Learn more about MyApp and what we do." />
              <meta property="og:title" content="About Us - MyApp" />
            </Helmet>


        <figure className="px-10 pt-10">
          <img
            src={publisher.logo}
            alt={publisher.name}
            className="rounded-xl h-24 object-contain"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{publisher.name}</h2>
        </div>
      </div>
    </Link>
  );
};

export default PublisherCard;