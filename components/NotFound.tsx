import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1120] flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(99,102,241,0.15)] p-10 md:p-12 text-center">

          {/* Icon */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/20">

            <SearchX
              size={48}
              className="text-indigo-300"
            />

          </div>

          {/* 404 */}
          <h1 className="mt-6 bg-gradient-to-r from-indigo-300 via-violet-300 to-blue-300 bg-clip-text text-7xl font-extrabold text-transparent">
            404
          </h1>

          <h2 className="mt-5 text-3xl font-bold text-white">
            Page Not Found
          </h2>

          <p className="mt-6 text-gray-400 leading-7">
            Oops! We couldn't find the page you're looking for.
            <br />
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <Link
            to="/"
            className="mt-12 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            Return Home
          </Link>

        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Continue your learning journey with SkillVerse.
        </p>

      </div>
    </div>
  );
};

export default NotFound;