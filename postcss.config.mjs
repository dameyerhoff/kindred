const config = {
  /* This is the configuration for PostCSS, which is a tool that 
     processes your CSS after you've written it */
  plugins: {
    /* This tells the computer to use the Tailwind CSS engine 
       to turn your special utility classes into real CSS for the browser */
    "@tailwindcss/postcss": {},
  },
};

// This sends the configuration out so your styling system can use it
export default config;
