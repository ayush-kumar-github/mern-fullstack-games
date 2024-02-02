import React from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ListUserScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const deleteHandler = async (id) => {
    if (window.confirm("are you sure?")) {
      try {
        await deleteUser(id);
        toast.success("user deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div>
      <div className="p-14">
        <h2 className="font-bold text-xl">user list</h2>
        <table>
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Admin</th>
              <th className="px-4 py-2">email</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user._id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">
                  {user.isAdmin ? "yes" : "no"}
                </td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <Link to={`/admin/user/${user._id}/edit`}>✏️</Link>
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => deleteHandler(user._id)}> 🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListUserScreen;
