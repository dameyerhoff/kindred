"use client";

export default function ErrorState({
  error,
  reset,
  message = "Oopsie, something went wrong.",
}) {
  return (
    <div className="flex flex-col items center justify-center min-h-[400px] p-g text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2"> Oopsie!</h2>
      <p className="text-gray-600 mb-6">{message || error?.message}</p>
      <button
        onClick={() => reset()}
        className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all font-medium"
      >
        Try again?
      </button>
    </div>
  );
}
