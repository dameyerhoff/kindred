"use client";

// This builds a reusable box that shows up if a single part of the site fails
export default function ErrorState({
  error,
  reset,
  message = "Oopsie, something went wrong.",
}) {
  return (
    // This part centers the error message and the try again button
    <div className="flex flex-col items center justify-center min-h-[400px] p-g text-center">
      {/* This is the main title of the error box */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2"> Oopsie!</h2>
      {/* This shows the specific reason why the error happened */}
      <p className="text-gray-600 mb-6">{message || error?.message}</p>
      {/* This button tells the computer to try loading the section again */}
      <button
        onClick={() => reset()}
        className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all font-medium"
      >
        Try again?
      </button>
    </div>
  );
}
