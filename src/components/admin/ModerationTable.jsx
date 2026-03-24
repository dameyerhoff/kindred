import BanButton from "./BanButton";

// This builds the table that shows all the members to the admin
export default function ModerationTable({ users }) {
  // If there are no people in the list, show this empty box message
  if (!users || users.length === 0) {
    return (
      <div className="p-10 text-center bg-gray-50 border border-dashed rounded-xl">
        <p className="text-gray-400 font-medium">No community members found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* This is the start of the big list of members */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* These are the labels at the top of the table columns */}
            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">
              User Details
            </th>
            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">
              User Id
            </th>
            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {/* This part loops through every person and makes a row for them */}
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  {/* Shows the person name and their email address */}
                  <span className="text-sm font-bold text-gray-900">
                    {user.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Shows the special computer code ID for each person */}
                <code className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
                  {user.clerk_id}
                </code>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Shows a red box if they are banned or a green box if they are active */}
                {user.is_banned ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700">
                    Banned
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700">
                    Active
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {/* This is the button that lets the admin ban or unban the person */}
                <BanButton userId={user.clerk_id} isBanned={user.is_banned} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
