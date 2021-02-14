import Layout from "../../../components/Layout";
import axios from "axios";
import withAdmin from "../../withAdmin";
import Link from "next/link";

const Users = ({ users, token }) => {
  const deleteUser = () => {};
  return (
    <Layout>
      <h1>Lista użytkowników</h1>
      <br />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Imię</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={`user-${index}`}>
              <th>{index}</th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Link href={`/admin/users/delete/${user.salt}`}>
                  <a className="btn btn-danger">Usuń</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Users;

export const getServerSideProps = withAdmin(async ({ token }) => {
  let data;

  try {
    const response = await axios.get(`${process.env.API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    data = response.data;
  } catch (error) {
    throw new Error("Something went wrong when downloading users.");
  }

  return {
    props: {
      users: data,
    },
  };
});
