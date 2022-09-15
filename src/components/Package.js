import React from "react";
import { renderRichText } from "gatsby-source-contentful/rich-text";

import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";

export default function Package({ packageCard }) {
  const website_url = "https://www.lushfulaesthetics.com/";

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => (
        <span className="font-sans font-bold lg:text-lg mb-1">{text}</span>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p
          className={`"font-serif" ${
            children[0] === "What you get:" ? "mt-4" : ""
          }`}
        >
          {children}
        </p>
      ),
      [INLINES.HYPERLINK]: ({ data }, children) => (
        <a
          className="underline "
          href={data.uri ? data.uri : ""}
          target={`${
            data.uri.startsWith(website_url || "http://localhost:8000/")
              ? "_self"
              : "_blank"
          }`}
          rel={`${
            data.uri.startsWith(website_url) ? "" : "noopener noreferrer"
          }`}
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <>
      <div className="py-2 max-w-6xl m-auto p-auto">
        <div className="bg-main-green px-12 py-8 rounded-lg">
          <div className="flex flex-row justify-between items-baseline">
            <h2 className="font-serif font-bold text-2xl">
              {packageCard.packageTitle}
            </h2>
            <h2 className="font-serif font-bold text-lg">
              {packageCard.packagePrice}
            </h2>
          </div>
          <hr className="my-4 border-black" />
          <div className="font-serif font-bold ">
            {renderRichText(packageCard.description, options)}
          </div>
          <div className="ml-8 font-sans font-light italic">
            {renderRichText(packageCard.includesTheseServices, options)}
          </div>
        </div>
      </div>
    </>
  );
}
