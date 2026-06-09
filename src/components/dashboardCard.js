export default function DashboardCard({
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <button
        onClick={onClick}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 self-start"
      >
        {buttonText}
      </button>
    </div>
  );
}
