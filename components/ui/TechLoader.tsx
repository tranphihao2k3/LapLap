'use client';
import { motion } from "framer-motion";
import { Laptop, Zap } from "lucide-react";

export default function TechLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-[3px] border-t-cyan-500 border-r-transparent border-b-blue-600 border-l-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Middle Ring */}
                <motion.div
                    className="absolute inset-3 rounded-full border-[2px] border-t-transparent border-r-purple-500 border-b-transparent border-l-cyan-400 opacity-70"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring */}
                <motion.div
                    className="absolute inset-6 rounded-full border border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent opacity-50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Central Icon container */}
                <div className="relative z-10 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm rounded-full p-4 border border-white/10">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            filter: ["drop-shadow(0 0 0px rgba(34,211,238,0))", "drop-shadow(0 0 10px rgba(34,211,238,0.5))", "drop-shadow(0 0 0px rgba(34,211,238,0))"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Laptop className="w-10 h-10 text-cyan-500" />
                    </motion.div>

                    {/* Tech Particles */}
                    <motion.div
                        className="absolute top-2 right-2"
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                        <Zap className="w-3 h-3 text-yellow-400 fill-current" />
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full animate-pulse"></div>
            </div>

            {/* Loading Text */}
            <motion.div
                className="mt-8 font-mono text-slate-600 font-bold tracking-[0.2em] text-sm flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <span className="text-cyan-600">SYSTEM</span>
                <span className="text-gray-400">PROCESSING</span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-blue-500 font-black"
                >_</motion.span>
            </motion.div>
        </div>
    );
}
