import { Shield, Zap, Eye, Lock } from "lucide-react";

export default function Hero() {
  return (
    <div className="text-center space-y-8 my-12">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Omni-Shield
        </span>
      </h1>
      
      <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        AI-Powered Autonomous Security Agent for Ethereum Wallets
      </div>
      
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        Protect your wallet from real-time exploits with automatic approval revocation, 
        gasless execution, and intelligent threat detection.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mt-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Eye className="w-4 h-4 text-blue-500" />
          <span>Real-time Monitoring</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Zap className="w-4 h-4 text-green-500" />
          <span>Autonomous Protection</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Lock className="w-4 h-4 text-purple-500" />
          <span>Gasless Security</span>
        </div>
      </div>
    </div>
  );
}
