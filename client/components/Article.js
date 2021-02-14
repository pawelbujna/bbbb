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
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">{data.name}</h3>
          <p className="card-subtitle">
            <small className="text-muted">{formatDate(data.createdAt)}</small>
          </p>
        </div>
        <div className="card-body">
          <div className="card-text">{Parser(data.content)}</div>
        </div>

        {data.files.length > 0 && (
          <ul className="list-group list-group-flush">
            {data.files.map((file, index) => (
              <a
                href={file.url}
                target="_blank"
                key={index}
                className="list-group-item"
              >
                {file.key}
              </a>
            ))}
          </ul>
        )}

        {isAuth() && isAuth()?.role === "admin" && (
          <div className="card-footer">
            <Link href={`/admin/article/delete/${data.slug}`}>
              <a className="btn btn-danger btn-sm float-right">
                Usuń ogłoszenie
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Article;
