"use client";

import { motion } from "framer-motion";
import { Squares } from "@/components/ui/squares-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    title: "The Future of Battery Technology",
    excerpt: "Exploring the latest advancements in battery technology and their impact on renewable energy.",
    author: "Dr. Sarah Chen",
    date: "Feb 25, 2025",
    readTime: "5 min read",
    image: "/blog/battery-tech.jpg",
    category: "Technology",
  },
  {
    title: "Decentralized Energy Trading: A Comprehensive Guide",
    excerpt: "Understanding how P2P energy trading works and its benefits for consumers and the environment.",
    author: "Michael Rodriguez",
    date: "Feb 23, 2025",
    readTime: "8 min read",
    image: "/blog/energy-trading.jpg",
    category: "Guide",
  },
  {
    title: "AI in Energy Management",
    excerpt: "How artificial intelligence is revolutionizing the way we manage and distribute energy.",
    author: "Emma Thompson",
    date: "Feb 20, 2025",
    readTime: "6 min read",
    image: "/blog/ai-energy.jpg",
    category: "AI & ML",
  },
  {
    title: "Sustainable Energy Solutions for Businesses",
    excerpt: "A detailed look at how businesses can benefit from sustainable energy solutions.",
    author: "James Wilson",
    date: "Feb 18, 2025",
    readTime: "7 min read",
    image: "/blog/sustainable-business.jpg",
    category: "Business",
  },
  {
    title: "The Rise of Smart Grids",
    excerpt: "Exploring how smart grids are transforming energy distribution networks.",
    author: "Dr. Sarah Chen",
    date: "Feb 15, 2025",
    readTime: "4 min read",
    image: "/blog/smart-grid.jpg",
    category: "Technology",
  },
  {
    title: "Blockchain in Energy: Beyond the Hype",
    excerpt: "A realistic assessment of blockchain's role in the energy sector.",
    author: "Michael Rodriguez",
    date: "Feb 12, 2025",
    readTime: "9 min read",
    image: "/blog/blockchain-energy.jpg",
    category: "Blockchain",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <BackButton />
      {/* Base Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f78a1d10_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d10_1px,transparent_1px)] bg-[size:14px_14px]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f78a1d15_1px,transparent_1px),linear-gradient(to_bottom,#f78a1d15_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <Squares 
        direction="diagonal"
        speed={0.3}
        squareSize={30}
        borderColor="rgba(247, 138, 29, 0.1)"
        hoverFillColor="rgba(247, 138, 29, 0.05)"
        className="fixed inset-0"
      />

      <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Insights and updates from the ChargeX team on energy technology, sustainability, and more.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="relative"
            >
              <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="relative rounded-[1.25rem] border-[0.75px] border-[#f78a1d30] p-2 md:rounded-[1.5rem] md:p-3 transition-transform hover:scale-[1.02]">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                  />
                  <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[#f78a1d] text-sm">{post.category}</span>
                        <span className="text-gray-400 text-sm">{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{post.author}</span>
                        <span className="text-gray-400 text-sm">{post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
