Welcome to Kindred! We dreamt of a society that was connected, one where you could help your neighbours out and receive help in return. Thus, kindred was born! It's a site where you post what you want help with, and people can respond; and you can look at what other people posted and offer your assistance there. This can be a one off, or a regular occurance, that's up to you. Just go out, spread kindness, because we're better together.

The project uses Next.js, Tailwind CSS, Motion (Framer), and Radix-ui; it also uses Clerk for authetication. The data is stored in a Postgres database via Supabase, which is accessed using SQL queries and the Supabase Client.

Setup Instructions to help keep the Kindred spirit going:

Get the code. Fork this repository on Github - ensuring that "Copy the main branch only" is ticked. Open your terminal and create a folder for the project if you haven't already set one up: mkdir my-projects cd my-projects

Clone your fork to your computer using your terminal git clone [YOUR_FORK_URL] Enter the project cd [NAME_OF_YOUR_REPO Open in VS Code code . Open the VS Code terminal and run npm install

Environment Variables. Create a new file in the main folder called .env.local NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= (Find this in your Clerk Dashboard > API Keys) CLERK_SECRET_KEY= (Find this in your Clerk Dashboard > API Keys) NEXT_PUBLIC_SUPABASE_URL= (Find this in Supabase > Project Settings > API) NEXT_PUBLIC_SUPABASE_ANON_KEY= (Find this in Supabase > Project Settings > API) DATABASE_URL= (The connection string from Supabase > Project Settings > Database)

Build the Database Schema Copy all of the code from the schema.sql file in this project, Open Supabase and go to the SQL editor. Paste it into the editor and hit Run. If it says “Success then your tables are now best friends, just like ours are.

Connect VS Code to Supabase if you’re using the extension instead Install the extension by searching for it in the VS Code Extensions sidebar and click Install. Open the Sidebar: Click the Supabase Logo that appeared in your left-hand sidebar. Link your project: Click the “Link Project” button. A box will appear at the top of your screen asking for two things: Project Ref: Go to your Supabase Dashboard -> Project Settings -> General. Look for “Reference ID” – You want a string of random letters and numbers. Anon API Key: Go to Project Settings -> API. Copy the key labelled anon public. When you’ve copied and pasted both your Project Ref and your Anon API key into the box, hit enter. If the sidebar suddenly filles up with your table names then it was successful.

Let the fun commence! In your VS Code Terminal, type npm run dev. Open the localhost address it gives you in your browser. If you see the kindred homepage, you’ve done it!
