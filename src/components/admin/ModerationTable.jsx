import BanButton from "./BanButton";
import WarnButton from "./WarnButton";
import ResolveButton from "./ResolveButton";
import RestrictButton from "./RestrictButton";

export default function ModerationTable({ users, flaggedIds = [] }) {
  if (!users || users.length === 0) {
    return (
      <div className="p-10 text-center bg-gray-50 border border-dashed rounded-xl">
        <p className="text-gray-400 font-medium">No community members found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">
                    {user.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-gray-400">
                {user.clerk_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {" "}
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
              <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                {flaggedIds.includes(user.clerk_id) && (
                  <ResolveButton userId={user.clerk_id} />
                )}
                <WarnButton userId={user.clerk_id} />
                <BanButton userId={user.clerk_id} isBanned={user.is_banned} />
                <RestrictButton userId={user.clerk_id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
