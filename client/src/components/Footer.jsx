/* eslint-disable no-unused-vars */
import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitterX, BsGithub } from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Greenwich&apos;s
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://greenwich.edu.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My School
                </Footer.Link>
                <Footer.Link href="/about">About</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Contact us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/hansoo280102"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="https://www.facebook.com/profile.php?id=100021283875912">
                  Facebook
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#">Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div>
          <Footer.Copyright
            href="#"
            by="Tantran's website"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              href="https://www.facebook.com/profile.php?id=100021283875912"
              icon={BsFacebook}
            />
            <Footer.Icon
              href="https://www.instagram.com/darealgudboi/?fbclid=IwY2xjawFqP2pleHRuA2FlbQIxMAABHQskaS14HpEFduRR_fgdK2F8JlTZWaiPrRgtJhzdE2acZURqZZR-1JXuSw_aem_Tlqj-MxF5CZTVEOq2peYrg"
              icon={BsInstagram}
            />
            <Footer.Icon href="https://x.com/?lang=vi" icon={BsTwitterX} />
            <Footer.Icon
              href="https://github.com/hansoo280102"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
