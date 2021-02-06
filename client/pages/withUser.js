import axios from "axios";
import { getCookie } from "../helpers/auth";

const withUser = (callback) => async (context) => {
  const token = getCookie("token", context.req);

  let user = null;

  try {
    const response = await axios.get(`${process.env.API}/user`, {
      headers: {
        authorization: `Bearer ${token}`,
        contentType: "application/json",
      },
    });

    user = response.data;
  } catch (error) {
    if (error.response.status === 401) {
      user = null;
    }
  }

  const props = callback ? await callback(context, { user }) : {};

  if (user === null) {
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
        user,
      },
    };
  }
};

export default withUser;
