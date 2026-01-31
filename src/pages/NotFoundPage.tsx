import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">
        Seite nicht gefunden
      </h2>
      <p className="mt-2 text-gray-600">
        Die angeforderte Seite existiert nicht oder wurde verschoben.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Zur Startseite
      </Link>
    </div>
  );
}
