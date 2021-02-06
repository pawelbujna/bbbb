import Parser from "html-react-parser";
import Link from "next/link";

import { isAuth } from "../helpers/auth";

const Article = ({ data }) => {
  const formatDate = (date) =>
    new Date(`${date}`).toLocaleTimeString(["pl-PL"], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      {isAuth() && isAuth()?.role === "admin" && (
        <div className="row">
          <div className="col-md-12">
            <Link href={`/admin/article/${data.slug}`}>
              <a class="btn btn-primary ml-1">
                <i class="bi bi-pencil"></i>
              </a>
            </Link>

            <button type="button" class="btn btn-danger ml-auto">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 mb-3 p-3 border">
        <div className="row">
          <div className="col-md-12 p-2">
            <h2>{data.name}</h2>
          </div>
          <div className="col-md-12 p-2">
            {Parser(data.content)}

            <div>
              <small className="text-muted">{formatDate(data.createdAt)}</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Article;
