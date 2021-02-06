import axios from "axios";
import { getCookie } from "../helpers/auth";

const withAdmin = (callback) => async (context) => {
  const token = getCookie("token", context.req);

  let admin = null;

  try {
    const response = await axios.get(`${process.env.API}/admin`, {
      headers: {
        authorization: `Bearer ${token}`,
        contentType: "application/json",
      },
    });

    admin = response.data;
  } catch (error) {
    if (error.response.status === 401) {
      admin = null;
    }
  }

  const props = callback ? await callback({ context, token }, { admin }) : {};

  if (admin === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        ...props.props,
        token,
        admin,
      },
    };
  }
};

export default withAdmin;
