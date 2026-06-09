import Link from "next/link";

export default function Confirmed() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-10 text-center max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Email Confirmed!
        </h1>
        <p className="text-gray-700 mb-6">
          Your account has been successfully verified. You can now sign in and
          access your dashboard.
        </p>

        <Link
          href="/auth/signin"
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
