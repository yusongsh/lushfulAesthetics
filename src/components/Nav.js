import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Button from "./BookBtn";
import { useStaticQuery, graphql, Link } from "gatsby";
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image";
import Logo from "../images/lushful-aesthetic-logo-side.svg";
import _ from "lodash";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    contentfulServicesMenu: {
      aestheticServices,
      sexualEnhancementServices,
      bookNowLinkReference: { bookNowLink },
      slugDictionaries,
    },
  } = useStaticQuery(graphql`
    query NavQuery {
      site {
        siteMetadata {
          title
        }
      }
      contentfulServicesMenu {
        aestheticServices {
          ... on ContentfulPackagePage {
            packagePageTitle
            slug
          }
          ... on ContentfulServicePage {
            serviceTitle
            slug
          }
        }
        sexualEnhancementServices {
          ... on ContentfulPackagePage {
            slug
            packagePageTitle
          }
          ... on ContentfulServicePage {
            slug
            serviceTitle
          }
        }
        bookNowLinkReference {
          bookNowLink
        }
        slugDictionaries {
          slugTitle
          slug
        }
      }
    }
  `);

  useEffect(() => {
    class Node {
      constructor(slug, title) {
        this.slug = slug;
        this.title = title;
        this.children = [];
      }
    }

    class ServicesTree {
      constructor() {
        this.slug = "services";
        this.title = "Services";
        this.children = [];
      }
      get completeMenu() {
        return this.children;
      }
      add(arr, service) {
        let count = 0;
        while (count < arr.length) {
          let current = this;
          for (let i = 0; i < arr.length; i++) {
            let found = current.children.find((node) => node.slug === arr[i]);

            if (!found) {
              let slugDictionary = slugDictionaries.find(
                (definition) => definition.slug === arr[i]
              )?.slugTitle;
              if (!slugDictionary) {
                slugDictionary =
                  service.serviceTitle || service.packagePageTitle;
              }
              let newNode = new Node(arr[i], slugDictionary);
              current.children.push(newNode);
              current = newNode;
            } else {
              current = found;
            }

            count++;
          }
        }
      }
    }

    let menuTree = new ServicesTree();

    aestheticServices
      .map((service) => service.slug.split("/"))
      .forEach((arr, i) => menuTree.add(arr, aestheticServices[i]));

    sexualEnhancementServices
      .map((service) => service.slug.split("/"))
      .forEach((arr, i) => menuTree.add(arr, sexualEnhancementServices[i]));

    setMenuItems(menuTree);
  }, []);

  // console.log(menuItems);
  return (
    <div>
      <nav className="bg-white">
        <div className="flex justify-between items-center px-4 py-4 d:px-12 lg:px-24">
          <div className="w-48 lg:w-60 py-auto">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center justify-end h-16">
            <div className="flex justify-end items-center">
              <div className="hidden md:block ">
                <div className="flex items-baseline space-x-4">
                  <div className="group z-50">
                    <button className="group-hover:text-main-green px-4 py-4 rounded-md text-base md:text-lg font-medium uppercase ">
                      Services
                    </button>
                    <div className="hidden pointer-events-auto group- group-hover:flex flex-col absolute left-0 pl-20 p-10 w-full shadow-md bg-main-green text-main-green-shade duration-300">
                      <div className="flex flex-row gap-10 ">
                        {menuItems &&
                          menuItems.children.map((service) => {
                            return (
                              <div
                                className="flex flex-col ml-20"
                                key={service.slug}
                              >
                                <h3 className="mb-2 text-lg font-bold ">
                                  {service.title}
                                </h3>
                                <div
                                  className={`flex ${
                                    service.slug ===
                                      "sexual-enhancement-services" &&
                                    "flex-col"
                                  }`}
                                >
                                  {service.children.map((serviceCategory) => (
                                    <div>
                                      {serviceCategory.children.length ? (
                                        <div className="flex flex-col">
                                          <h4
                                            className="mb-2 text-lg"
                                            key={`${serviceCategory.slug}`}
                                          >
                                            {serviceCategory.title}
                                          </h4>
                                          <div className="flex flex-col">
                                            {serviceCategory.children.map(
                                              (serviceSubCategory) => (
                                                <>
                                                  {serviceSubCategory.children
                                                    .length ? (
                                                    <>
                                                      <h5
                                                        className=""
                                                        key={`${serviceSubCategory.slug}`}
                                                      >
                                                        {
                                                          serviceSubCategory.title
                                                        }
                                                      </h5>
                                                      {serviceSubCategory.children.map(
                                                        (lowestservice) => (
                                                          <Link
                                                            to={`/${service.slug}/${serviceCategory.slug}/${serviceSubCategory.slug}/${lowestservice.slug}`}
                                                            className="hover:text-white ml-6"
                                                          >
                                                            {
                                                              lowestservice.title
                                                            }
                                                          </Link>
                                                        )
                                                      )}
                                                    </>
                                                  ) : (
                                                    <Link
                                                      to={`/${service.slug}/${serviceCategory.slug}/${serviceSubCategory.slug}`}
                                                      className="hover:text-white"
                                                    >
                                                      {serviceSubCategory.title}
                                                    </Link>
                                                  )}
                                                </>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        <Link
                                          to={`/${service.slug}/${serviceCategory.slug}`}
                                          className="hover:text-white "
                                        >
                                          <div className="flex flex-col">
                                            {serviceCategory.title}
                                          </div>
                                        </Link>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/about"
                    className=" text-black hover:text-main-green px-3 py-2 rounded-md text-base lg:text-lg font-medium uppercase"
                  >
                    About
                  </Link>

                  <Link
                    to="/contact"
                    className=" text-black hover:text-main-green px-3 py-2 rounded-md text-base md:text-lg font-medium uppercase"
                  >
                    Contact
                  </Link>

                  <Link
                    to="/financing"
                    className=" text-black hover:text-main-green px-3 py-2 rounded-md text-base md:text-lg font-medium uppercase"
                  >
                    Financing
                  </Link>
                </div>
              </div>
            </div>
            <div className="mx-4 my-4">
              <Button />
            </div>
            <div className="-mr-2 flex md:hidden z-1000">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-main-green inline-flex items-center justify-center p-3 rounded text-white hover:bg-main-green-shade"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div
              className="md:hidden"
              id="mobile-menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div
                ref={ref}
                className="px-2 py-16 space-y-1 sm:px-3 bg-main-green flex flex-col h-screen"
              >
                {/* <Link
                  to="/services"
                  className=" text-white hover:text-main-green-shade px-6 py-6 rounded-md text-base md:text-lg font-medium uppercase"
                >
                  Services
                </Link> */}

                <div className="group">
                  <button className="text-white group-hover:text-main-green-shade px-6 py-3 rounded-md text-base md:text-lg font-medium uppercase ">
                    Services
                  </button>
                  <div className="z-1000 group-hover:flex flex-col left-0 pl-8 w-full bg-main-green text-black duration-300">
                    <div className="flex flex-col">
                      {menuItems &&
                        menuItems.children.map((service) => {
                          return (
                            <div className="flex flex-col" key={service.slug}>
                              <h3 className="text-lg py-4 font-serif font-medium">
                                {service.title}
                              </h3>
                              {service.children.map((serviceCategory) => (
                                <>
                                  {serviceCategory.children.length ? (
                                    <>
                                      <h4
                                        className="my-2 text-lg"
                                        key={`${serviceCategory.slug}`}
                                      >
                                        {serviceCategory.title}
                                      </h4>
                                      {serviceCategory.children.map(
                                        (serviceSubCategory) => (
                                          <>
                                            {serviceSubCategory.children
                                              .length ? (
                                              <>
                                                <h5
                                                  className="ml-6 font-bold "
                                                  key={`${serviceSubCategory.slug}`}
                                                >
                                                  {`Fillers`}
                                                  {/* {serviceSubCategory.title} */}
                                                </h5>
                                                {serviceSubCategory.children.map(
                                                  (lowestservice) => (
                                                    <Link
                                                      to={`/${service.slug}/${serviceCategory.slug}/${serviceSubCategory.slug}/${lowestservice.slug}`}
                                                      className="hover:text-white ml-12  "
                                                    >
                                                      {serviceSubCategory.title}
                                                    </Link>
                                                  )
                                                )}
                                              </>
                                            ) : (
                                              <Link
                                                to={`/${service.slug}/${serviceCategory.slug}/${serviceSubCategory.slug}`}
                                                className="hover:text-white ml-6"
                                              >
                                                {serviceSubCategory.title}
                                              </Link>
                                            )}
                                          </>
                                        )
                                      )}
                                    </>
                                  ) : (
                                    <Link
                                      to={`/${service.slug}/${serviceCategory.slug}`}
                                      className="hover:text-white"
                                    >
                                      {serviceCategory.title}
                                    </Link>
                                  )}
                                </>
                              ))}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <Link
                  to="/about"
                  className=" text-white hover:text-main-green-shade px-6 py-6 rounded-md text-base md:text-lg font-medium uppercase"
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  className=" text-white hover:text-main-green-shade px-6 py-6 rounded-md text-base md:text-lg font-medium uppercase"
                >
                  Contact Us
                </Link>

                <Link
                  to="/financing"
                  className=" text-white hover:text-main-green-shade px-6 py-6 rounded-md text-base md:text-lg font-medium uppercase"
                >
                  Financing
                </Link>

                <div>
                  <div className="flex flex-row justify-center pt-12 md:pb-16 text-white">
                    <a
                      href="https://twitter.com/LushfulAesth"
                      target="_blank"
                      rel="noreferrer"
                      className="mr-4 mb-4"
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                      <span className="sr-only">Twitter page</span>
                    </a>
                    <a
                      href="https://www.instagram.com/lushfulaesthetics/?hl=en"
                      target="_blank"
                      rel="noreferrer"
                      className="mr-4 mb-4"
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Instagram page</span>
                    </a>
                    <a
                      href="/tiktop.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-base md:text-lg mb-4"
                    >
                      TikTok
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Transition>

        {/* TESTING HOVER DROPDOWN MENU DOWNHERE!!! */}
        {/* <div className="group z-500">
          <button className="group-hover:text-main-green px-6 py-6 rounded-md text-base md:text-lg font-medium uppercase ">
            Services
          </button>
          <div className=" hidden group-hover:flex flex-col absolute left-0 pl-20 p-10 w-full shadow-md bg-main-green text-white  duration-300">
            <div className="grid grid-cols-2 gap-20">
              {menuItems &&
                menuItems.children.map((service) => {
                  return (
                    <div className="flex flex-col" key={service.slug}>
                      <h3 className="mb-2 font-bold text-main-green-shade border-b-2 border-main-green-shade pb-2 uppercase tracking-wide">
                        {service.title}
                      </h3>
                      {service.children.map((serviceCategory) => (
                        <>
                          {serviceCategory.children.length ? (
                            <>
                              <span
                                className="mb-2 font-serif text-lg  cursor-pointer "
                                key={`${serviceCategory.slug}`}
                                onClick={() => setMenuopen(!menuOpen)}
                              >
                                {serviceCategory.title} {`->`}
                              </span>
                              <div>
                                {menuOpen ? (
                                  <>
                                    {serviceCategory.children.map(
                                      (serviceSubCategory) => (
                                        <>
                                          {serviceSubCategory.children
                                            .length ? (
                                            <>
                                              <h5
                                                className="ml-6 font-bold text-lg text-main-green-shade"
                                                key={`${serviceSubCategory.slug}`}
                                              >
                                                {`Fillers`}
                                              </h5>
                                              {serviceSubCategory.children.map(
                                                (lowestservice) => (
                                                  <div className="flex flex-row">
                                                    <Link
                                                      to={`/${service.slug}/${serviceCategory.slug}/${serviceSubCategory.slug}/${lowestservice.slug}`}
                                                      className="hover:text-white ml-12"
                                                    >
                                                      <h5>
                                                        {
                                                          serviceSubCategory.title
                                                        }{" "}
                                                      </h5>
                                                    </Link>
                                                  </div>
                                                )
                                              )}
                                            </>
                                          ) : (
                                            <div>
                                              <Link
                                                to={`/${service.slug}/${serviceCategory.slug}/${serviceSubCategory.slug}`}
                                                className="hover:text-white ml-6 text-lg"
                                              >
                                                {serviceSubCategory.title}
                                              </Link>
                                            </div>
                                          )}
                                        </>
                                      )
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </>
                          ) : (
                            <Link
                              to={`/${service.slug}/${serviceCategory.slug}`}
                              className="hover:text-white"
                            >
                              {serviceCategory.title}
                            </Link>
                          )}
                        </>
                      ))}
                    </div>
                  );
                })}
            </div>
          </div>
        </div> */}
      </nav>
    </div>
  );
}
