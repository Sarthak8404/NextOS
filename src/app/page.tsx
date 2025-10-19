"use client";
import React from "react";
import { Cover } from "@/components/ui/cover";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { CodeBlockDemo } from "./components/codeblock";
export default function HomePage() {

  return (
    <section className="relative z-10">
        <div className="grid max-w-screen-xl px-6 py-12 mx-auto lg:gap-12 xl:gap-16 lg:grid-cols-12">
          {/* Left side (Text) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="max-w-2xl mb-6 text-4xl font-extrabold leading-tight md:text-5xl xl:text-6xl dark:text-white">
              The bridge between your tools and the <Cover>AI revolution.</Cover>
            </h1>
            <p className="max-w-2xl mb-8 font-light text-gray-500 md:text-lg lg:text-xl dark:text-gray-400">
              Seamlessly transform everyday tools into LLM-ready engines that power intelligent applications, faster, and smarter than ever before.
            </p>
            <div className="flex space-x-4">
              <a href="/browse">
              <HoverBorderGradient
                containerClassName="rounded-full p-[2px]"
                as="button"
                className="bg-white dark:bg-black text-black dark:text-white flex items-center space-x-2 rounded-full px-4 py-2"
              >
                <span>Browse Tools</span>
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </HoverBorderGradient>
              </a>
              <a href="/docs" >
              <button className="px-5 py-2 border border-white text-white rounded-xl transition-all duration-300 bg-transparent hover:bg-white hover:text-black">
                Learn More
              </button>
              </a>
            </div>
          </div>

          {/* Right side (Code Block) */}
          <div className="lg:col-span-5 flex items-center justify-center p-4">
            <div className="ml-26">
    <CodeBlockDemo />
  </div>

          </div>
        </div>
      </section>
  );
}