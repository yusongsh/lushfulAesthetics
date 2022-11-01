import React from "react";
import { graphql } from "gatsby";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import { Helmet } from "react-helmet";

export { Head } from "../components/Layout";

export default function HIPAAPolicy({
  data: { allContentfulHipaaPolicyPage },
}) {
  const website_url = "https://www.lushfulaesthetics.com/";

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => (
        <span className="font-sans font-bold lg:text-lg mb-1">{text}</span>
      ),
    },
    renderNode: {
      [BLOCKS.DOCUMENT]: (node, children) => (
        <div className="px-4 py-16 sm:px-6 lg:px-24 lg:py-8 xl:py-12">
          {children}
        </div>
      ),
      [BLOCKS.HEADING_1]: (node, children) => (
        <h1 className="font-serif font-bold text-3xl mb-6">{children}</h1>
      ),
      [BLOCKS.HEADING_5]: (node, children) => (
        <h5 className="font-sans font-bold text-lg my-4">{children}</h5>
      ),
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className="font-serif py-2">{children}</p>
      ),
      [BLOCKS.LIST_ITEM]: (node, children) => (
        <li className="font-sans list-none px-8">{children}</li>
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
      <Helmet title={`Lushful Aesthetics | HIPAA`} />
      {renderRichText(
        allContentfulHipaaPolicyPage.edges[0].node.content,
        options
      )}
    </>
  );
}

export const pageQuery = graphql`
  query HipaaPolicyQuery($pageId: String!) {
    allContentfulHipaaPolicyPage(limit: 1, filter: { id: { eq: $pageId } }) {
      edges {
        node {
          content {
            raw
          }
        }
      }
    }
  }
`;
